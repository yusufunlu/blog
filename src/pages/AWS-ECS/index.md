title: AWS ECS
date: '2020-07-25'
spoiler: AWS ECS, ECR, Task Definition, Service, Auto Scaling, EC2
---

Hadoop bilgisayar tarlalarında çok büyük veri setleri için dağıtık depolama ve işleme yeteneği sunan bir açık kaynak yazılımdır.
İki bin yıllarının başında Yahoo Apache Nutch açık kaynak web crawler üzerine çalışırken(tabi o zaman nutch apache miydi emin değilim) Google 2003-2004
GFS ve map-reduce geliştirmeler için makaleler yayınlar. Yahoo da buradan esinlenerek Hadoop'u yapar ve bunu open source olarak açar.

Burada ilginç bir detay var: Hadoop'a en çok katkıda bulunan Doug Cutting(kendisi o zamanlar Yahoo'da çalışıyor) aynı zamanda Apache Nutch'u ve Lucene'i yapan kişi. Lucene de açık kaynak ve Apache altında konumlanıyor ve aynı zamanda Elestic Search ve Solr'ın core kısmı oluyor. Hadoop de Doug Cutting'in oğlunun oyuncak filinin ismi ve rengi de sarı , Hadoop'un sembolü ve maskotu da biraz da şans ile buradan geliyor.

Aynı kişi bu Lucene, Nutch, Solr, Elastic Search ve Hadoop ile çalışmıssa aslında bu araçlar da benzer altyapı veya teknik yaklaşımlar ile çalışıyordur. 

![Ben de bu sıralar Lucene kitabı okuyordum :D](./apache_lucene.jpeg)

Şimdi dönelim konumuza Google'ın yayınladığı GFS yani Google File System distributed bir alt yapıya sahip buradan esinlerek Hadoop Distributed File System yapılıyor. Google'ın diğer makalesi olan Map-Reduce ise gene Hadoop içindeki Map-Reduce için bir esin kaynağı oluyor. İsimler de aynı kalmış hemen hemen.
