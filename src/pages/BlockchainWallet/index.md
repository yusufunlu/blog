---
title: Blockchain Wallets
date: '2022-01-08'
spoiler: Create Bitcoin private and public keys and address
---

First of all there are basically 2 type of technics to create : asymmetric and symmetric cryptography

## asymmetric cryptography(Public-key cryptography)
- We need to use private and public key pairs for this technic. 
- We can share the public key to clients but private key is only for owner
- We can use different cryptographic algorithms(RSA, ECDSA, ed25519...) while creating private and public key pair. Those are one way mathematical functions. So they private and public keys are not convertable
- Public key encryption and Digital signatures


Bitcoin address is generated from the public part of an ECDSA key, hashed using SHA-256 and RIPEMD-160, processing the resulting hashes as described below, and finally encoding the key using a Base58 Checked encoding
Create private and public keys with ECDSA-> hash with SHA-256 and RIPEMD-160 -> encode with Base58

 