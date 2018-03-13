'use strict';

/**
 * executes a callback array delivering as the first argument "argument"
 * @param {array} collection
 * @param {*} argument
 */
function trigger(collection, argument) {
    collection.forEach(function (handler) { return handler(argument); });
}

/**
 * allows adding a new callback to an array
 * @param {array} collection
 * @param {function} save
 * @param {boolean} unique - avoid repeat subscription
 * @return {function} function that deletes the registry
 */
function subscribe(collection, save, unique) {
    if (unique && collection.indexOf(save) > -1) { return; }
    collection.push(save);
    return function () {
        collection.splice(collection.indexOf(save) >>> 0, 1);
    };
}

/**
 * allows to protect a function, through a chain of middleware functions
 * each middleware function will receive as the first argument the "next"
 * function to execute
 * @param {*} middleware
 * @example createMiddleware(
 *  (next,argument)=>next(100,2),
 *  (next,a,b)=>next(a*b),
 *  (total)=>console.log(total) //> 200
 * );
 * @returns {function}
 */
function createMiddleware() {
    var middleware = [], len = arguments.length;
    while ( len-- ) middleware[ len ] = arguments[ len ];

    return middleware.reduceRight(function (before, after) { return function () {
            var args = [], len = arguments.length;
            while ( len-- ) args[ len ] = arguments[ len ];

            return after.apply(void 0, [ before ].concat( args ));
 }        }
    );
}

/**
 * allows to extend and at the same instant execute in
 * case that the existing property in save is a function,
 * giving as a parameter the value taken from the object update
 * @param {object} save - Object to update the update properties
 * @param {object} update - object that will modify the save properties
 * @returns {object} save
 */
function extend(save, update) {
    Object.keys(update).forEach(function (prop) {
        /**
         * if the cursor points is an object from the state class
         * dispatch the update function with the targeted properties
         * to the instance
         * @example state.update({ state2 : {type:"sample"} })
         * for this example the object {type: "sample"} will be sent to state2
         */
        if (prop in save && save[prop] instanceof State) {
            save[prop].update(update[prop]);
        } else {
            /**
             * it is reiterated if a property inside save is a
             * function this will resivir the value taken from update
             * otherwise this will update the save object
             */
            if (typeof save[prop] === "function") {
                save[prop](update[prop]);
            } else {
                save[prop] = update[prop];
            }
        }
    });
    return save;
}

var State = function State(initial, middleware, subscribe$$1) {
    var this$1 = this;
    if ( initial === void 0 ) initial = {};
    if ( middleware === void 0 ) middleware = [];
    if ( subscribe$$1 === void 0 ) subscribe$$1 = [];

    /**
     * It allows to protect the function that updates the instance
     * middleware(next, state, update)
     */
    middleware = createMiddleware.apply(
        void 0, middleware.map(function (middleware) { return function (next, update) { return middleware(next, this$1, update); }; }
        ).concat( [function (update) {
            if (typeof update === "object") { extend(this$1, update); }
            trigger(this$1._.subscribe, this$1);
            return this$1;
        }] )
    );
    Object.defineProperty(this, "_", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: {
            subscribe: subscribe$$1,
            middleware: middleware
        }
    });
    this.update(initial);
};
/**
 * send the parameters to the middleware
 * @param {*} args
 * @returns response middleware
 */
State.prototype.update = function update () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    this._.preventDefault = true;
    var response = (ref = this._).middleware.apply(ref, args);
    delete this._.preventDefault;
    return response;
        var ref;
};
/**
 * You can subscribe to the changes of the state simply by
 * giving as an argument to subscribe a function, in the
 * same way you can subscribe one state to another giving
 * as an argument the state to subscribe, in this way all
 * the changes that occur to the subscribed state will
 * dispatch the subscribers from the listening state
 * @param { function, State } handler
 * @returns { function } allows you to remove the subscription
 */
State.prototype.subscribe = function subscribe$1 (handler) {
    if (handler instanceof State && handler !== this) {
        return subscribe(
            this._.subscribe,
            function () {
                if (!handler._.preventDefault) {
                    trigger(handler._.subscribe, handler);
                }
            },
            true
        );
    } else {
        return subscribe(this._.subscribe, handler);
    }
};

module.exports = State;
