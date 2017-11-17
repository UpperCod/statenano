import trigger          from './trigger';
import subscribe        from './subscribe';
import createMiddleware from './createMiddleware';

 export function extend(save,update){
    Object.keys(update)
            .forEach((prop)=>{
                // if( prop === 'update' || prop === 'subscribe' ) continue;
                if( prop in save && save[prop] instanceof State ){
                    save[prop].update(update[prop]);
                }else{
                    if( typeof save[prop] === 'function' ){
                        save[prop]( update[prop] );
                    }else{
                        save[prop] = update[prop];
                    }
                }
            })
    return save;
}

export default class State{
    constructor( initial = {}, middleware = [], subscribe = [] ){
        middleware = createMiddleware(
            ...middleware.map((middleware)=>(next,update)=>middleware(this,next,update)),
            (update)=>{
                if( typeof update === 'object' ) extend(this,update);
                trigger(this._.subscribe,this);
                return this;
            }
        )
        Object.defineProperty(
            this,
            '_',
            {
                enumerable  : false,
                configurable: false,
                writable    : false,
                value       : {
                    subscribe,
                    middleware
                }
            }
        )
        this.update(initial);
    }
    update(...args){
        this._.preventDefault = true;
        let response =  this._.middleware(...args);
                        delete this._.preventDefault;
        return response;
    }
    subscribe( handler ){
        if( handler instanceof State && handler !== this ){
            return subscribe(this._.subscribe,()=>{
                if( !handler._.preventDefault ) {
                    trigger(handler._.subscribe,handler)
                }
            },true);
        }else{
            return subscribe(this._.subscribe,handler);
        }
    }
}