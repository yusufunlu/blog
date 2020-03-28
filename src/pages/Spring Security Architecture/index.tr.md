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


