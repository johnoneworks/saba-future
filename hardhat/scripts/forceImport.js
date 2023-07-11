const { ethers, upgrades } = require('hardhat');
const { PROXY_ADDRESS, FORCE_IMPORT_CONTRACT } = process.env;

async function main() {
    const PredictionWorld = await ethers.getContractFactory(FORCE_IMPORT_CONTRACT);
    const deployment = await upgrades.forceImport(PROXY_ADDRESS, PredictionWorld);
    await deployment.deployed();

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(
        PROXY_ADDRESS
    );

    console.log('                  Owner: ' + await deployment.owner());
    console.log('          Contract Name: ' + FORCE_IMPORT_CONTRACT);
    console.log('         Proxy Contract: ' + PROXY_ADDRESS);
    console.log('Implementation Contract: ' + implementationAddress);
}

main();
