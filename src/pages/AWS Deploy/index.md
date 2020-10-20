---
title: AWS ile CI/CD süreçleri
date: '2020-08-27'
spoiler: AWS Codecommit, Codepipeline, Codebuild, Cloudformation, CodeDeploy, SAM CLI, AWS CLI, AWS Toolkit
---

## SAM CLI vs Intellij AWS Toolkit

Birkaç fark arada 
SAM-CLI , Gatewayresponse tipinde return ediyor, IDE ise pom.xml dosyasına aws-lambda-java-events da ekledi.
Bunun dışında kodun mantığı aynı. event.json dosyası tamamen aynı. template.yml dosyasında da sadece CLI proje ismini tamamen doğru yazmış.

## AWS Toolkit

IDE'den lambda class üstünde çıkan işarete tıklayıp crate lambda deyip ayarları yapınca şu komut ile derleme yaptı
"C:\Program Files\Amazon\AWSSAMCLI\bin\sam.cmd" build Function --template C:\Users\yusufu\Projects\BACKEND\AWS-Lambda-Example-IDE\HelloWorldFunction\.aws-sam\build\template.yaml --build-dir C:\Users\yusufu\Projects\BACKEND\AWS-Lambda-Example-IDE\HelloWorldFunction\.aws-sam\build

SAM build Function --template .aws-sam\build\template.yaml --build-dir .aws-sam\build
aws-sam klasörü helloworld klasörü altında oluşmuş.

Yukarıda oluşuna template.yaml içindeki configler yanlış ama bu sırada deployu yapmış bile ve doğru timeout ve ram ile.
S3 bucket'ına da helloworldfunctionbyide.zip ismi ile .aws-sam altındaki helloworld ve lib klasörlerini atmış.

## SAM CLI
SAMCLI ile sam build yapınca tek fark .aws-sam folder'ını bir üst dizine yerleştirdi
Aslında Aws toolkit SAM komutlarını kullanıyor her işlemdde bu sebeple Aws toolkit için SAM CLI da kurulu olması lazım bilgisayarda

## AWS CLI
aws lambda update-function-code --function-name my-lambda-name --zip-file fileb://./target/my-lambda-jar.1.0-SNAPSHOT.jar

## AWS Codebuild vs Jenkins
CodePipeline is a continuous "deployment" tool, while Jenkins is more of a continuous "integration" tool.
Jenkinsde amaç build alıp testleri çalıştırmak ve koddaki her bir commit ile jobları trigger etmek
AWS Codepipeline managed yani sağlığını bizim takip etmemize gerek yok

Jenkins arayüzü kötü
Jenkins hostingini kendimiz yapmalıyız
Jenkins plugin versionlarına çok bağımlı ve pluginler çok hızlı update olmuyor
Beraber de kullanılabilirler : AWS code build için mesela Jenkins kullanabilir
Yapılan deployu kademeli olarak mesela her gün %10 daha fazla kullanıcıya aç gibi bir özellik yok Jenkinsde
Ama AWS Codedeploy'da var

teams pricing nasıl
onlarca event var aynı anda 40 sandalye 1to1 meetıng olabılır
1 account ıle kac paralel sessıon ızın verıyor prıcıng nasıl nerede ucretlı
1 sessıon nasıl baslatılabılır lınk ıle acma team acılınc a tekrar ad soyad almasın

