import trigger from "./trigger";
import subscribe from "./subscribe";
import createMiddleware from "./createMiddleware";
/**
 * allows to extend and at the same instant execute in
 * case that the existing property in save is a function,
 * giving as a parameter the value taken from the object update
 * @param {object} save - Object to update the update properties
 * @param {object} update - object that will modify the save properties
 * @returns {object} save
 */
export function extend(save, update) {
    Object.keys(update).forEach(prop => {
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

export default class State {
    constructor(initial = {}, middleware = [], subscribe = []) {
        /**
         * It allows to protect the function that updates the instance
         * middleware(next, state, update)
         */
        middleware = createMiddleware(
            ...middleware.map(middleware => (next, update) =>
                middleware(next, this, update)
            ),
            update => {
                if (typeof update === "object") extend(this, update);
                trigger(this._.subscribe, this);
                return this;
            }
        );
        Object.defineProperty(this, "_", {
            enumerable: false,
            configurable: false,
            writable: false,
            value: {
                subscribe,
                middleware
            }
        });
        this.update(initial);
    }
    /**
     * send the parameters to the middleware
     * @param {*} args
     * @returns response middleware
     */
    update(...args) {
        this._.preventDefault = true;
        let response = this._.middleware(...args);
        delete this._.preventDefault;
        return response;
    }
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
    subscribe(handler) {
        if (handler instanceof State && handler !== this) {
            return subscribe(
                this._.subscribe,
                () => {
                    if (!handler._.preventDefault) {
                        trigger(handler._.subscribe, handler);
                    }
                },
                true
            );
        } else {
            return subscribe(this._.subscribe, handler);
        }
    }
}
