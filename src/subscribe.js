export default function subscribe(collection,save,once){
    if( once && collection.indexOf(save) > -1 ) return;
    collection.push(save);
    return ()=>{
        collection.splice(
            collection.indexOf(save)>>>0,1
        )
    }
}