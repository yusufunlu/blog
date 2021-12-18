---
title: React Hooks And Context
date: '2021-05-06'
spoiler: Over the Redux and React Hooks
cta: 'react'
---

React hook kullanmanız için React dependancy en az 16.8 olmalıdır.
Kendi hook'larımızı yazabileceğimiz gibi React bize hazır hook'lar da sunar. **useState**, **useEffect**

* Hooks döngüler ve if gibi koşullardan çağrılmamalı
* Hooks sadece function react component'lerden veya kendi yazdığımız hook'lardan çağrılmalı. Düz javascript kodlarından çağrılmamalı

## useState
````
import React, { useState } from 'react';

function Example() {
  // "count" diyeceğimiz yeni bir state değişkeni tanımlayın
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

````

* **useState** bir hook'tur ve geriye bir çift döner. İlki oluşturulan state alanınının değeridir, ikincisi de bu state'i set etmek için gereken fonksiyondur. 
* Hook'lardan önce function component'ler state'e sahip olamıyordu ama artık olabiliyor
* Artık react hook'ları kullanıyorsak react class component kullanmak zorunda değiliz.
* Artık function component ile her işi yapabildiğimize göre **this** de kullanamayız ve gerek de yoktur.

Hook kullanmadan, class component ile yukarıdaki kodu şöyle yazabilirdik.
````
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
````

* this.state.count => count 
* this.setState({ count: this.state.count + 1 }) => setCount(count + 1)



## useEffect

Mutasyonlar, abonelikler, zamanlayıcılar, loglama, ve diğer yan etkisi olan işlemler bir fonksiyon bileşenin render aşamasında bulunmazlar.

````
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // componentDidMount ve componentDidUpdate kullanımına benzer bir kullanım sunar:
  useEffect(() => {
    // tarayıcının başlık bölümünü değiştirmemizi sağlar
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

````

* useEffect component her render tamamlandıktan sonra çalışır. 
* amacı render tamamlandıktan sonra yen etkileri uygulamaktır
* useEffect geriye bir function döndürürse o da component DOM'dan unmount olduğunda ve bir sonraki useEffect hesaplamadan önce çalıştırır

````
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
      isOnline ? 'Online' : 'Offline';
    </div>
  );
}

````

* useEffect return unmount sırasında çalıştığını gösterene akış aşağıdadır.
````
// Mount with { friend: { id: 100 } } props
ChatAPI.subscribeToFriendStatus(100, handleStatusChange);     // Run first effect

// Update with { friend: { id: 200 } } props
ChatAPI.unsubscribeFromFriendStatus(100, handleStatusChange); // Clean up previous effect
ChatAPI.subscribeToFriendStatus(200, handleStatusChange);     // Run next effect
````

Her sefereinde component re render olmasını istemiyorsak 2. parametre veririz

````
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // Only re-run the effect if count changes
````

* ``npm install eslint-plugin-react-hooks --save-dev`` ile hooklar yalnızca function component ve diğer hooklardan çağrıldığı denetlebilir

* useState yalnızca ilk renderda çalışır 
* ağır hesaplar için lazy initial state aşağıdaki yapılabilir

````
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
````

## useContext
* iç içe componentlerden context verilerine erişimi sağlar
````
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = React.createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
````
## useReducer
* useState‘e bir alternatiftir
* karmaşık bir state mantığı varsa useState'e göre avantajlıdır
imzası aşağıdaki gibidir
``const [state, dispatch] = useReducer(reducer, initialArg, init);``
* callback göndermeye gerek yoktur bunun yerine dispatch methodu döner zaten

Temel bir örnek aşağıdaki gibidir.
````
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
````

* State başlangıç değerlerini hesaplamak ağırsa aşağıdaki gibi yapılabilir
````
function init(initialCount) {
  return {count: initialCount};
}
````
