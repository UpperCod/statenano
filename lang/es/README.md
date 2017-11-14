# StateNano

StateNano es un pequeño manejador de estados con una api bastante sencilla, que aprovecha el potencial las clases al momento de gestionar estados en una aplicación.

## ¿ Por que clases ?

las clases ofrecen una herencia simple y minimalista, StateNano aprobecha esto para componetizar estados en base a clases.

### Interfaz

StateNano por defecto posee una interfaz simple con 2 metodos **update** y **subscribe**, update alimenta el estado con nuevas propiedades y a su vez notifica a los suscriptores cada actualización.

Al instanciar el estado ud podra usar 3 parámetros:

- initialState = Objeto,  representa el estado inicial de la instancia, este solo puede ser un objeto
- middleware   = Arreglo, permite bloquear cada intento de actualización que pase por update, sea para generar cambios asíncronos o registros

```javascript

import {State} from 'statenano';

let state = new State( [ initialState = {} , middleware = [] ] )

```

### Ejemplo de Todo



```javascript

import {State} from 'statenano';

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

### Ejemplo de anidacion de estados

ud puede anidar los estados sea para generar estados más complejos, también un estado puede ser suscriptor de otro, de esta forma cada cambio que pase por un estado se emite a los suscriptores del estado suscrito.

```javascript

import {State} from 'statenano';

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

> de igual forma el estado padre puede enviar actualizaciones al hijo simplemente construyendo un objeto que apunte a el

```javascript
   stateParent.update({
       stateChild : {loading : true}
   })
```

