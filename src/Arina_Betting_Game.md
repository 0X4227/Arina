# Ariena Betting Game

## Short Description

**Ariena** is an exciting friends betting game where players can challenge each other with various bets. Friends can initiate challenges with a specified prize amount, and other friends can place bets on their favorite challengers or challengeds. The game combines strategy, skill, and a competitive spirit, all while maintaining a fun and engaging environment. With support for cryptocurrency wallet addresses and a seamless user experience, Ariena provides a platform for friendly competition and betting.

## Database Structure

The following is the normalized Firebase NoSQL structure used in Ariena:

### 1. Users Collection

Stores information about each user in the game.

```json
{
  "users": {
    "userId": {
      "username": "string", // Unique username for display
      "email": "string", // User's email address
      "balance": "number", // Amount of money the user has for betting
      "walletAddress": "string", // User's wallet address for transactions
      "createdAt": "timestamp", // When the user account was created
      "updatedAt": "timestamp", // Last time user data was updated
      "profilePictureUrl": "string", // Optional link to user's profile picture
      "bio": "string", // Optional bio or description for the user
      "lastLogin": "timestamp" // Optional field to track last login time
    }
  }
}
```

### 2. Challenges Collection

Stores information about each challenge initiated in the game.

```json
{
  "challenges": {
    "challengeId": {
      "initiatorId": "userId", // Reference to the user who initiated the challenge
      "prizeAmount": "number", // Total amount set for the challenge
      "status": "string", // e.g., 'pending', 'accepted', 'completed', 'cancelled'
      "createdAt": "timestamp", // When the challenge was created
      "updatedAt": "timestamp" // Last time challenge data was updated
    }
  }
}
```

### 3. Challenged Users Collection

Stores references to users who are being challenged in each challenge.

```json
{
  "challengedUsers": {
    "challengeId": {
      "challengeds": ["userId1", "userId2"] // References to the users being challenged (including the initiator if applicable)
    }
  }
}
```

### 4. Bets Collection

Stores information about bets placed by users.

```json
{
  "bets": {
    "betId": {
      "challengeId": "challengeId", // Reference to the challenge being bet on
      "bettorId": "userId", // Reference to the user placing the bet
      "amount": "number", // Amount bet
      "choice": "string", // e.g., 'challenger' or 'challenged'
      "createdAt": "timestamp", // When the bet was placed
      "isPlayerBet": "boolean" // Indicates if this bet is from a player in the challenge
    }
  }
}
```

### 5. Transactions Collection

Stores details of all financial transactions related to users.

```json
{
  "transactions": {
    "transactionId": {
      "userId": "userId", // Reference to the user making the transaction
      "amount": "number", // Amount of money added or deducted
      "type": "string", // e.g., 'deposit', 'bet', 'payout'
      "transactionHash": "string", // Unique hash for verifying the transaction
      "createdAt": "timestamp" // When the transaction occurred
    }
  }
}
```

## Betting Mechanism

### Key Concepts for Fair Betting

1. **Betting Pools**:

   - Create a separate betting pool for each challenge, aggregating all bets placed by supporters and players.

2. **Winnings Calculation**:
   - The payout for the winner can be calculated based on the total amount in the betting pool and the individual contributions.

### Formulas for Winnings and Losses

1. **Winnings Calculation for Winners**:

   - **Formula**:
     \[
     ext{Winnings} = \left(rac{ ext{Total Pool}}{ ext{Total Bets on Loser}}
     ight) imes ext{Individual Bet Amount}
     \]

2. **Losses for Supporters on Losing Side**:
   - Supporters who bet on the losing side lose their entire bet amount.

### Example Scenario

#### Example Setup

- **Total Bets**:
  - Total Bets on Challenger: \$200
  - Total Bets on Challenged: \$300
  - **Total Pool**: $500 (i.e., $200 + \$300)

#### Outcomes

- **Outcome**: Challenger wins.

#### Calculation of Winnings

- **Supporter Bets**:
  - Supporter 1 (on Challenger): Bet \$50
  - Supporter 2 (on Challenger): Bet \$150
  - Supporter 3 (on Challenged): Bet \$100
  - Supporter 4 (on Challenged): Bet \$200

#### Calculation Steps

1. **Total Bets on Challenged**: \$300
2. **Total Pool**: \$500

##### For Supporter 1:

\[
ext{Winnings} = \left(rac{500}{300}
ight) imes 50 = rac{500 imes 50}{300} pprox 83.33
\]

##### For Supporter 2:

\[
ext{Winnings} = \left(rac{500}{300}
ight) imes 150 = rac{500 imes 150}{300} pprox 250.00
\]

#### Losses Calculation for Supporters on Losing Side

- **Supporters who bet on the Challenged**:
  - Supporter 3: Bet $100 (Loss = $100)
  - Supporter 4: Bet $200 (Loss = $200)

### Summary Table of Bets

| Supporter   | Bet Amount | Outcome    | Winnings/Loss |
| ----------- | ---------- | ---------- | ------------- |
| Supporter 1 | \$50       | Challenger | \$83.33       |
| Supporter 2 | \$150      | Challenger | \$250.00      |
| Supporter 3 | \$100      | Challenged | -\$100        |
| Supporter 4 | \$200      | Challenged | -\$200        |

## Conclusion

Ariena provides a platform for friendly competition and betting among friends. The structured database ensures efficient management of users, challenges, bets, and transactions while providing a seamless user experience. By implementing fair betting mechanics, including transparent calculations of winnings and losses, players can enjoy the thrill of betting and the excitement of challenges in Ariena!
