import Subscriber from "./Subscriber";
/**
 * The instance creates an object whose interaction methods are:
 * @method update(updater) : void -
 * @method subscribe(listener) : function
 */
export default class State {
    /**
     * defines the initial state, given as the first parameter
     * @param {object} state
     */
    constructor(state = {}) {
        Object.defineProperty(this, "_", {
            value: new Subscriber()
        });
        this.update(state);
    }
    /**
     * allows you to notify subscribers of a change in the state
     * this in turn protects subscribers through the "prevent" property
     * the dispatch execution is blocked, if one already exists within update
     * @param {object} [updater]
     */
    update(updater) {
        let prevent = this._.prevent;

        if (typeof updater === "object") {
            if (!prevent) this._.prevent = true;

            Object.keys(updater).forEach(prop => {
                let value = updater[prop];
                if (prop in this) {
                    if (this[prop] instanceof State) {
                        this[prop].update(value);
                        return;
                    }
                    if (typeof this[prop] === "function") {
                        this[prop](value);
                        return;
                    }
                }
                this[prop] = value;
            });

            if (!prevent) this._.prevent = false;
        }

        if (!this._.prevent) this._.dispatch(this);
    }
    /**
     *
     * @param {object|function} listener - register a subscriber to state changes
     * if this is an instance of the State class, register the subscribers of
     * the instance to the state changes
     */
    subscribe(listener) {
        if (listener instanceof State) {
            return this.subscribe(() => {
                if (listener._.prevent) return;
                listener._.dispatch(listener);
            });
        }
        return this._.subscribe(listener);
    }
}
