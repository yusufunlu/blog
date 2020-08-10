---
title: Hadoop Nedir
date: '2020-04-24'
spoiler: Hadoop temel elemanları ve opsiyonel elemanlarının görevleri
---

Hadoop bilgisayar tarlalarında çok büyük veri setleri için dağıtık depolama ve işleme yeteneği sunan bir açık kaynak yazılımdır.
İki bin yıllarının başında Yahoo Apache Nutch açık kaynak web crawler üzerine çalışırken(tabi o zaman nutch apache miydi emin değilim) Google 2003-2004
GFS ve map-reduce geliştirmeler için makaleler yayınlar. Yahoo da buradan esinlenerek Hadoop'u yapar ve bunu open source olarak açar.

Burada ilginç bir detay var: Hadoop'a en çok katkıda bulunan Doug Cutting(kendisi o zamanlar Yahoo'da çalışıyor) aynı zamanda Apache Nutch'u ve Lucene'i yapan kişi. Lucene de açık kaynak ve Apache altında konumlanıyor ve aynı zamanda Elestic Search ve Solr'ın core kısmı oluyor. Hadoop de Doug Cutting'in oğlunun oyuncak filinin ismi ve rengi de sarı , Hadoop'un sembolü ve maskotu da biraz da şans ile buradan geliyor.

Aynı kişi bu Lucene, Nutch, Solr, Elastic Search ve Hadoop ile çalışmıssa aslında bu araçlar da benzer altyapı veya teknik yaklaşımlar ile çalışıyordur. 

![Ben de bu sıralar Lucene kitabı okuyordum :D](./apache_lucene.jpeg)

Şimdi dönelim konumuza Google'ın yayınladığı GFS yani Google File System distributed bir alt yapıya sahip buradan esinlerek Hadoop Distributed File System yapılıyor. Google'ın diğer makalesi olan Map-Reduce ise gene Hadoop içindeki Map-Reduce için bir esin kaynağı oluyor. İsimler de aynı kalmış hemen hemen.




Flume -- scalable real time framework, filter and aggregate yapabilir hadoopa data aktarırken 

Pig , High-level data-flow language and execution framework for parallel computation 
Tez üzerinden çalışır genelde ama MR da kullanabilir 
interactive query  
Pre structured data kullanır ve analyzing and transforming datasets 
ETL ile farklı kaynaklardan data çıkarır HDFS'e kaydeder.  
Shell, UI veya java server classları aracılığı kullanılabilir 


Spark, genel amaclı ve hızlı compute engine dir ve HDFS'i kullanabilir 
Spark, ETL, Machine Learning, stream processing and graph analytics yapabilir 
Acyclic yani not looping sağlar 
Yarn veya HDFS kullanmadan da çalışabilir 
Yarnı kullanabilir 
Inmemory cache  

Map Reduce, programming model  
HAdoop Cluster üstünde dağıtık veri işleme yapar. Mapper ve reducer fonksiyonları veriyi map yani başka bir şeye çevirebilir, birleştirebilir ve azaltabilir.
Hata durumuna karşı töleranslıdır ve hadoop tarafından monitör edilip hata durumunda application master tarafından restart edilir veya başa bir node üzerinde restar edilir. 
Hive and Pig relies on MapReduce ama çok tercih edilmez 
Batch Oriented 

Hive, impala ya da hue ile datada query yapılabilir 
data warehouse infrastructure that provides data summarization and ad hoc querying. 
SQL-like engine that runs MapReduce jobs 
Tez üzerinden çalışır genelde 
interactive query  

Tez, execution management 
Pig ve hive gibi toollar için map reduce sağlar 
Acyclic yani not looping sağlar 
Yarnı kullanabilir 
Inmemory cache  
Distributed process 
multiple reduce phases without map phases and effective use of HDFS 

Hbase, scalable data warehouse with support for large tables 
HBase is a NoSQL key/value database on Hadoop. 
Yarn üzerinde çalışır 

Yarn,  
framework for job scheduling  
cluster resource management 
Klasik mapreduce de barındrır 
Storm ve Impala doğrudan YARN kullanır 
Inmemory cache  
Application master node veya clusterdaki bir bilgisayar hata alırsa yarn onu tekrar başlatmayı dener.
Yarn çökerse Zookeper HA(High available) yarn kullanarak yani Hot Standby kullanarak yeni bir yarn ayağa kaldırır.
