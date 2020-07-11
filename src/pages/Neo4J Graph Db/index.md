---
title: Neo4J Graph Db nedir ve Spring ile örnek
date: '2020-06-15'
spoiler: Neo4J Graph Db nedir ve Spring ile örnek
---

## Graph Database Nedir
Graph veritablanları daha çok ilişki ve bağlantı odaklı veritabanlarıdır. Odakları burasıdır ve verilerin birbiri ile ilişkisi konusunda bize daha çok özellik(feature) sunarlar.  Graph veri yapısı kullanarak bunları bize sağlarlar. Genelde node ve edge 2 temel yapı üzerine kuruldur. Nodelar temel veri için iken edge'ler ise ilişkiler içindir. Graph veritabanları NoSql'dir ve Rdbms yani Sql(teoride yanlış bir kelime) tabanlı veritabanlarının problemlerini aşmak için oluşturuldu. Çünkü isminden (relational database management system - ilişkisel veritabanı yönetim sistemi) anlaşılacağı gibi onlarda da ilişkiler vardır.  Bazı graph db'ler relational engine yani ilişki motoru ve graph veri tutarken bazıları da key-value ve dokuman odaklıdır. Mesela OrientDB dokuman odaklı bir graph database'dir. Graph odaklı olanlarda bir döküman diğerine pointer içerir ki buna da edge denir, aslında ilişkidir bu pointer. Bu sayede retrieve yani veri getirme operasyonu hızlandırır. 
Graph databaselerden veri çekmek için SQL kullanılamaz. Bu işi görecek farklı query(sorgulama) dilleri vardır ama hiçbiri SQL'de olduğu tek bir standart hale gelememiştir. Bazıları : Gremlin, SPARQL ve Cypher. 

coming soon...