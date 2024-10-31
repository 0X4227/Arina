use near_sdk::collections::UnorderedMap;
use near_sdk::collections::{LookupMap, UnorderedSet, Vector};
use near_sdk::env::current_account_id;
use near_sdk::json_types::U128;
use near_sdk::serde::Serialize;
use near_sdk::PromiseOrValue;
use near_sdk::{
    env, log, near_bindgen, require, AccountId, BorshStorageKey, Gas, NearSchema, NearToken,
    Promise,
};
use std::collections::HashMap;

use near_sdk::{ext_contract, PromiseResult};
use near_sdk::{serde_json::json, GasWeight};

use near_sdk::serde::Deserialize;
use near_sdk::serde_json;

pub const STORAGE_COST: NearToken = NearToken::from_millinear(1);
pub const MIN_GAS_FOR_FT_TRANSFER: Gas = Gas::from_tgas(5);

use crate::ArenaProtocolContract;
use crate::ArenaProtocolContractExt;

// Constants for the challenge states
pub const STATE_PENDING: u8 = 1;
pub const STATE_ONGOING: u8 = 2;
pub const STATE_VOTING: u8 = 3;
pub const STATE_VOTING_FINISH: u8 = 4;
pub const STATE_CLAIM: u8 = 5;
pub const STATE_CANCELLED: u8 = 5;

/// FT contract
#[ext_contract(ext_ft_contract)]
trait ExtFTContract {
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>);
    fn ft_transfer_call(
        &self,
        receiver_id: AccountId,
        amount: u128,
        memo: Option<String>,
        msg: String,
    );
}

#[derive(Deserialize)]
#[serde(crate = "near_sdk::serde")]
struct TokenReceiverMessage {
    action: String,
    participant: Option<AccountId>,
    challenge_link: Option<String>, // New field for challenge link
    challenge_id: Option<u32>,      // For PlaceBetOnly
}

#[near_bindgen]
impl ArenaProtocolContract {
    pub fn get_challenge_counter(&self) -> u32 {
        self.challenge_counter
    }
    // Method to add a challenge with a unique ID and a link
    pub fn add_challenge(&mut self, link: String) -> u32 {
        let challenge_id = self.challenge_counter;
        // self.challenges.insert(&challenge_id, &link);

        let state_string = Self::state_to_string(STATE_PENDING);
        self.challenges.insert(&challenge_id, &state_string);

        self.challenge_counter += 1; // Increment the counter for the next challenge
        challenge_id
    }

    // Method to get challenge link by ID
    pub fn get_challenge(&self, challenge_id: u32) -> Option<String> {
        self.challenges.get(&challenge_id)
    }
    // Method to place a bet on a participant in a challenge
    pub fn place_bet(
        &mut self,
        account: AccountId,
        challenge_id: u32,
        participant: AccountId,
        amount: u128,
    ) {
        let current_state = self
            .get_challenge(challenge_id)
            .expect("Challenge does not exist");

        // Ensure that bets cannot be placed if the state is Voting, Claim, or Cancelled
        assert!(
            current_state != Self::state_to_string(STATE_VOTING)
                && current_state != Self::state_to_string(STATE_CLAIM)
                && current_state != Self::state_to_string(STATE_CANCELLED),
            "Cannot place a bet on a challenge because it is in voting, claim, or cancelled state"
        );
        // Convert challenge_id to Vec<u8> using `to_le_bytes`
        let mut challenge_prefix = challenge_id.to_le_bytes().to_vec();

        // Clone `challenge_prefix` to avoid moving it into the closure
        let challenge_prefix_clone = challenge_prefix.clone();
        // Attempt to retrieve the bets map for the given challenge ID
        let mut self_map = match self.bets.get(&challenge_id) {
            Some(map) => {
                log!("Found existing self_map for challenge_id={}", challenge_id);
                map
            }
            None => {
                log!(
                    "No self_map found for challenge_id={}, creating a new one.",
                    challenge_id
                );
                UnorderedMap::new(challenge_prefix_clone) // Use challenge ID as the prefix
            }
        };

        // Combine challenge_id and account to create a unique prefix for amount map
        // challenge_prefix.extend_from_slice(account.as_bytes()); // Append account bytes to the challenge prefix
        challenge_prefix.extend_from_slice(account.as_bytes());
        // Attempt to retrieve the amount map for the given account
        let mut amount_map = match self_map.get(&account) {
            Some(map) => {
                log!("Found existing amount_map for account={}", account);
                map
            }
            None => {
                log!(
                    "No amount_map found for account={}, creating a new one.",
                    account
                );
                UnorderedMap::new(challenge_prefix) // Use account ID as the prefix
            }
        };
        // Get the current amount bet on the participant, or 0 if no previous bet exists
        let current_bet = amount_map.get(&participant).unwrap_or(0);
        // Add the new bet amount to the previous bet
        let new_bet_amount = current_bet.saturating_add(amount);
        // Insert the updated bet amount into the amount map
        amount_map.insert(&participant, &new_bet_amount);
        // Insert the updated amount map back into the self_map for the account
        self_map.insert(&account, &amount_map);

        // Insert the updated self_map back into the bets map for the challenge ID
        self.bets.insert(&challenge_id, &self_map);

        self.update_set_challenge_state(challenge_id, STATE_ONGOING);

        log!(
            "Bet placed successfully for challenge_id={}, account={}, participant={}, amount={}",
            challenge_id,
            account,
            participant,
            new_bet_amount
        );
    }
    // Method to get the bet amount for a participant in a challenge
    pub fn get_bet_amount(
        &self,
        challenge_id: u32,
        account: AccountId,
        participant: AccountId,
    ) -> Option<u128> {
        self.bets
            .get(&challenge_id)
            .and_then(|self_map| self_map.get(&account))
            .and_then(|amount_map| amount_map.get(&participant))
    }

    #[payable]
    pub fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        let token_in = env::predecessor_account_id();
        assert!(token_in == self.ft_contract, "The token is not supported");

        env::log_str(format!("Sender id: {:?}", sender_id).as_str());
        env::log_str(format!("Amount: {:?}", amount).as_str());
        env::log_str(format!("Message: {:?}", msg).as_str());

        if msg.is_empty() {
            env::log_str(format!("Message is empty : {:?}", sender_id).as_str());
            PromiseOrValue::Value(U128(0))
        } else {
            let message: TokenReceiverMessage =
                serde_json::from_str(&msg).expect("WRONG_MSG_FORMAT");

            match message.action.as_str() {
                "AddChallengeAndPlaceBet" => {
                    // Handle case where both add_challenge and place_bet are called
                    if let Some(participant) = message.participant {
                        if let Some(challenge_link) = message.challenge_link {
                            // Add the challenge with the provided link
                            let challenge_id = self.add_challenge(challenge_link);
                            env::log_str(format!("challenge_id {:?}", challenge_id).as_str());

                            // Place the bet after adding the challenge
                            self.place_bet(sender_id.clone(), challenge_id, participant, amount.0);

                            PromiseOrValue::Value(U128(0)) // Return success
                        } else {
                            env::panic_str(
                                "Challenge link is required for AddChallengeAndPlaceBet",
                            );
                        }
                    } else {
                        env::panic_str("participant is None");
                    }
                }
                "PlaceBetOnly" => {
                    // Handle case where only place_bet is called
                    if let Some(participant) = message.participant {
                        if let Some(challenge_id) = message.challenge_id {
                            // Check if the challenge_id exists in self.challenges
                            if self.challenges.get(&challenge_id).is_some() {
                                // Place the bet if the challenge exists
                                self.place_bet(
                                    sender_id.clone(),
                                    challenge_id,
                                    participant,
                                    amount.0,
                                );

                                PromiseOrValue::Value(U128(0)) // Return success
                            } else {
                                env::panic_str("Challenge ID does not exist");
                            }
                        } else {
                            env::panic_str("challenge_id is required for PlaceBetOnly");
                        }
                    } else {
                        env::panic_str("participant is None");
                    }
                }
                _ => env::panic_str("Unknown action"),
            }
        }
    }

    // Method to get all betting amounts for a given challenge_id
    pub fn get_all_betting_amounts_by_challenge(
        &self,
        challenge_id: u32,
    ) -> HashMap<AccountId, u128> {
        let mut total_bets: HashMap<AccountId, u128> = HashMap::new();

        // Retrieve the bets map for the given challenge
        if let Some(bets_map) = self.bets.get(&challenge_id) {
            // Loop through all participants and accumulate their bets
            for (account, participant_map) in bets_map.iter() {
                for (_, bet_amount) in participant_map.iter() {
                    // Accumulate total bet amount for each account
                    let entry = total_bets.entry(account.clone()).or_insert(0);
                    *entry += bet_amount; // Add the bet amount to the account's total
                }
            }
        }

        total_bets
    }

    // Method to update votes and positions based on the list of participants
    // Method to update votes and positions based on the list of participants
    pub fn update_winner_by_challenge(&mut self, challenge_id: u32, participants: Vec<AccountId>) {
        let account_id = env::signer_account_id();

        // Ensure that the account has placed a bet in the challenge before allowing a vote
        assert!(
            self.bets
                .get(&challenge_id)
                .and_then(|self_map| self_map.get(&account_id))
                .is_some(),
            "Only accounts that placed a bet can vote"
        );

        // Prepare the prefix for vote tracking
        let mut vote_prefix = challenge_id.to_be_bytes().to_vec();
        vote_prefix.push(b's'); // Add a byte to identify votes

        // Check if the account has already voted
        let mut voted_accounts = self
            .voted_accounts
            .get(&challenge_id)
            .unwrap_or_else(|| UnorderedSet::new(vote_prefix));

        assert!(
            !voted_accounts.contains(&account_id),
            "You have already voted for this challenge"
        );

        // Register the vote by the account
        voted_accounts.insert(&account_id);
        self.voted_accounts.insert(&challenge_id, &voted_accounts);

        // Assign votes and positions based on the provided participant list
        let mut unique_prefix = challenge_id.to_be_bytes().to_vec();
        unique_prefix.push(b'z'); // Add a byte to identify winners

        // Retrieve existing votes for this challenge, if any, to accumulate votes
        let mut participant_map = self
            .winners
            .get(&challenge_id)
            .unwrap_or_else(|| UnorderedMap::new(unique_prefix));

        // Increment vote counts for each participant based on their position
        for participant in participants.iter() {
            // Update the vote count by adding new vote to the existing count (if any)
            let vote_count = participant_map.get(participant).unwrap_or(0) + 1;
            participant_map.insert(participant, &vote_count);
        }

        // Store the updated participant map with accumulated votes
        self.winners.insert(&challenge_id, &participant_map);

        self.update_set_challenge_state(challenge_id, STATE_VOTING);

        // After updating votes, update the positions if necessary
    }

    // Method to get winners and their positions by challenge_id
    pub fn get_winners_and_positions_by_challenge(
        &self,
        challenge_id: u32,
    ) -> Option<HashMap<AccountId, u8>> {
        // Get the vote counts and positions of participants
        let participant_map = self.winners.get(&challenge_id)?;

        // Combine vote counts and positions into a result HashMap
        let mut result = HashMap::new();
        for (participant, vote) in participant_map.iter() {
            result.insert(participant.clone(), (vote));
        }
        Some(result)
    }

    pub fn calculate_winnings(&self, challenge_id: u32, rank: u8) -> Vec<(AccountId, u128)> {
        let current_state = self
            .get_challenge(challenge_id)
            .expect("Challenge does not exist");

        // Ensure that bets cannot be placed if the state is Voting, Claim, or Cancelled
        assert!(
            current_state != Self::state_to_string(STATE_VOTING),
            "Cannot place a bet on a challenge because claim, or cancelled state"
        );

        // Retrieve the vote counts for all participants in the challenge
        let participant_votes: UnorderedMap<AccountId, u8> = self
            .winners
            .get(&challenge_id)
            .expect("Winners for this challenge not found");

        // Sort participants by vote count in descending order
        let mut sorted_participants: Vec<(AccountId, u8)> = participant_votes
            .iter()
            .map(|(k, v)| (k.clone(), v))
            .collect();
        sorted_participants.sort_by(|a, b| b.1.cmp(&a.1)); // Sort by votes (descending)

        // Initialize the list of winners based on rank
        let mut winners: Vec<AccountId> = Vec::new();

        // Add participants to winners list based on rank or handle ties if votes are the same
        if rank == 1 {
            // Default case: Find the highest number of votes
            let max_votes = sorted_participants[0].1; // Highest vote count
            winners = sorted_participants
                .iter()
                .filter(|(_, votes)| *votes == max_votes) // Include participants with max votes
                .map(|(participant, _)| participant.clone())
                .collect();
        } else {
            // Handle ranks beyond 1 (top N participants)
            winners = sorted_participants
                .iter()
                .take(rank as usize) // Take top N participants
                .map(|(participant, _)| participant.clone())
                .collect();
        }

        // Retrieve the nested map of bets for this challenge
        let challenge_bets: UnorderedMap<AccountId, UnorderedMap<AccountId, u128>> = self
            .bets
            .get(&challenge_id)
            .expect("Challenge bets not found");

        // Initialize variables to store total bets and the pool
        let mut total_bets_on_winner: u128 = 0;
        let mut total_bets_on_loser: u128 = 0;
        let mut total_pool: u128 = 0;

        // Iterate over the accounts and their bets in the challenge
        for (account, account_bets) in challenge_bets.iter() {
            // Iterate over the participant bets for this account
            for (participant, bet) in account_bets.iter() {
                // let bet_amount = *bet;

                // Check if the participant is one of the winners
                if winners.contains(&participant) {
                    // // If the participant is a winner, add to the winner's total
                    total_bets_on_winner = total_bets_on_winner.saturating_add(bet);
                } else {
                    // Otherwise, add to the loser's total
                    // total_bets_on_loser += bet_amount;
                    total_bets_on_loser = total_bets_on_loser.saturating_add(bet);
                }
                // Add the bet to the total pool
                total_pool = total_pool.saturating_add(bet);
            }
        }

        env::log_str(
            format!(
                "total_pool :  {:?} , total_bets_on_winner :  {:?} , total_bets_on_loser :  {:?}",
                total_pool, total_bets_on_winner, total_bets_on_loser
            )
            .as_str(),
        );

        // Ensure there is a valid pool and bets on the losing side
        assert!(total_pool > 0, "Invalid total pool");

        // Formula to distribute winnings based on rank
        // You can modify this part to change the distribution formula.
        let distribute_winnings =
            |bet_amount: u128, rank: u8, total_bets_on_winner: u128| -> u128 {
                // Example formula: Winnings are scaled based on the rank
                let scale_factor = match rank {
                    1 => 1.0,  // 100% for first place
                    2 => 0.75, // 75% for second place
                    3 => 0.5,  // 50% for third place
                    _ => 0.25, // 25% for others
                };

                // Regular calculation if there's no tie
                ((total_pool * bet_amount) / total_bets_on_winner) as u128 * scale_factor as u128
            };

        // Create a vector to store the result for each supporter (winnings or losses)
        let mut result_vec: Vec<(AccountId, u128)> = Vec::new();

        // Calculate winnings for supporters on the winning side
        for (account, account_bets) in challenge_bets.iter() {
            let mut total_winnings_for_account: u128 = 0;

            // Iterate over the participant bets for this account
            for (participant, bet) in account_bets.iter() {
                // let bet_amount = *bet;

                // Check if the participant is one of the winners
                if winners.contains(&participant) {
                    // Calculate winnings using the formula based on rank
                    let winnings = distribute_winnings(bet, rank, total_bets_on_winner);
                    total_winnings_for_account =
                        total_winnings_for_account.saturating_add(winnings);
                }
            }

            // Add the total winnings for this account (or 0 if no winnings)
            if total_winnings_for_account > 0 {
                result_vec.push((account.clone(), total_winnings_for_account));
            } else {
                result_vec.push((account.clone(), 0)); // No winnings for this account
            }
        }

        // Return the vector containing each account's winnings or losses (0 for losses)
        result_vec
    }

    #[payable]
    pub fn claim_winnings(&mut self, challenge_id: u32, rank: u8) -> Vec<(AccountId, u128)> {
        let current_state = self
            .get_challenge(challenge_id)
            .expect("Challenge does not exist");

        // Ensure that bets cannot be placed if the state is Voting, Claim, or Cancelled
        assert!(
            current_state != Self::state_to_string(STATE_CLAIM)
                && current_state != Self::state_to_string(STATE_CANCELLED),
            "Cannot place a bet on a challenge because claim, or cancelled state"
        );

        // Retrieve the vote counts for all participants in the challenge
        let participant_votes: UnorderedMap<AccountId, u8> = self
            .winners
            .get(&challenge_id)
            .expect("Winners for this challenge not found");

        // Sort participants by vote count in descending order
        let mut sorted_participants: Vec<(AccountId, u8)> = participant_votes
            .iter()
            .map(|(k, v)| (k.clone(), v))
            .collect();
        sorted_participants.sort_by(|a, b| b.1.cmp(&a.1)); // Sort by votes (descending)

        // Initialize the list of winners based on rank
        let mut winners: Vec<AccountId> = Vec::new();

        // Add participants to winners list based on rank or handle ties if votes are the same
        if rank == 1 {
            // Default case: Find the highest number of votes
            let max_votes = sorted_participants[0].1; // Highest vote count
            winners = sorted_participants
                .iter()
                .filter(|(_, votes)| *votes == max_votes) // Include participants with max votes
                .map(|(participant, _)| participant.clone())
                .collect();
        } else {
            // Handle ranks beyond 1 (top N participants)
            winners = sorted_participants
                .iter()
                .take(rank as usize) // Take top N participants
                .map(|(participant, _)| participant.clone())
                .collect();
        }

        // Retrieve the nested map of bets for this challenge
        let challenge_bets: UnorderedMap<AccountId, UnorderedMap<AccountId, u128>> = self
            .bets
            .get(&challenge_id)
            .expect("Challenge bets not found");

        // Initialize variables to store total bets and the pool
        let mut total_bets_on_winner: u128 = 0;
        let mut total_bets_on_loser: u128 = 0;
        let mut total_pool: u128 = 0;

        // Iterate over the accounts and their bets in the challenge
        for (account, account_bets) in challenge_bets.iter() {
            // Iterate over the participant bets for this account
            for (participant, bet) in account_bets.iter() {
                // let bet_amount = *bet;

                // Check if the participant is one of the winners
                if winners.contains(&participant) {
                    // // If the participant is a winner, add to the winner's total
                    total_bets_on_winner = total_bets_on_winner.saturating_add(bet);
                } else {
                    // Otherwise, add to the loser's total
                    // total_bets_on_loser += bet_amount;
                    total_bets_on_loser = total_bets_on_loser.saturating_add(bet);
                }
                // Add the bet to the total pool
                total_pool = total_pool.saturating_add(bet);
            }
        }

        env::log_str(
            format!(
                "total_pool :  {:?} , total_bets_on_winner :  {:?} , total_bets_on_loser :  {:?}",
                total_pool, total_bets_on_winner, total_bets_on_loser
            )
            .as_str(),
        );

        // Ensure there is a valid pool and bets on the losing side
        assert!(total_pool > 0, "Invalid total pool");

        // Formula to distribute winnings based on rank
        // You can modify this part to change the distribution formula.
        let distribute_winnings =
            |bet_amount: u128, rank: u8, total_bets_on_winner: u128| -> u128 {
                // Example formula: Winnings are scaled based on the rank
                let scale_factor = match rank {
                    1 => 1.0,  // 100% for first place
                    2 => 0.75, // 75% for second place
                    3 => 0.5,  // 50% for third place
                    _ => 0.25, // 25% for others
                };

                // Regular calculation if there's no tie
                ((total_pool * bet_amount) / total_bets_on_winner) as u128 * scale_factor as u128
            };

        // Create a vector to store the result for each supporter (winnings or losses)
        let mut result_vec: Vec<(AccountId, u128)> = Vec::new();

        // Calculate winnings for supporters on the winning side
        for (account, account_bets) in challenge_bets.iter() {
            let mut total_winnings_for_account: u128 = 0;

            // Iterate over the participant bets for this account
            for (participant, bet) in account_bets.iter() {
                // let bet_amount = *bet;

                // Check if the participant is one of the winners
                if winners.contains(&participant) {
                    // Calculate winnings using the formula based on rank
                    let winnings = distribute_winnings(bet, rank, total_bets_on_winner);
                    total_winnings_for_account =
                        total_winnings_for_account.saturating_add(winnings);
                }
            }

            // Add the total winnings for this account (or 0 if no winnings)
            if total_winnings_for_account > 0 {
                result_vec.push((account.clone(), total_winnings_for_account));
            } else {
                result_vec.push((account.clone(), 0)); // No winnings for this account
            }
        }

        for (account_id, amount) in result_vec.iter() {
            if *amount > 0 {
                self.transfer_token(account_id.clone(), *amount);
            }
        }

        self.update_set_challenge_state(challenge_id, STATE_CLAIM);
        // Return the vector containing each account's winnings or losses (0 for losses)
        result_vec
    }

    #[payable]
    pub fn transfer_token(&mut self, receiver_id: AccountId, amount: u128) -> Promise {
        let promise = ext_ft_contract::ext(self.ft_contract.clone())
            .with_attached_deposit(NearToken::from_yoctonear(1))
            .ft_transfer(receiver_id, near_sdk::json_types::U128(amount), None);

        return promise.then(
            Self::ext(env::current_account_id())
                .with_static_gas(MIN_GAS_FOR_FT_TRANSFER)
                .external_call_callback(),
        );
    }

    #[private]
    pub fn external_call_callback(&self) -> bool {
        // handle the callback logic here
        true
    }

    // Helper function to convert u8 state to string
    fn state_to_string(state: u8) -> String {
        match state {
            STATE_PENDING => "1".to_string(),
            STATE_ONGOING => "2".to_string(),
            STATE_VOTING => "3".to_string(),
            STATE_CLAIM => "4".to_string(),
            STATE_CANCELLED => "5".to_string(),
            _ => "6".to_string(), // Default case for invalid state
        }
    }

    fn update_set_challenge_state(&mut self, challenge_id: u32, new_state: u8) {
        // Check if the challenge exists
        let current_state = self.challenges.get(&challenge_id);
        if current_state.is_none() {
            env::log_str(&format!("Challenge {} does not exist", challenge_id));
            return;
        }

        // Validate the new state value (must be between 1 and 5)
        assert!(new_state >= 1 && new_state <= 5, "Invalid state value");

        // Retrieve the previous state as a string
        let prev_state = current_state.unwrap();

        // Update the state of the challenge to the new state
        let new_state_string = Self::state_to_string(new_state);
        self.challenges.insert(&challenge_id, &new_state_string);

        // Log the previous and new states
        env::log_str(&format!(
            "Challenge {} state updated from {} to {}",
            challenge_id, prev_state, new_state_string
        ));
    }

    // Optionally, convert state string back to u8 (if needed in future logic)
    fn get_state(state: &str) -> Option<u8> {
        match state {
            "pending" => Some(STATE_PENDING),
            "ongoing" => Some(STATE_ONGOING),
            "voting" => Some(STATE_VOTING),
            "voting finish" => Some(STATE_VOTING_FINISH),
            "claim" => Some(STATE_CLAIM),
            "cancelled" => Some(STATE_CANCELLED),
            _ => None, // Unknown state
        }
    }

    pub fn check_bet_and_vote_count(&mut self, challenge_id: u32) {
        let mut voted_accounts = self
            .voted_accounts
            .get(&challenge_id)
            .unwrap_or_else(|| UnorderedSet::new(b'e'));

        // Get the length of the voted_accounts
        let voted_accounts_len = voted_accounts.len();

        let bets_length = self
            .bets
            .get(&challenge_id)
            .map_or(0, |self_map| self_map.len());

        // Check if the lengths are the same and update the challenge state if they are
        if bets_length == voted_accounts_len {
            self.update_set_challenge_state(challenge_id, STATE_VOTING_FINISH);
        }
    }
}

