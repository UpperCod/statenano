export default class Subscriber {
    constructor(listeners = []) {
        this.listeners = listeners;
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners.splice(this.listeners.indexOf(listener) >>> 0, 1);
        };
    }
    dispatch(...args) {
        this.listeners.forEach(listener => listener(...args));
    }
}
