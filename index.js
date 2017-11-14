(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.StateNano = factory());
}(this, (function () { 'use strict';

function trigger(collection,argument){
    collection.forEach(function (handler){ return handler(argument); });
}

function subscribe(collection,save,once){
    if( once && collection.indexOf(save) > -1 ) { return; }
    collection.push(save);
    return function (){
        collection.splice(
            collection.indexOf(save)>>>0,1
        );
    }
}

function methodFixed(save,prop,value){
    Object.defineProperty(
        save,
        prop,
        {
            enumerable  : false,
            configurable: false,
            writable    : false,
            value: value
        }
    );
}

function createMiddleware(){
    var middleware = [], len = arguments.length;
    while ( len-- ) middleware[ len ] = arguments[ len ];

    return middleware.reduceRight(function (before,after){ return function (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

        return after.apply(void 0, [ before ].concat( args ));
 }        });
}

function extend(save,update){
    Object.keys(update)
            .forEach(function (prop){
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
            });
    return save;
}

var State = function State( initial, middleware, subscribe$$1 ){
    var this$1 = this;
    if ( initial === void 0 ) initial = {};
    if ( middleware === void 0 ) middleware = [];
    if ( subscribe$$1 === void 0 ) subscribe$$1 = [];

    methodFixed(
        this, '_middleware', createMiddleware.apply(
            void 0, middleware.map(function (middleware){ return function (next,update){ return middleware(this$1,next,update); }; }).concat( [function (update){
                if( typeof update === 'object' ){
                    extend(this$1,update);
                    trigger(this$1._subscribe,this$1);
                }
                return this$1;
            }] )
        )
    );
    methodFixed(
        this, '_subscribe', subscribe$$1
    );
    this.update(initial);
};
State.prototype.update = function update (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    this.preventDefault = true;
    var response =  (ref = this)._middleware.apply(ref, args);
                    delete this.preventDefault;
    return response;
        var ref;
};
State.prototype.subscribe = function subscribe$1 ( handler ){
    if( handler instanceof State && handler !== this ){
        return subscribe(this._subscribe,function (){
            if( !handler.preventDefault ) {
                trigger(handler._subscribe,handler);
            }
        },true);
    }else{
        return subscribe(this._subscribe,handler);
    }
};

var index = {
    State: State,
    createMiddleware: createMiddleware
};

return index;

})));
