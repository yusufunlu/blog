---
title: Windows Pro ve Home Docker
date: '2020-08-27'
spoiler: Docker kurulumu ve Windows 10 Pro ve Home versionları arasındaki farklar
---

## Jhipster Nedir ve neden kullanalım
Jhipster basit birşey aslında. Sadece bize popüler Java , frontend ve database teknolojileri modern proje şablonu oluşturan bir araç.
Mesela Spring projesi kendiniz Jhipster olmadan yapmak isterseniz bunun database bağlantılarını kod içinde, properties dosyasında veya yml dosyalarında veya çok daha sofistike olarak ayrı bir config serverda tutabilirsiniz. Burada en modern ve esnek yöntem Spring cloud üstünde tutmaktır. Faydası ise kodu görenler sizin development, test veya production ortamında database şifrelerinizi görmemiş olur. 

Gelelim Jhipster'a tekrar. Bu yapı medium veya farklı yerlerde anlatılıyor ancak çoğu bilgi birbiri ile uyumsuz makaleler arasında birinin kullandığını diğeri kullanmıyor veya fazladan birşey kullanıyor. Bu durumda okuyucu hangisi ayar veya araç zorunlu toparlamakta güçlük çekiyor. Yani ihtiyacımız olan eksiksiz ve fazlalıksız amacımıza uygun bir yapı kurmak. Gerisinde ise biz projemize göre business logic yani iş mantığı kodlayacağız yani asıl işimize odaklanacağız.

İşte Jhipster bize eksiksiz ve fazlalıksız bir "best practice" bir yapı sunabiliyor. Bunu yaparken CLI (command line interface) yani komut satırında basit soru veya cevaplarla bize opsiyon sunuyor.

Şimdi kurulumu öyle kendi resmi faydasındaki komutları tekrarlayarak yapmayacağım. Hangi yöntemi neden seçtik yazacağım:
1. Jhipster online : internetten bir arayüzle projenizi oluşturup onu gitlab veya githuba atıyor. Ben bunu seçmezdim çünkü bu tarz arayüzler çok sık değiiyor. Geliştirme tecrübesi değil de arayüz tecrübesi veriyor ki bir değişiklik veya problem olması durumunda arayüzün el verdiği kadar yapabilirim. 
2. En popüler yöntem: npm ile generator-jhipster yüklenir bu komut satırından çalıştırılır. Basitçe şöyle çalışıyor.  Npm nodejs paketlerini yöneten bir araç olduğunu biliyoruz. Bu paketler gelip bilgisayarın ana node_modules klasörü veya projenin node_modules klasörü altında tutuluyor. Burada ana node_modules klasöründe bazı node paketlerini 
3. Yarn ile node paketi yükleme : üsttekinin aynısı sadece node paketlerini npm değil de yarn ile yüklüyor. Yarn ile Npm arasında birkaç fark var. Npm ile yüklerseniz node_modules klasörü çok büyüyebiliyor. Nasıl yapıyor ayrıntılı bilmiyorum ama bunu özellikle geliştirmiş facebook Yarn ekibi.  Son uyarım da npm ile yarn aynı anda kullanılmamalı bir proje için paketleri yarn ile yükledi iseniz daha sonra npm ile sakın yüklemeyin uyumsuzluk problemi olabilir.
4. Son yöntem de docker container: yani JHipster generator içeren bir docker container çalıştırırsınız ve bu docker içine girdiğinizde bir JHipster generator  vardır. Bu sayede projeyi docker container içinde 
