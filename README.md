# StateNano

StateNano is a small state handler with a fairly simple API, which exploits the potential of classes when managing states in an application.

## Why classes and not functions?

the classes offer a simple and minimalist inheritance, StateNano uses this to compose states based on classes.

### Interface

StateNano by default has a simple interface with 2 methods **update** and **subscribe**, update feeds the state with new properties and in turn notifies the subscribers each update.

When instantiating the state you can use 3 parameters:

- initialState = Object, represents the initial state of the instance, it can only be an object
- middleware   = array, allows blocking every update attempt that goes through update, either to generate asynchronous changes or logs

```javascript

import {State} from 'statenano';

let state = new State( [ initialState = {} , middleware = [] ] )

```

### Example of Todo

This example shows how you can implement an All in a simple way by extending State

```javascript

import {State} from 'statenano';

let primaryKey = 0;

class Todo extends State{
   // modifier action
   append( task ){
       this.update({
           tasks : this.tasks.concat({
               id : ++primaryKey,
               task
           })
       })
   }
   // modifier action
   remove( id ){
       this.update({
           tasks: this.tasks.filter((task)=>task.id !== id)
       })
   }
}

let todo = new Todo( { tasks : [] } )

```

> the previous class teaches how to create a state to manage tasks, this management is simple, it has 2 methods, **append** this adds a task based on a string. **remove** this deletes a task based on your **id**

### Example of nesting of states

You can nest the states either to generate more complex states, also one state can be a subscriber of another, so every change that passes through a state is issued to the subscribers of the subscribed state.

```javascript

import {State} from 'statenano';

// the son state is created
let stateSon = new State({
   loading : true
})
// the parent state that nests the child is created
let stateParent = new State({
   stateSon
})
// the parent state subscribes to son
stateSon.subscribe(stateParent)
// a function is subscribed to the parent state
stateParent.subscribe(( state )=>{
   console.log('update!')
})
// any change sent to the child is also issued
// to the subscribers of the father
stateSon.update({loading : false})

```

> Similarly, the parent state can send updates to the child simply by building an object that points to the

```javascript
   stateParent.update({
       stateSon : {loading : true}
   })
```

