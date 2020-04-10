---
title: Spring Security Architecture
date: '2020-04-25'
spoiler: Authentication and Authorization(Access Control)
---
Bu yazı https://spring.io/guides/topicals/spring-security-architecture adresindeki referans dökümandan yararlanacarak oluşturulmuştur.
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
* Aşağıdaki kodlar da **Override** ile **configure** methodunu kullandığından yalnızca local **AuthenticationManager** build eder.

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

Spring boot bize tek kullanıcı için bir **AuthenticationManager** bizim için hazır getirir. Ta ki AuthenticationManager'ınızı implement edene kadar.  

## Authorization or Access Control
* authentication tamamlanınca authorization'a geçebiliriz. Buradaki temel strateji **AccessDecisionManager** dir. Aynen **ProviderManager**'ın **AuthenticationProviders** zincirine(chain) sorumluluğu verilmesi gibi burada da sorumluluk **AccessDecisionVoter** zincirine verilir.  Burada 3 tip implementasyon vardır. 
**AccessDecisionVoter** principal'ı temsil eden **Authentication**'a ve **ConfigAttributes** ile tanımlanan secure **Object**'a ihtiyaç duyar. 


```jsx
boolean supports(ConfigAttribute attribute);

boolean supports(Class<?> clazz);

int vote(Authentication authentication, S object,
        Collection<ConfigAttribute> attributes);
```

//todo buraya ekleme yapılacak

## Web Security
Spring security web'de Servlet Filter'lara göre çalışır. 
![Bir web client request attığında container hangi filter ve servlet çalışacağına request URI'ye göre karar verir.](./filters.png)
Bir web client request attığında container hangi filter ve servlet çalışacağına request URI'ye göre karar verir. Çoğunlukla bir servlet request'i handle eder ama filter'lar sıralı bir zincir oluşturur. Bir filter kendisinden sonraki filteri devre dışı bırakabilir eğer requesti kendisi kullanmak isterse.  Ayrıca filtre request ve response objelerini değiştirebilir. Filtrelerin sırası önemlidir. Sıra 2 lekilde sağlanabilir. 
* Filter'in **@Beans**'i **@Order** alabilir veya **Ordered**'ı implement eder.
* **FilterRegistrationBean **'ın bir parçası olarak. 
Bazı hazır filtreler hangi sırada olduğunu kendisi belirlemek ister. Mesela **SessionRepositoryFilter ** önlerde olmak ister ama kendinden öncekileri zorlamaz. 
Spring Security yalnız tek bir filtre olarak yüklenir ve bunun tipi de **FilterChainProxy**'dir .
Spring Boot uygulamarında security filter **ApplicationContext** içinde bir **@Bean** olarak çalışır ve bu filter her requeste uygulanır. Bu filtrenin sırası **SecurityProperties.DEFAULT_FILTER_ORDER** ile belirlenir. 
![FilterChainProxy ](./security-filters.png)
Yukarıdaki şekle bakınca farklı dursa da aslında bir fiziksel filter vardır.  Bu filtre **FilterChainProxy ** içerir. FilterChainProxy  bir bean'dir ve içerdiği tüm filtreler de Servlet'ten gelen **Filter ** interface'ini implement eder.  Her birinin de zincirin gerisini veto etme hakkı vardır. 
 Spring Security filter birden fazla filter zinciri içerebilir ve gelen request'i eşleşen ilk zincire gönderir. 
 Aşağıda /foo/** adresine gelen request'i /** zincirine dağıtması gösteriliyor. Ama en önemlisi bir request'i yalnızca bir chain yakalıyor.

![FilterChainProxy ](./security-filters-dispatch.png)

## Creating and Customizing Filter Chains
```jsx
@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER - 10)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/foo/**")
     ...;
  }
}
```
Yukarıdaki örnekte gelen requesti basic auth filter'dan önce yakalamak için **@Order** kullanılarak ondan daha düşük bir sıra verilmiştir .
Diğer bir yöntem olarak da **security.basic.enabled=false** yapılabilirdik. 

Many applications have completely different access rules for one set of resources compared to another. For example an application that hosts a UI and a backing API might support cookie-based authentication with a redirect to a login page for the UI parts, and token-based authentication with a 401 response to unauthenticated requests for the API parts. Each set of resources has its own WebSecurityConfigurerAdapter with a unique order and a its own request matcher. If the matching rules overlap the earliest ordered filter chain will win.
Çoğu uygulama farklı kaynaklara erişim için farklı kurallara sahiptir. Mesela bir UI backend cookie tabanlı authentication destekleyip login sayfasına yönlendirme yapmak isterken , API kısımları token temelli authentication http 401 response verebilir.  

```jsx
@Configuration
@Order(SecurityProperties.BASIC_AUTH_ORDER - 10)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/foo/**")
      .authorizeRequests()
        .antMatchers("/foo/bar").hasRole("BAR")
        .antMatchers("/foo/spam").hasRole("SPAM")
        .anyRequest().isAuthenticated();
  }
}
```
request matcher vs filter chain ? 
One of the easiest mistakes to make with configuring Spring Security is to forget that these matchers apply to different processes, one is a request matcher for the whole filter chain, and the other is only to choose the access rule to apply.

* Combining Application Security Rules with Actuator Rules
Eğer projenizde endpoint'leri yönetmek için Spring Boot Actuator kullanıyorsanız, onlar da secure de olur ve bunlar için yeni bir filter chain tanımlanır. Bu filter chain'in order'ı yani sırası **ManagementServerProperties.BASIC_AUTH_ORDER ** ile tanımlıdır ve sıra numarası **SecurityProperties **'dan 5 düşüktür. 
Eğer defalt security rullarının actuator için de geçerli olmasını isterseniz actuator'e daha yüksek bir order verin.

```jsx
@Configuration
@Order(ManagementServerProperties.BASIC_AUTH_ORDER + 1)
public class ApplicationConfigurerAdapter extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.antMatcher("/foo/**")
     ...;
  }
}
```