let State = require("./build/umd");

test("Test initstate", () => {
    let initState = {
        type: "test"
    };
    let state = new State(initState);

    expect(state).toMatchObject(initState);
});
/**
 * by means of update you can notify multiple functions belonging to the instance,
 * the notified function will respect the argument coming from the object
 */
test("Function execution in update", () => {
    let arg1 = 10,
        arg2 = 20;

    class Sample extends State {
        method1(arg) {
            expect(arg).toBe(arg1);
        }
        method2(arg) {
            expect(arg).toBe(arg2);
        }
    }

    let state = new Sample();

    state.update({
        method1: arg1,
        method2: arg2
    });
});
/**
 * Since State allows execution of update functions between executions,
 * it could cause an overload on the subscribers of minor notifications,
 * to avoid this State defines a property prevent before the execution
 * to avoid double notifications on the subscribers
 */

test("Execution block between updates", () => {
    class Sample extends State {
        metodo1(arg) {
            this.update({
                arg1: arg
            });
        }
        metodo2(arg) {
            this.update({
                arg2: arg
            });
        }
    }
    let state = new Sample(),
        execution = 0;

    state.subscribe(() => {
        execution++;
        expect(execution).toBe(1);
    });
    /**
     * through this update block 2 more are executed,
     * but only the subscribers will be notified once
     * per update block, this is thanks to the
     * preventive property
     */
    state.update({
        metodo1: 10,
        metodo2: 20
    });
});
