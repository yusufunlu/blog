---
title: Solidity and Ethereum 
date: '2022-02-04'
spoiler: Wallets, Public/Private Key, Address, Contract, Solidity, Compiler, Development Enviroment, Transaction, Gas
---

Solidity is a mix of C nad Javascript which use curly brackets.
It is also an object oriented language
We can make development for Solidity 
- on online remix ide : remix.ethereum.org
- by having Solidity compiler or an Ethereum network on our local machine
- by hardhat
- by truffle
  
After writing smart contract by Solidity and deploying it we or somebody else can communicate with it.
We need to have an id in order to do someting on network. 
We can use metamask.io to have id which is public key. Eventually we will have private key too for managing and having rights on this public id. Once we setup a metamask wallet it we 

# Deep dive bits to recap
- Bit: 0 or 1, Voltage exist or not, 5V or 0V in TTL electronic levels.
- Byte: 8 bits, 2^8(256) different combinations, **char** in most programming languages is this one
- Hex: 4 bits, 2^4(16) combinations => 0....A,B,C,D,E,F
To address the all(256) characters in ASCII we need 2 hex characters
- Example : N character in ASCII table is 1 **byte** and **01001101** as bits **4E** as 2 hex, **78** as decimal
- 1 byte is 8 bits which means 2^8 different char and 2 hex which means 2^4 * 2^4
  

# Continue
````Ethereum Private Keys are 64 random hex characters or 32 random bytes.````
- 64 hex is 64 * 4 bits equal to 32 bytes is 32 * 8 bits 

If we send a transaction on Ethereum Network we need tell gas limit and gas price for miners attraction.
If Gas limit is less than calculated the transaction is going to accomplish and gas will not be refunded.
If Gas limit is enough then gas limit * gas price in gwei make it slower or faster
1 Ether = 10^9 Gwei = 10^18 Wei 
![Gas Fee](./gas_fee.png)
50*10^3 * 20 gwei = 1000 * 10^3 gwei = 10^6 gwei = 10^-3 Ether = 0.001 Ether
EVM Architecture ?

We need to setup a wallet can provide a private key and public key to us. 
## Solidity

Contract code copied from https://github.com/itublockchain/solidity-bootcamp21/blob/master/00_Introduction/Names.sol
````
// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Names is Ownable {
    string public ownerName;
    string[] public names;
    int256 private luckyNumber;

    constructor(string memory _ownerName, int256 _luckyNumber) {
        ownerName = _ownerName;
        names.push(_ownerName);
        luckyNumber = _luckyNumber;
    }

    function addMyName(string memory _myName) public {
        names.push(_myName);
    }

    function isAdded(string memory _name) public view returns (bool) {
        for (uint256 i = 0; i < names.length; i++) {
            if (
                keccak256(abi.encodePacked((_name))) ==
                keccak256(abi.encodePacked((names[i])))
            ) return true;
        }
        return false;
    }

    function getNames() public view returns (string[] memory) {
        return names;
    }

    function nameCount() public view returns (uint256) {
        return names.length;
    }

    function changeOwnersName(string memory _ownerName) public onlyOwner {
        ownerName = _ownerName;
    }
}
````


