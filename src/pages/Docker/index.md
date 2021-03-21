---
title: Docker Örnekler
date: '2020-08-27'
spoiler: Docker örnekler ve komutları
---
There is only 2 important notions on docker: image and container
**Docker Image**: already built on local or another computer executable by 
**Docker Container**: running image instance on computer. If image is class, container is object instance

````docker pull ubuntu:14.04````: pull docker image from docker hub or somewhere on internet like AWS version of docker hub which is ECR
```docker image ls```: list images as below

![Docker images list](./docker-image-ls.png)

Now we need to running of version image which is container
``docker run image_name:tag_name`` = ``docker run getting-started:``

```
docker container ls
```
list running containers. it is equal to ``docker ps`` and ``docker contanier ps``. **ps** means *docker process status*. If you want to see the not running containers too use ``docker container ls -a``= ``docker ps -a`` 



```
docker stop
```
````
docker pull name:tag <=> docker pull ubuntu:14.04
````

````
docker start [options] container_id 
````
start the container which is already created this command doesn't create new container
````
docker run [options] image [command] [argument] 
````
create new container and start it



