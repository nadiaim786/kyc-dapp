// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYC {

    struct KYCData {
        bytes32 hash;
        bool verified;
        bool isMultiBank;
    }

    mapping(address => KYCData) public kycRecords;

    function storeKYC(address user, bytes32 hash, bool isMultiBank) public {
        kycRecords[user] = KYCData(hash, false, isMultiBank);
    }

    function verifyKYC(address user) public {
        require(kycRecords[user].hash != 0, "No KYC found");
        kycRecords[user].verified = true;
    }

    function getKYC(address user) public view returns (bytes32, bool, bool) {
        KYCData memory data = kycRecords[user];
        return (data.hash, data.verified, data.isMultiBank);
    }
}