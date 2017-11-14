export default function methodFixed(save,prop,value){
    Object.defineProperty(
        save,
        prop,
        {
            enumerable  : false,
            configurable: false,
            writable    : false,
            value
        }
    )
}
