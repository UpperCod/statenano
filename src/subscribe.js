/**
 * allows adding a new callback to an array
 * @param {array} collection
 * @param {function} save
 * @param {boolean} unique - avoid repeat subscription
 * @return {function} function that deletes the registry
 */
export default function subscribe(collection, save, unique) {
    if (unique && collection.indexOf(save) > -1) return;
    collection.push(save);
    return () => {
        collection.splice(collection.indexOf(save) >>> 0, 1);
    };
}
