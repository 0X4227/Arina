// Find all our documentation at https://docs.near.org
use near_sdk::collections::{LazyOption, LookupMap, LookupSet, UnorderedMap, UnorderedSet, Vector};
use near_sdk::serde::Serialize;
use near_sdk::{env, log, near, near_bindgen, require, AccountId, NearSchema, NearToken, Promise};

mod arena;

// Define the contract structure
#[near(contract_state)]
pub struct ArenaProtocolContract {
    pub protocol_account: AccountId,
    pub ft_contract: AccountId,

    pub challenge_counter: u32,

    // Winner: UnorderedMap of AccountId -> (UnorderedMap of ChallengeID -> UnorderedMap of account_id -> new_vote)
    pub winners: UnorderedMap<u32, UnorderedMap<AccountId, u8>>,

    // Bet: UnorderedMap of ChallengeID -> (UnorderedMap of self_account -> UnorderedMap of account_id -> amount)
    pub bets: UnorderedMap<u32, UnorderedMap<AccountId, UnorderedMap<AccountId, u128>>>,

    // Challenge: UnorderedMap of unique ID -> Link
    pub challenges: UnorderedMap<u32, String>,

    // Store which accounts have voted for each challenge
    pub voted_accounts: UnorderedMap<u32, UnorderedSet<AccountId>>, // New field

}

// Define the default, which automatically initializes the contract
impl Default for ArenaProtocolContract {
    fn default() -> Self {
        Self {
            protocol_account: "v2.faucet.nonofficial.testnet".parse().unwrap(),
            ft_contract: "v2.faucet.nonofficial.testnet".parse().unwrap(),
            challenge_counter: 1,
            winners: UnorderedMap::new(b"w"),
            bets: UnorderedMap::new(b"b"),
            challenges: UnorderedMap::new(b"c"),
            voted_accounts: UnorderedMap::new(b"v"), // Initializing new field
        }
    }
}

// Implement the contract structure
#[near]
impl ArenaProtocolContract {
    // Public Method - but only callable by env::current_account_id()
    // initializes the contract with a beneficiary
    #[init]
    #[private]
    pub fn init(new_protocol_account: AccountId, new_ft_contract: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            protocol_account: new_protocol_account,
            challenge_counter: 1,
            ft_contract: new_ft_contract,
            winners: UnorderedMap::new(b"w"),
            bets: UnorderedMap::new(b"b"),
            challenges: UnorderedMap::new(b"c"),
            voted_accounts: UnorderedMap::new(b"v"), // Initializing new field
        }
    }

    // Public Method - get the current beneficiary
    pub fn get_protocol_account(&self) -> &AccountId {
        &self.protocol_account
    }

    // Public Method - but only callable by env::current_account_id()
    // sets the beneficiary
    #[private]
    pub fn change_protocol_account(&mut self, new_protocol_account: AccountId) {
        self.protocol_account = new_protocol_account;
    }
}
