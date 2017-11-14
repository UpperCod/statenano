import trigger          from './trigger';
import subscribe        from './subscribe';
import methodFixed      from './methodFixed';
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
        methodFixed(
            this, '_middleware', createMiddleware(
                ...middleware.map((middleware)=>(next,update)=>middleware(this,next,update)),
                (update)=>{
                    if( typeof update === 'object' ){
                        extend(this,update);
                        trigger(this._subscribe,this);
                    }
                    return this;
                }
            )
        )
        methodFixed(
            this, '_subscribe', subscribe
        )
        this.update(initial);
    }
    update(...args){
        this.preventDefault = true;
        let response =  this._middleware(...args);
                        delete this.preventDefault;
        return response;
    }
    subscribe( handler ){
        if( handler instanceof State && handler !== this ){
            return subscribe(this._subscribe,()=>{
                if( !handler.preventDefault ) {
                    trigger(handler._subscribe,handler)
                }
            },true);
        }else{
            return subscribe(this._subscribe,handler);
        }
    }
}