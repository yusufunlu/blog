---
title: Spring Database Initialization
date: '2020-06-15'
spoiler: Hibernate, JDBC and Flyway examples and their external configurations
---

This article will give you examples of how to use Data Definition Language(DDL) and Data Manipulation Language(DML) files and differences

Here is the official Spring Doc about it : https://docs.spring.io/spring-boot/docs/2.5.6/reference/htmlsingle/#howto.data-initialization.using-jpa

If you search with "Spring Database Initialization" it mostly forward us to older Spring releases

The examples below is tested with h2 database which is embedded. Default **spring.jpa.hibernate.ddl-auto** value is **create-drop** if it is not set explicitly
I like yml format than .properties which is equal actually

````
spring:
  jpa:
    generate-ddl: false
    hibernate:
      ddl-auto: none
````
Above code use **schema.sql** to create database schema and **data.sql** to put datas

````
spring:
  jpa:
    generate-ddl: true
    hibernate:
      ddl-auto: none
````
Above code use **schema.sql** and entities to create database schema and **data.sql** to put datas

````
spring:
  jpa:
    generate-ddl: false
    hibernate:
      ddl-auto: create
````
Above code use **schema.sql** and entities to create database schema and
**data.sql** and **import.sql** to put datas

If ddl-auto is create or create-drop (by default or explicitly) **import.sql** will be used. **generate-ddl: false** doesn't effect in this case.

````
spring:
  jpa:
    generate-ddl: true
    hibernate:
      ddl-auto: create
````
Above code use **schema.sql** and entities to create database schema and
**data.sql** and **import.sql** to put datas



````
spring:
  jpa:
    generate-ddl: false
    hibernate:
      ddl-auto: none
  datasource:
    url: jdbc:h2:mem:testdb
    username: h2-user
    password: h2-pass
    driverClassName: org.h2.Driver
  h2:
    console:
      enabled: true
      path: /h2

logging:
  level:
    org.hibernate.SQL: TRACE

debug: true
````


