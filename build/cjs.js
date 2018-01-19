'use strict';

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
                if( prop in save && save[prop] instanceof State$1 ){
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

var State$1 = function State( initial, middleware, subscribe$$1 ){
    var this$1 = this;
    if ( initial === void 0 ) initial = {};
    if ( middleware === void 0 ) middleware = [];
    if ( subscribe$$1 === void 0 ) subscribe$$1 = [];

    middleware = createMiddleware.apply(
        void 0, middleware.map(function (middleware){ return function (next,update){ return middleware(this$1,next,update); }; }).concat( [function (update){
            if( typeof update === 'object' ) { extend(this$1,update); }
            trigger(this$1._.subscribe,this$1);
            return this$1;
        }] )
    );
    Object.defineProperty(
        this,
        '_',
        {
            enumerable  : false,
            configurable: false,
            writable: false,
            value   : {
                subscribe: subscribe$$1,
                middleware: middleware
            }
        }
    );
    this.update(initial);
};
State$1.prototype.update = function update (){
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    this._.preventDefault = true;
    var response =  (ref = this._).middleware.apply(ref, args);
                    delete this._.preventDefault;
    return response;
        var ref;
};
State$1.prototype.subscribe = function subscribe$1 ( handler ){
    if( handler instanceof State$1 && handler !== this ){
        return subscribe(this._.subscribe,function (){
            if( !handler._.preventDefault ) {
                trigger(handler._.subscribe,handler);
            }
        },true);
    }else{
        return subscribe(this._.subscribe,handler);
    }
};

module.exports = State$1;
