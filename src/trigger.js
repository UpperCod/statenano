/**
 * executes a callback array delivering as the first argument "argument"
 * @param {array} collection
 * @param {*} argument
 */
export default function trigger(collection, argument) {
    collection.forEach(handler => handler(argument));
}
