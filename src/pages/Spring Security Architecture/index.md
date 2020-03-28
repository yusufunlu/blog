---
title: Spring Security Architecture
date: '2020-04-25'
spoiler: Authentication and Authorization(Access Control)
---

Uygulama güvenliği birkaç bağımsız problemle ilgilidir. Bunlar : Authentication(kim?) ve authorization (neye iznin var?). Bu iki kelime birbirine benzediği için authorization yerine access control da kullanılır bazen.

## Authentication

Authentication için ana strateji arayüzü AuthenticationManager interface'idir.
```jsx
public interface AuthenticationManager {

  Authentication authenticate(Authentication authentication)
    throws AuthenticationException;
}
```
**AuthenticationManager** **authenticate** ile 3 şey yapar
* Eğer inputlar valid ise bir **Authentication** nesnesi döner. **authenticated=true** olarak.
* Eğer inputlar invalid ise **AuthenticationException** fırlatır.
* Girdiler valid olduğuna emin olamazsa **null** döner.

**AuthenticationException** bir runtime exception'dır. Bu exception'ı siz handle etmeseniz bile HTTP 401 dönecektir, **WWW-Authenticate** ile veya değil.

AuthenticationManager'ın en çok kullanılan implementation'u ProviderManager'dır. ProviderManager da sorumluluğu AuthenticationProvider instance'larına dağıtır. Her AuthenticationProvider biraz AuthenticationManager gibidir. 

```jsx
public interface AuthenticationProvider {

	Authentication authenticate(Authentication authentication)
			throws AuthenticationException;

	boolean supports(Class<?> authentication);

}
```

**supports()** methodu **authenticate()** methoduna geçecek bir paremetreyi destekleyip desteklemediğini anlamak için kullanılır.
**ProviderManager** AuthenticationProviders zincirini kullanarak farklı auth mekanizmalarını destekleyebilir.

![ProviderManager isteğe bağlı olarak başka bir ProviderManager parent'a sahip olabilir](./ProviderManager.png)

ProviderManager isteğe bağlı olarak başka bir ProviderManager parent'a sahip olabilir. Eğer **AuthenticationProviders** null parent'a düşer bu istek.
Uygulamamız **/api/** path'ine göre farklı logic resource gruplardan oluşabilir. Her grup kendi dedicated **AuthenticationManager** 'ına yani **ProviderManager**'a sahiptir. Bunlar da ortak bir parent'a sahiptir ve buna global denir. Tüm provider'lar buraya düşer.

## Customizing Authentication Managers
Spring Security, bize temel authentication manager özelliklerini ayarlamamız için bazı helper class'lar verir. Bunlardan en çok kullanılanı **AuthenticationManagerBuilder**. Bu class bize in-memory, JDBC ya da LDAP kullanıcı detayları ya da custom UserDetailsService için kolaylık sağlar.
* Aşağıda global **AuthenticationManager** ayarlamak için örnek kodlar vardır. Aşağıdaki **initialize** ve **Autowired** olduğundan global AuthenticationManager configure eder.

```jsx
@Configuration
public class ApplicationSecurity extends WebSecurityConfigurerAdapter {

   ... // web stuff here

  @Autowired
  public void initialize(AuthenticationManagerBuilder builder, DataSource dataSource) {
    builder.jdbcAuthentication().dataSource(dataSource).withUser("dave")
      .password("secret").roles("USER");
  }
}
```
* Aşağıdaki kodlar da **Override** ve **configure** olduğundan yalnızca local **AuthenticationManager** build eder.

```jsx
@Configuration
public class ApplicationSecurity extends WebSecurityConfigurerAdapter {

  @Autowired
  DataSource dataSource;





   ... // web stuff here

  @Override
  public void configure(AuthenticationManagerBuilder builder) {
    builder.jdbcAuthentication().dataSource(dataSource).withUser("dave")
      .password("secret").roles("USER");
  }

}
```