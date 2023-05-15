# Intro
This is the part with the smart contract related functions

# Usage
    - Compile Contract
        - `npx hardhat compile`
    - Deploy
        - to mumbai
            - `npx hardhat run scripts/deploy-prediction-world.js --network mumbai`
        - to hardhat network
            - `npx hardhat run scripts/deploy.js`
    - copy the ~/harhat/artifacts/contracts/PredictionWorld3.json & ~/harhat/artifacts/contracts/SureToken3.json to ~/nextjs/utils/abis
    - Transfer SURE to PredictionWorld3
        - note, need to transfer token to PredictionWorld3

# Resources
    - Faucets (free test network tokens)
        - https://mumbaifaucet.com/
        - https://goerlifaucet.com/
        - https://sepoliafaucet.com/
    - ethers doc
        - https://docs.ethers.org/v6/
    - remix
        - https://medium.com/coinmonks/interact-with-a-live-deployed-smart-contract-using-remix-ide-1ea7e3fde52f

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