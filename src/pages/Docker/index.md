---
title: Docker
date: '2022-09-16'
spoiler: Docker,Kubernetes and AWS
---

Docker 2 important terms: Image and Container
Image is like configuration file of OS snapshot.
Container is instance of Image. So if you run image that is container.

**docker run -d -p 80:80 docker/getting-started**
create a container and run it as detached(background)


**docker build -t getting-started .** //--tag
created image from dockerfile and tag it as getting-started 

docker run -dp 3000:3000 getting-started

docker images to local docker images

docker tag java-docker:latest java-docker:v1.0.0

docker run --name java-app-container-1 dockerize-java-app:latest

docker ps

docker rename java-app-container-1 java-app-container-2


cat /etc/os-release

docker run -it --entrypoint /bin/bash dockerize-java-app

docker run -it ubuntu bash


java -jar .\target\Dockerize-Java-App-1.0-SNAPSHOT.jar