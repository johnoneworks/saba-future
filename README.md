# saba-future
This will be the awesome prediction market that will be the future for us

# Vision
    - Any resolvable prediction (event) can allow market exchanges

# Tech Overview
    - Utilize Polygon Chain (L2 sidechain of Ethereum) for web3 deployment
    - hardhat folder & nextjs folder

# Prerequisite
    - npm (16.16.0)
        - highly recommend nvm
    - Alchemy Account
    - Hardhat
        - `npm install --save-dev hardhat`
    - Metamask

## Terminology
    - 3 Roles
            - Owner (PredictionWorld contract creator)
            - Admin (Will be owner by default) - create/resolve markets
            - Player - make bets * owner and admin can do so too
    - Create Prediction (Owner/Admin)
        - check /hardhat/contracts/PredictionWorld3.sol
    - Place Bet
        - check /hardhat/contracts/PredictionWorld3.sol
    - Event Resolve(settle market)
        - check /hardhat/contracts/PredictionWorld3.sol

## MVP Stories
    - Functioning
        - US1: Admin can create market
        - US2: New Player start with zero tokens
        - US3: Admin can transfer tokens to New(Any) Player
        - US4: Player with SURE can place bet on market
            - note, need to transfer token to PredictionWorld
        - US5: Admin can settle markets(distributeWinning)

    - Not yet functioning
        - US6: 

### Backlog
    - Real Matic
    - Partial taking of market
    - Cancel market(only the part not yet taken)
    - Prediction Creation by Player
    - Automatic prediction resolvement
    - Total Pool Betting
    - Rake for a setup contract
    - Social Signup
    - Show correct SURE token