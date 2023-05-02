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

## MVP Stories
    - US1: Admin can create market
    - US2: New Player start with zero tokens
    - US3: Admin can transfer tokens to New(Any) Player
    - US4: Player with SURE can place bet on market
        - note, need to transfer token to PredictionWorld
    - US5: Admin can settle markets

    - Two roles within platform: Admin(PredictionWorld contract owner) & Players(everyone else)
        - Admin will be in charge of creating and resolving markets
        - Player will be able to place bets(Yes/No) on the markets
    - Sign Up/ Sign In
        - Admin will get credentials manually from platform owner
        - Players can sign up "magically" with just an email
        - After signing up, the player will get 100 SURE(SabaFuture) tokens
    - Create Prediction (Admin)
        - Info
            - Description of a Yes/No prediction, e.g. Will Lakers win tomorrow
            - Details(optional)
            - Last Accept time
            - Resolve Time
    - Open Market (Player)
        - According to prediction, player can open, e.g. 50 SURE for 80 SURE on "yes"
    - Take Market (Player)
        - For opened market, player can take it all up => basically exchange
    - Event Resolve
        - Transfer SURE tokens to players accordingly

### Backlog
    - Real Matic
    - Partial taking of market
    - Cancel market(only the part not yet taken)
    - Prediction Creation by Player
    - Automatic prediction resolvement
    - Total Pool Betting

## Contracts
    - Prediction
        - Owner // the admin role person(s)
        - Description
        - Last Accept time
        - Resolve Time
        - Markets[(amount, maker, taker?, odds)] // just use decimal odds for now

        - Constructor()
        - CreateMarket((amount, odds))
        - ResolvePrediction(result)
        - TakeMarket(amount, odds)