// blockchain/contract.js
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia.publicnode.com");
const wallet = new ethers.Wallet("0x8b5b277b671d39791949770a92c2386b1afacbc09271a502846d3a80e0cbd934", provider);

const contractAddress = "0xbd474Ce26474EB9Bb0672Bde986D92aa71471d86";

const abi = [
  "function storeKYC(address user, bytes32 hash, bool isMultiBank)",
  "function verifyKYC(address user)"
];

const contract = new ethers.Contract(contractAddress, abi, wallet);

module.exports = contract;