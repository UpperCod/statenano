import Subscriber from "./Subscriber";
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
        Object.defineProperty(this, "_", {
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
        let ev = this._,
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

            Object.keys(updater).forEach(prop => {
                let value = updater[prop];
                if (prop in this && this[prop] instanceof State) {
                    this[prop].update(value);
                } else if (typeof this[prop] === "function") {
                    this[prop](value);
                } else {
                    this[prop] = value;
                }
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
                let ev = listener._;
                if (ev.prevent) return;
                ev.dispatch(listener);
            });
        }
        return this._.subscribe(listener);
    }
}
