  require("@nomicfoundation/hardhat-toolbox");

  /** @type import('hardhat/config').HardhatUserConfig */
  module.exports = {
    solidity: "0.8.27",
    networks : {
      sepolia :{
        url : 'https://eth-sepolia.g.alchemy.com/v2/C_7nvmjGtVIXR4SvApOV_1phVWKixlQk',
        accounts : ['a9813d48c021414005dfea33fc1f2572c78a082e14b42dc1df5f4189652e014f']
      }
    }
  };
