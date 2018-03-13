# Statenano

Statenano is a small state handler with a fairly simple API, which exploits the potential of classes when managing states in an application.

## Why use classes?

the classes offer a simple and minimalist inheritance, **Statenano** uses this to compose states based on classes.

### yarn

```bash
yarn add -D statenano
```
### npm

```bash
npm install -D statenano
```

## Instancia

Statenano by default has a simple interface with 2 methods **update** and **subscribe**, **update** feeds the state with new properties and in turn notifies subscribers of each update.

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

as you noticed in the previous instance you can define an initial state as the first argument of **State**

#### middleware

As you will notice in the previous instance you can define a middleware array as the second argument of the State instance, then the principle of blocking this array of functions is taught

```javascript

export default function middlewareLog(next, state, update) {
    console.log("update: ", update);
    next(update);
    console.log("state: ", state);
}

```

### instance.update([mixed objet])

allows subscribers to alert a change within the state

```javascript

import State from "statenano";

let state = new State();

state.subscribe(state => {});

state.update({ type: "sample" });

```

### instance.subscribe( function ) 

allows you to subscribe to a status update

### Examples

| Tipo | link |
|------|-----|
|TODO|[4xjvlqx870 - CodeSandbox](https://codesandbox.io/s/4xjvlqx870)|
|SHOP|[Productos - Bodeguita Agroecologica](http://www.bodeguitaagroecologica.cl/producto/)|


| npm | git | uso |
|-----|-----|-----|
| [preact-statenano](https://www.npmjs.com/package/preact-statenano) | [preact-statenano](https://github.com/UpperCod/preact-statenano) | Is a small library that allows you to synchronize state events created on the basis of Statenano with components created with preact all thanks to the high order components. |

