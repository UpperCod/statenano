(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Statenano = factory());
}(this, (function () { 'use strict';

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

/**
 * The instance creates an object whose interaction methods are:
 * @method update(updater) : void -
 * @method subscribe(listener) : function
 */
var State = function State(state) {
    if ( state === void 0 ) state = {};

    Object.defineProperty(this, "_", {
        value: new Subscriber()
    });
    this.update(state);
};
/**
 * allows you to notify subscribers of a change in the state
 * this in turn protects subscribers through the "prevent" property
 * the dispatch execution is blocked, if one already exists within update
 * @param {object} [updater]
 */
State.prototype.update = function update (updater) {
        var this$1 = this;

    var prevent = this._.prevent;

    if (typeof updater === "object") {
        if (!prevent) { this._.prevent = true; }

        Object.keys(updater).forEach(function (prop) {
            var value = updater[prop];
            if (prop in this$1) {
                if (this$1[prop] instanceof State) {
                    this$1[prop].update(value);
                    return;
                }
                if (typeof this$1[prop] === "function") {
                    this$1[prop](value);
                    return;
                }
            }
            this$1[prop] = value;
        });

        if (!prevent) { this._.prevent = false; }
    }

    if (!this._.prevent) { this._.dispatch(this); }
};
/**
 *
 * @param {object|function} listener - register a subscriber to state changes
 * if this is an instance of the State class, register the subscribers of
 * the instance to the state changes
 */
State.prototype.subscribe = function subscribe (listener) {
    if (listener instanceof State) {
        return this.subscribe(function () {
            if (listener._.prevent) { return; }
            listener._.dispatch(listener);
        });
    }
    return this._.subscribe(listener);
};

return State;

})));
