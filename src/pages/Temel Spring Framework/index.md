---
title: Spring Framework Fundamentals
date: '2020-04-24'
spoiler: Beans, Scopes, Dependancy Injection, Bean Factory, Context, Stereotype, Properties, autowiring, transaction management
---

## Bean 
singleton is the default scope for Spring beans. Business logic should be stateless and singleton is stateless too.
The prototype scope is better for stateful beans to avoid multithreading issues.
## Scope
Spring daha yokken de bildiğimiz bir kavram scope. Bir değişkenin etki alanıdır. Java'da bir değişken class için yaratılmışsa etki alanı yani scope'u o class'tır. Eğer değişken method içinde yaratılmışsa. Aynen bu şekilde Spring'in bean'i de bir session için yaratılmış da olabilir sadece tek bir http request için de yaratılmış da olabilir. Bu durumda gelecek 2. request için farklı bir bean yaratılır. 

Bu şekilde 5 scope seçeneğimiz vardır. 
* **Singleton**: Default yani özel bir ayar yapmazsak bean'ler singleton çalışır. Her bir Spring container veya context(application context) içinde o bean'den bir tane olmasını sağlar. Eğer JVM üzerinde birden fazla Spring container olursa singleton itemler da çoklanır.  
* **Prototype**: Spring container'dan bu bean'i her istediğimizde bize bean'i yeniden üretir ve uniq(eşsiz) olur.
* Session
* Request
* Global

## Opinionated 
Spring boot has Opinionated Defaults Configurations. If you include the spring boot starter pom for jpa, you'll get autoconfigured for you an in memory database, a hibernate entity manager, and a simple datasource. 

## stereotype 
Annotations in spring are @Component and its derivations @Service, @Repository, and @Controller.
Spring context will autodetect these classes when annotation-based configuration and classpath scanning is used
## @Service 
It can be applied only to classes
## @Controller 
It can be applied to classes only.
Mostly being used with @RequestMapping handler
The dispatcher scans such annotated classes for mapped methods and detects @RequestMapping annotations


## Embedded Container
Spring web includes tomcat as default container
move away from deploying java web applications to a java servlet container (or application server) in the form of a war file (or ear file) and instead package the application as an executable jar with an embedded servlet/HTTP server like jetty. 
