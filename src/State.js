import Subscriber from "./Subscriber";
/**
 * alias of the property that points subscribers within the state class
 */
export let event = "__event__";
/**
 * The instance creates an object whose interaction methods are:
 * @method update(updater) : void
 * @method subscribe(listener) : function
 */
export default class State {
    /**
     *
     * @param {Object} [state] - the initial state
     */
    constructor(state = {}) {
        Object.defineProperty(this, event, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: new Subscriber()
        });
        this.update(state);
    }
    /**
     * method responsible for updating and reporting changes in the state
     * as you will notice update executes functions that may exist within
     * the instance, through prevent manages to generate a bottleneck
     * that will only send a notification to the subscribers for the
     * parent update, avoiding notifying the subscribers by multiple
     * update in the same generated queue by update
     * @param {any} [updater]
     */
    update(updater) {
        let ev = this[event],
            /**
             * The preventive behavior is important since it avoids sending
             * multiple subscribers to the subscribers, assuring a correct
             * hierarchy of notifications, fabpr noting that the subscriber
             * also makes use of prevent, to avoid sending in the same
             * form reports that are already anticipated to be resivided.
             */
            prevent = ev.prevent;

        if (typeof updater === "object") {
            if (!prevent) ev.prevent = true;

            Object.keys(updater).map(prop => {
                let next = updater[prop];
                if (this[prop] instanceof State) {
                    this[prop].update(next);
                } else if (typeof this[prop] === "function") {
                    this[prop](next);
                } else {
                    this[prop] = next;
                }
                return prop;
            });

            if (!prevent) ev.prevent = false;
        }

        if (!ev.prevent) ev.dispatch(this);
    }
    /**
     * method in charge of subscribing functions or other states to changes
     * dispatched by update of the instance
     * @param { Function, State } listener - subscribes to changes in the instance
     * @return {Function} - returns a function that removes the subscriber from the instance
     */
    subscribe(listener) {
        if (listener instanceof State) {
            /**
             * this subscriber dispatches notifications to the subscribers of the state
             * delivered as a listener of this instance, prevent ensures that the notifications
             * already assigned are respected
             */
            return this.subscribe(() => {
                let ev = listener[event];
                if (ev.prevent) return;
                ev.dispatch(listener);
            });
        }
        return this[event].subscribe(listener);
    }
}
