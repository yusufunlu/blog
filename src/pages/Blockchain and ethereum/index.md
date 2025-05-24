---
title: Blockchain and Ethereum
date: '2022-01-08'
spoiler: Blockchain, smart contract, web3js, solidity, rust
---


# Blockchain
Blockchain is like term based game such as chess or Medieval Total Ware video game :)
We can say that there terms everybody put their transaction into blocks. Some guys has computers and softwares to verify those blocks. Those blocks need verifying and verify process is like solving puzzle. But you have no idea what is this puzzle like and so you just brute force. Those verifiers are miners who just throw and puzzle part(a hashed number) and try if it seems good.
A blockchain is a public database that is updated and shared across many computers in a network.
# Ethereum
Ethereum currently uses proof of work which means solving the hard puzzles requires a lot of computer power. 


# Interactive game tutorial : openzeppelin

https://ethernaut.openzeppelin.com/
The Ethernaut is a Web3/Solidity based wargame inspired on overthewire.org, played in the Ethereum Virtual Machine. Each level is a smart contract that needs to be 'hacked'.

Open developer tools
**player**:  print player's address
**await getplayer(player)** : print balance of the player
ethernaut is a TruffleContract object that wraps the Ethernaut.sol contract that has been deployed to the blockchain.

**ethernaut**:  ABI(Application Binary Interface) exposes all of Ethernaut.sol's public methods, such as owner. 
**await ethernaut.owner()**:  