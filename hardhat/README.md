# Intro
This is the part with the smart contract related functions

# Usage (Obsolete)
    - Compile Contract
        - `npx hardhat compile`
    - Deploy
        - to mumbai
            - `npx hardhat run ~/hardhat/scripts/deploy-prediction-world.js --network mumbai`
        - to hardhat network
            - `npx hardhat run ~/hardhat/scripts/deploy.js`
    - copy the ~/harhat/artifacts/contracts/PredictionWorld3.json & ~/harhat/artifacts/contracts/SureToken3.json to ~/nextjs/utils/abis
    - Transfer SURE to PredictionWorld3
        - note, need to transfer token to PredictionWorld3

# Contract Address Info

## Main Net
  - Admin Address: 0x158D23876645EBacA4942a23764446D5F74A4D8f
  - Sure: 0xE2F9F99c8651B86D8D96437710FfaE3c9688dB3c
  - Proxy: 0x39a0D0715D61E6C553C9CE06ac026eEbDe5037bA

# Usage (With Upgraded Proxy Support)

    - Environment Variable

        - API_URL

          Network URL. For different networks, it should be the specific url for the networks.
          Mumbai: https://polygon-mumbai.g.alchemy.com/v2/GDTl7qsRqT4CbILRcYxCOC1DF2-jpNuF

        - PRIVATE_KEY

          The private key of the owner address. You could export from the metamask.
          Note: When you deploy the sure-token, the address will be the Super-Admin who get the initial sure-token. You should **NOT** commit the Super-Admin private key to the git!!

        - SCAN_KEY

          The api key of the scan (EtherScan, PolygonScan...).
          Get it via going to the Blockchain Scan Site of your choice and from the API-keys
          After deploy the contract, it should verify the contract and the user could access the contrat by the Scan website.

        - SURE_TOKEN_ADDRESS

          The sure token address. It will be generated after executing deploySureToken.js. You don't have to set the variable before that.

        - PROXY_ADDRESS

          The proxy address. It will be generated after executing deployProxy.js. You don't have to set the variable before that. And it should not be updated when upgrading the new implementation contract.

          Note: If you redeploy the proxy, it'll clear all (state) data in the proxy.

        - UPGRADING_CONTRACT

          The new contrat name which you want to upgrade. It will be the address of the result of executing upgradeProxy.js. You don't have to set the variable before that.

    - Deploy Sure Token

        - Deploy the sure token contract.

          `npx hardhat run ~/hardhat/scripts/deploySureToken.js --network mumbai`

          You will get the information
            SURE Token(3) contract deployed to 0xF1CE94...

        - Verify the contract

          `npx hardhat verify --network mumbai <Sure Token Address>`

          Check the contract on the Scan website.
          ex: https://mumbai.polygonscan.com/address/<Sure Token Address>#code

        - Copy the address to env variable "SURE_TOKEN_ADDRESS".

    - Deploy Proxy + Implementation Contract

        - Confirm the "initialContract" in the ~/hardhat/script/deployProxy.js

        - Deploy the proxy and implementation contract.

          `npx hardhat run ~/hardhat/scripts/deployProxy.js --network mumbai`

          You will get the information
                       Sure Token: 0x552571d0...
                   Proxy Contract: 0x2efBe968...
          Implementation Contract: 0x75863C87...

        - Verify the contract

          `npx hardhat verify --network mumbai <Proxy Contract>`

          Check the contract on the Scan website.
          ex: https://mumbai.polygonscan.com/address/<Proxy Contract>#code

        - Copy "Proxy Contract" to env variable "PROXY_ADDRESS".

    - Transfer SURE to <Proxy Contract>
        - note, need to transfer token to the proxy for early-bird token

    - Upgrade Implementation Contract

        - Update the env variable "UPGRADING_CONTRACT" to new contract name.

        - Upgrade the proxy with new contract.

          `npx hardhat run ~/hardhat/scripts/upgradeProxy.js --network mumbai`

          You will get the information
                            Owner: 0xcc6Ccc0A...
                    Contract Name: PredictionWorld5
                   Proxy Contract: 0xb73Cc06D...
          Implementation Contract: 0xD8Ea726a...

        - Verify the contract

          `npx hardhat verify --network mumbai <Proxy Contract>`

          Check the contract on the Scan website.
          ex: https://mumbai.polygonscan.com/address/<Proxy Contract>#code

    - copy the ~/harhat/artifacts/contracts/<Contract Name>.json & ~/harhat/artifacts/contracts/SureToken3.json to ~/nextjs/utils/abis

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

## Error Handling
    
### Failed to upgrade the contract.

1. The file ".openzeppeline\<network>.json" is missing or the content is NOT inconsistent with remote.

    - Error Message: 

        ```
        ~\saba-future\hardhat\node_modules\@openzeppelin\upgrades-core\src\manifest-storage-layout.ts:20
            throw new UpgradesError(
                ^
        Error: Deployment at address 0xC2f54eD8... is not registered

        To register a previously deployed proxy for upgrading, use the forceImport function.
            at getStorageLayoutForAddress (D:\phil\saba-future\hardhat\node_modules\@openzeppelin\upgrades-core\src\manifest-storage-layout.ts:20:11)
            at validateImpl (D:\phil\saba-future\hardhat\node_modules\@openzeppelin\hardhat-upgrades\src\utils\validate-impl.ts:46:27)
            at deployProxyImpl (D:\phil\saba-future\hardhat\node_modules\@openzeppelin\hardhat-upgrades\src\utils\deploy-impl.ts:73:3)
            at Proxy.upgradeProxy (D:\phil\saba-future\hardhat\node_modules\@openzeppelin\hardhat-upgrades\src\upgrade-proxy.ts:28:32)
            at main (D:\phil\saba-future\hardhat\scripts\upgradeProxy.js:6:20)
        ```

    - resolution: 

        1. Remove the network file, artifacts folder and cache folder.

        ```
            $ rm ~/hardhat/<network>.json
            $ rm -rf ~/hardhat/artifacts
            $ rm -rf ~/hardhat/cache
        ```

        2. Set [FORCE_IMPORT_CONTRACT] in .env to ORIGINAL implementation contract name.

        ```
           ex: FORCE_IMPORT_CONTRACT=PredictionWorld4
        ```

        3. Regenerate the network file by the forceImport script.

        ```
            $ npx hardhat run ~\hardhat\script\forceImport.js --network <network>
        ```

        4. Upgrade again.

        ```
            # npx hardhat run ~\hardhat\script\upgradeProxy.js --network <network>
        ```
