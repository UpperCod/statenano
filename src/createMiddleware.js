export default function createMiddleware(...middleware){
    return middleware.reduceRight((before,after)=>(...args)=>after(before,...args));
}
