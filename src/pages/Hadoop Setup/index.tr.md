---
title: Blockchain and Ethereum
date: '2022-01-08'
spoiler: Blockchain, smart contract, web3js, solidity, rust
---


Şu kaynakları sırayla özetleyeceğim
- https://ethereum.org/en/developers/docs/ 
    - Foundational topics
    - Ethereum stack

# Foundational topics
## Blockchain
Blockchain block'lardan oluşan bir linked list gibidir. Bu liste veri tuttuğu için veritabanı da sayılabilir. Sadece listeye bir eleman eklerken gelen verinin miner'lar tarafından onaylanması gerekiyor. Bu onaylama mekanizması da miner'ların eklenecek blockuna hash'ine uygun bir şifreyi bulması ile oluyor. Bu şifreyi bulma işlemi bütün miner'lar arasında bir yarışa dönüşüyor çünkü bulan miner'a ödül var.

Block: Listeye eklenecek derli toplu transaction listesidir.
Chain: Her yeni block bir önceki block'un hash bilgisi ile birbirine bağlanır ve chain yani zincir oluşur. 
Nodes: Zincirin tam ve düzgün bir kopyasını tutmakla yükümlüdür. Node'lar birbiri ile haberleşir.
EVM: Ethereum networkündeki dağınık tüm hesaplama gücünün toplamına EVM denir. 
ETH(Ether): Ethereum network'ünün yerel para birimidir.
Account: Ether'ler account üzerinde tutulur. Account'lardan ether gönderilir veya alınır.
## Ethereum
Yukarıdaki anlattığım teknik proof-of-work yani ödülü almak isteyenler daha çok bilgisayar gücü vermeli ki o daha önce bulup ödülü alsın. Ethereum şimdilik bu teknik ile çalışıyor ama ileride proof-of-stake'e geçebilir. Bu da daha fazla ethereum sahibi olan daha fazla ödül olur mekanizması yani bir şirkete yatırımcı olmak gibi daha fazla hissesi olan daha fazla kar alır gibidir.

Ethereum'um ilk çıkan kripto para olan Bitcoin'den farkı ise bu linked list yani birbirine sıkı sıkıya bağlı veri ipliği üzerinde başka teknikler uygulanabilmesidir. Altyapıda Ethereum aynen çalışır ama 2. katman olarak farklı kontroller eklenebilir. Buna da contract denir. Bu contract'lar bir proglamlama dili ile yazılır o da Solidity veya Viper'dır. Bu yüzden smart contract denir. 

Meraklısı için NFT'ler ERC-721 contract'ı ile yapılır. 

Ethereum gibi smart contract destekleyen başka networkler(yani linked list) de vardır : Solana, Avalanche. Solana tamamen farklı bir teknik kullanırken Avalanche Ethereum'um proof-of-stake versionudur diyebiliriz. Solana'da yapılan işlemlerin Ethereum'a göre daha ucuz olduğunu biliyorum ama Avalance'dan emin değilim. 

Solana networkünde smart contract Rust dili yazılır, Ethereum gibi kendine özel dil yapmamışlar, ki bence bilinen bir olması daha yazılımcılar ve ekosistem kurmak için avantajlı.


 #### SMART CONTRACTS

# Solidity

