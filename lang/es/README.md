# StateNano

StateNano es un pequeño manejador de estados con una api bastante sencilla, que aprovecha el potencial las clases al momento de gestionar estados en una aplicación.

## ¿ Por que clases ?

las clases ofrecen una herencia simple y minimalista, StateNano aprobecha esto para componetizar estados en base a clases.

### yarn

```bash
yarn add -D statenano
```
### npm

```bash
npm install -D statenano
```

### Interfaz

StateNano por defecto posee una interfaz simple con 2 metodos **update** y **subscribe**, update alimenta el estado con nuevas propiedades y a su vez notifica a los suscriptores cada actualización.

Al instanciar el estado ud podra usar 3 parámetros:

- initialState = Objeto,  representa el estado inicial de la instancia, este solo puede ser un objeto
- middleware   = Arreglo, permite bloquear cada intento de actualización que pase por update, sea para generar cambios asíncronos o registros

```javascript

import State from 'statenano';

let state = new State( [ initialState = {} , middleware = [] ] )

```

### Ejemplo de Todo

Este ejemplo muestra cómo puede implementar un Todo de una manera simple extendiendo State. Puede ver un ejemplo más completo en [codesandbox.io] (https://codesandbox.io/s/4xjvlqx870)

```javascript

import State from 'statenano';

let primaryKey = 0;

class Todo extends State{
  // acción modificadora
  append( task ){
      this.update({
          tasks : this.tasks.concat({
              id : ++primaryKey,
              task
          })
      })
  }
  // acción modificadora
  remove( id ){
      this.update({
          tasks: this.tasks.filter((task)=>task.id !== id)
      })
  }
}

let todo = new Todo( { tasks : [] } )

```

> la clase anterior enseña como crear un estado para gestionar tareas, esta gestión es simple, posee 2 métodos, **append** este añade una tarea en base a un string. **remove** este elimina una tarea a base de su **id**

### Ejemplo de anidación de estados

ud puede anidar los estados sea para generar estados más complejos, también un estado puede ser suscriptor de otro, de esta forma cada cambio que pase por un estado se emite a los suscriptores del estado suscrito.

```javascript

import State from 'statenano';

// se crea el estado hijo
let stateChild = new State({
  loading : true
})
// se crea el estado padre que anida al hijo
let stateParent = new State({
  stateChild
})
// el estado padre se suscribe a hijo
stateChild.subscribe(stateParent)
// se suscribe una función al estado padre
stateParent.subscribe(( state )=>{
  console.log('update!')
})
// cualquier cambio enviado al hijo es emitido también
// a los suscriptores del padre
stateChild.update({loading : false})

```

> de igual forma el estado padre puede enviar actualizaciones al hijo simplemente construyendo un objeto que apunte a él

```javascript
  stateParent.update({
      stateChild : {loading : true}
  })
```

## Comparativa

Luego de entender de forma simple como opera StateNano, lo invito a compararla con la forma en la que sostuve el estado de mis aplicaciones bastante tiempo **Redux**, asi podra entender algunas diferencias y elegir la que más le convenga a su proyecto

### Ejemplo Todo Redux

este es un ejemplo simple en el que todo se concentra en un fichero, normalmente este tendria una raiz de proyecto mas completa como lo enseña este repositorio [Ejemplo Redux TodoMVC](https://github.com/reactjs/redux/tree/master/examples/todomvc/src)

- reducers/todo
- actions/todo
- constants/actionsType

``` javascript

store = createStore(reducer)

const ADD_TODO   = 'ADD_TODO';
const REM_TODO   = 'REM_TODO';

let   primaryKey = 0;

function reducer(state = [],action){
   switch(action.type){
       case ADD_TODO:
           return: state.concat({
               id   : ++primaryKey,
               task : action.payload
           })
       case REM_TODO:
           return: state.filter((task)=>task.id !== action.payload )
       default:
           return state
   }
}

function addTodo( payload ){
   store.dispatch({
       type : ADD_TODO, payload
   })
}

function remTodo( payload ){
   store.dispatch({
       type : REM_TODO, payload
   })
}

store.subscribe(()=>{
   console.log( store.getState() )
})

```

## Ejemplo StateNano

estate nano concentra todo lo que interactúa con  el estado en la clase que lo conforma. la mayor ventaja de esto es que ud puede componentizar estados sea para su posterior replicación

```javascript

let   primaryKey = 0;

class Todo extends StateNano{
   addTodo(){
       let tasks = this.tasks.concat({
           id   : ++primaryKey,
           task : action.payload
       })
       this.update({tasks})
   }
   remTodo(){
       let tasks = this.tasks.filter((task)=>task.id !== action.payload )
       this.update({tasks})
   }
}

let todo = new Todo({tasks : []})

```
### Ejemplo replicación

ud podría crear un estado de orden superior y este suscribirse a los subestados. continuemos mantenido el estado del ejemplo anterior **Todo**.

```javascript

let todo_1 = new Todo({tasks : []})
let todo_2 = new Todo({tasks : []})
let todo_3 = new Todo({tasks : []})

let masterTodos = new StateNano({
       todo_1,
       todo_2,
       todo_3,
})

todo_1.subscribe(masterTodos)
todo_2.subscribe(masterTodos)
todo_3.subscribe(masterTodos)

masterTodos.subscribe((state)=>{
   console.log(state.todo_1.tasks)
   console.log(state.todo_2.tasks)
   console.log(state.todo_3.tasks)
})

```
> de esta forma cualquier cambio que ocurra dentro de cualquier **todo**, será notificado a los suscriptores del **masterTodo**. 


## Plugins

| npm | git | uso |
|-----|-----|-----|
| [preact-statenano](https://www.npmjs.com/package/preact-statenano) | [preact-statenano](https://github.com/UpperCod/preact-statenano) | es una pequeña biblioteca que permite sincronizar eventos de estado creados sobre la base de StateNano con componentes creados con preact todo gracias a los componentes de alto orden. |