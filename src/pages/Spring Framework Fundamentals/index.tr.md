---
title: Temel Spring Frameworks
date: '2020-04-24'
spoiler: Spring'in temel kavramları ve nasıl çalıştıkları
---

## Scope
Spring daha yokken de bildiğimiz bir kavram scope. Bir değişkenin etki alanıdır. Java'da bir değişken class için yaratılmışsa etki alanı yani scope'u o class'tır. Eğer değişken method içinde yaratılmışsa. Aynen bu şekilde Spring'in bean'i de bir session için yaratılmış da olabilir sadece tek bir http request için de yaratılmış da olabilir. Bu durumda gelecek 2. request için farklı bir bean yaratılır. 

Bu şekilde 5 scope seçeneğimiz vardır. 
* **Singleton**: Default yani özel bir ayar yapmazsak bean'ler singleton çalışır. Her bir Spring container veya context(application context) içinde o bean'den bir tane olmasını sağlar. Eğer JVM üzerinde birden fazla Spring container olursa singleton itemler da çoklanır.  
* **Prototype**: Spring container'dan bu bean'i her istediğimizde bize bean'i yeniden üretir ve uniq(eşsiz) olur.
* Session
* Request
* Global
