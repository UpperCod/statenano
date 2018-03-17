var Statenano = (function () {
'use strict';

var Subscriber = function Subscriber(listeners) {
    if ( listeners === void 0 ) listeners = [];

    this.listeners = listeners;
};
Subscriber.prototype.subscribe = function subscribe (listener) {
        var this$1 = this;

    this.listeners.push(listener);
    return function () {
        this$1.listeners.splice(this$1.listeners.indexOf(listener) >>> 0, 1);
    };
};
Subscriber.prototype.dispatch = function dispatch () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];

    this.listeners.forEach(function (listener) { return listener.apply(void 0, args); });
};

var event = "__event__";
/**
 * The instance creates an object whose interaction methods are:
 * @method update(updater) : void
 * @method subscribe(listener) : function
 */
var State = function State(state) {
    if ( state === void 0 ) state = {};

    Object.defineProperty(this, event, {
        enumerable: false,
        configurable: false,
        writable: false,
        value: new Subscriber()
    });
    this.update(state);
};
/**
 * method responsible for updating and reporting changes in the state
 * as you will notice update executes functions that may exist within
 * the instance, through prevent manages to generate a bottleneck
 * that will only send a notification to the subscribers for the
 * parent update, avoiding notifying the subscribers by multiple
 * update in the same generated queue by update
 * @param {any} [updater]
 */
State.prototype.update = function update (updater) {
        var this$1 = this;

    var ev = this[event],
        /**
         * The preventive behavior is important since it avoids sending
         * multiple subscribers to the subscribers, assuring a correct
         * hierarchy of notifications, fabpr noting that the subscriber
         * also makes use of prevent, to avoid sending in the same
         * form reports that are already anticipated to be resivided.
         */
        prevent = ev.prevent;

    if (typeof updater === "object") {
        if (!prevent) { ev.prevent = true; }

        Object.keys(updater).map(function (prop) {
            var next = updater[prop];
            if (this$1[prop] instanceof State) {
                this$1[prop].update(next);
            } else if (typeof this$1[prop] === "function") {
                this$1[prop](next);
            } else {
                this$1[prop] = next;
            }
            return prop;
        });

        if (!prevent) { ev.prevent = false; }
    }

    if (!ev.prevent) { ev.dispatch(this); }
};
/**
 * method in charge of subscribing functions or other states to changes
 * dispatched by update of the instance
 * @param { Function, State } listener - subscribes to changes in the instance
 * @return {Function} - returns a function that removes the subscriber from the instance
 */
State.prototype.subscribe = function subscribe (listener) {
    if (listener instanceof State) {
        /**
         * this subscriber dispatches notifications to the subscribers of the state
         * delivered as a listener of this instance, prevent ensures that the notifications
         * already assigned are respected
         */
        return this.subscribe(function () {
            var ev = listener[event];
            if (ev.prevent) { return; }
            ev.dispatch(listener);
        });
    }
    return this[event].subscribe(listener);
};

return State;

}());
