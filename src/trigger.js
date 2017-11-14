export default function trigger(collection,argument){
    collection.forEach(handler=>handler(argument));
}