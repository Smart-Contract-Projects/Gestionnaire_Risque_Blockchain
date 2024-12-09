const hre = require("hardhat");

async function main() {
    
    const Risk = await hre.ethers.getContractFactory("GestionnaireRisques");
    const Risk_contract = await  Risk.deploy();

    console.log(`Contract Address deployed: ${Risk_contract.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



// Contract Address deployed:    0x66689fCAc04eEc2E883e46520B24feaE70aA557c
//https://amoy.polygonscan.com/address/0x66689fCAc04eEc2E883e46520B24feaE70aA557c#code