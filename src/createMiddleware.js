/**
 * allows to protect a function, through a chain of middleware functions
 * each middleware function will receive as the first argument the "next"
 * function to execute
 * @param {*} middleware
 * @example createMiddleware(
 *  (next,argument)=>next(100,2),
 *  (next,a,b)=>next(a*b),
 *  (total)=>console.log(total) //> 200
 * );
 * @returns {function}
 */
export default function createMiddleware(...middleware) {
    return middleware.reduceRight((before, after) => (...args) =>
        after(before, ...args)
    );
}
