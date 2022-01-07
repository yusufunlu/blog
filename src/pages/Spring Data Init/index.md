---
title: Spring Database Initialization
date: '2020-06-15'
spoiler: Hibernate, JDBC and Flyway examples and their external configurations
---

This article will give you examples of how to use Data Definition Language(DDL) and Data Manipulation Language(DML) files and differences

Here is the official Spring Doc about it : https://docs.spring.io/spring-boot/docs/2.5.6/reference/htmlsingle/#howto.data-initialization.using-jpa

If you search with "Spring Database Initialization" it mostly forward us to older Spring releases

I like yml format than .properties which is equal actually

I will refer this below application.yml in this blog post mostly.
``#`` is for comments
````
spring:
  jpa:
    generate-ddl: true
    hibernate:
      ddl-auto: create
    show-sql: true
    defer-datasource-initialization: true
    #database: h2 #same as database-platform, it doesn't effect schema-{platform}.sql and data-{platform}.sql names
    #database-platform: org.hibernate.dialect.H2Dialect
  datasource:
    url: jdbc:h2:mem:testdb #ALWAYS, EMBEDDED or NEVER will be calculated from h2
    username: h2-user
    password: h2-pass
    driverClassName: org.h2.Driver
    #initialization-mode: always # deprecated, moved to under sql.init, DON'T USE
    #platform: h2 #deprecated, moved to under sql.init, , DON'T USE
  sql:
    init:
      #continue-on-error: true
      mode: ALWAYS
      platform: h2 #it effect schema-{platform}.sql and data-{platform}.sql names

  h2:
    console:
      enabled: true
      path: /h2

logging:
  level:
    #root: INFO
    #org.hibernate.SQL: TRACE
    #spring.sql: TRACE
    #javax.sql: TRACE
    #org.h2.jdbc: TRACE
    org.springframework.jdbc: TRACE
debug: false

````

In Spring Boot 2.5. spring.datasource.* properties related to DataSource initialization have been deprecated and migrated to new spring.sql.init.* properties. https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-2.5-Release-Notes#sql-script-datasource-initialization
spring.datasource is being mapped to DataSourceProperties beans automaticially and some fieds are deprecated in Java and yml sides.

You can use below code to see the Spring bean by below code
````
    @Autowired
    JpaProperties jpaProperties;

    @Autowired
    HibernateProperties hibernateProperties;

    @Autowired
    DataSourceProperties dataSourceProperties;

    @Autowired
    SqlInitializationProperties sqlInitializationProperties;

    @PersistenceContext
    EntityManager em;

    @Autowired
    EntityManagerFactory entityManagerFactory;
````

You can check it out what fields deprecated from https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/autoconfigure/jdbc/DataSourceProperties.html
Some of them
- spring.datasource.initialization-mode ==> spring.sql.init.mode
- spring.datasource.platform ==> spring.sql.init.platform

There are 3 types of database schema creating(DDL) and importing data(DML): Hibernate and JDBC SQL scripts and high level tools like Flywaydb or Liquibase. We will talk about Hibernate and JDBC SQL scripts methods here.

SQL scripts method means that **schema.sql** is for schema and **data.sql** is for putting data. 

- **spring.jpa.hibernate.ddl-auto** default value is **create-drop** if it is embedded by looking at JDBC url **spring.datasource.url**   
- **import.sql** is executed by Hibernate if **hibernate.ddl-auto** is create or create-drop
- if **sql.init.mode** is embedded it execute import.sql
- creation schema from Jpa entities is managed by **generate-ddl** is true or **hibernate.ddl-auto** 

| ``initialization-mode`` | ``generate-ddl`` | ``hibernate.ddl-auto`` | schema.sql | data.sql | create schema from entities | import.sql |
| ----------------------- | ---------------- | ---------------------- | ---------- | -------- | --------------------------- | ---------- |
| never                   | true             | create                 | false      | false    | true                        | true       |
| never                   | true             | none                   | false      | false    | true                        | false      |
| never                   | false            | create                 | false      | false    | true                        | true       |
| never                   | false            | none                   | false      | false    | false                       | false      |

While multiple data source initialization technologies is not recommendded you can still use JDBC init and hibernate together.

**spring.jpa.defer-datasource-initialization** defer **schema.sql** and **data.sql** after hibernate schema
- When **defer-datasource-initialization: false**
- - **schema.sql**-> **data.sql**-> ``JPA schema create from Entities`` -> **import.sql**
- When **defer-datasource-initialization: true**
- - ``JPA schema create from Entities`` -> **import.sql** -> **schema.sql**-> **data.sql**


sql.init.platform manage the name of data-{platform}.sql and schema-{platform}.sql with some bugs. Default is all and it means schema.sql and data.sql

Spring Boot chooses a default value for you based on whether it thinks your database is embedded. It defaults to create-drop if no schema manager has been detected or none in all other cases. An embedded database is detected by looking at the Connection type and JDBC url. hsqldb, h2, and derby are candidates, and others are not. 