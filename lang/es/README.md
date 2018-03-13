# Statenano

Statenano es un pequeño manejador de estados con una api bastante sencilla, que aprovecha  el potencial las clases al momento de gestionar estados en una aplicación.

## ¿ Por qué clases ?

las clases ofrecen una herencia simple y minimalista, Statenano aprobecha esto para componetizar estados en base a clases.

### yarn

```bash
yarn add -D Statenano
```
### npm

```bash
npm install -D Statenano
```

## Instancia

Statenano por defecto posee una interfaz simple con 2 métodos  **update** y **subscribe**, **update** alimenta el estado con nuevas propiedades y a su vez notifica a los suscriptores cada actualización.

```javascript

import State from "statenano";

let initState = { type: "sample" };

let middleware = [
    function log(next, state, update) {
        console.log("update: ", update);
        next(update);
        console.log("state: ", state);
    }
];

let state = new State(initState, middleware);

```
#### initialState

como notara en la instancia anterior ud puede definir un estado inicial como primer argumento de **State**

#### middleware

Como notara en la instancia anterior ud puede definir un array de middleware como segundo argumento, a continuación se enseña el principio de bloqueo de este  array de funciones

```javascript

export default function middlewareLog(next, state, update) {
    console.log("update: ", update);
    next(update);
    console.log("state: ", state);
}

```

### instance.update([mixed objet])

permite alertar a los suscriptores un cambio dentro del estado

```javascript

import State from "statenano";

let state = new State();

state.subscribe(state => {});

state.update({ type: "sample" });

```

### instance.subscribe( function ) 

permite suscribirse ante una actualización del estado

### Ejemplos

| Tipo | link |
|------|-----|
|TODO|[4xjvlqx870 - CodeSandbox](https://codesandbox.io/s/3vomp01rkp)|
|SHOP|[Productos - Bodeguita Agroecologica](http://www.bodeguitaagroecologica.cl/producto/)|


| npm | git | uso |
|-----|-----|-----|
| [preact-statenano](https://www.npmjs.com/package/preact-statenano) | [preact-statenano](https://github.com/UpperCod/preact-statenano) | es una pequeña biblioteca que permite sincronizar eventos de estado creados sobre la base de Statenano con componentes creados con preact todo gracias a los componentes de alto orden. |

