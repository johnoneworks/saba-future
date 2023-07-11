require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
require("dotenv").config();

const {
    API_URL, PRIVATE_KEY, SCAN_KEY,
    MUMBAI_API_URL, MUMBAI_PRIVATE_KEY, MUMBAI_SCAN_KEY
} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.18",
    networks: {
        mainnet: {
            url: API_URL,
            accounts: [`0x${PRIVATE_KEY}`]
        },
        mumbai: {
            url: MUMBAI_API_URL,
            accounts: [`0x${MUMBAI_PRIVATE_KEY}`]
        }
    },
    etherscan: {
        apiKey: {
            polygon: SCAN_KEY,
            polygonMumbai: MUMBAI_SCAN_KEY
        }
    },
    mocha: {
        timeout: 5 * 60 * 1000
    }
};
