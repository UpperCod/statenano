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


let state = new State(initState);

```
#### initialState

as you noticed in the previous instance you can define an initial state as the first argument of **State**

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

## Inheritance 

Statenano to be a class facilitates the edition of behavior based on the inheritance

```javascript
import State from "statenano";

class Todo extends State{
    constructor(){
        super();
        this.tasks = [];
    }
    addTask(task){
        this.update({
            tasks : this.tasks.concat({task})
        })
    }
    removeTask(task){
        this.update({
            tasks : this.tasks.filter((save)=>save !== task)
        })
    }
}


let state = new Todo;

    state.subscribe(()=>{
        state.tasks.map((task)=>{
            console.log(task)
        })
    })

    state.addTask("Learn statenano");
    
```

### Examples

| Tipo | link |
|------|-----|
|TODO|[CodeSandbox](https://codesandbox.io/s/2435rkwjzj)|
|SHOP|[Productos - Bodeguita Agroecologica](http://www.bodeguitaagroecologica.cl/producto/)|


| npm | git | uso |
|-----|-----|-----|
| [preact-statenano](https://www.npmjs.com/package/preact-statenano) | [preact-statenano](https://github.com/UpperCod/preact-statenano) | Is a small library that allows you to synchronize state events created on the basis of Statenano with components created with preact all thanks to the high order components. |

