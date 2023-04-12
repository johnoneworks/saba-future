# saba-future
This will be the awesome prediction market that will be the future for us

# Vision
    - Any resolvable prediction (event) can allow market exchanges

# Tech Overview
    - Utilize Polygon Chain (L2 sidechain of Ethereum) for web3 deployment

# Prerequisite
    - npm (16.16.0)
        - highly recommend nvm
    - Alchemy Account
    - Hardhat
        - `npm install --save-dev hardhat`
    - Metamask

# Usage
    - Compile Contract
        - `npx hardhat compile`
    - Deploy
        - to mumbai
            - `npx hardhat run scripts/deploy.js --network mumbai`
        - to hardhat network
            - `npx hardhat run scripts/deploy.js`

# Resources
    - Faucets (free test network tokens)
        - https://mumbaifaucet.com/
        - https://goerlifaucet.com/
        - https://sepoliafaucet.com/
    - ethers doc
        - https://docs.ethers.org/v6/

## MVP Stories
    - Two roles within platform: Admin & Players
        - Admin will be in charge of creating and resolving predictions
        - Player will be able to make markets on the predictions
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