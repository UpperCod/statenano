let State = require("./build/umd");

test("Test initstate", () => {
    let initState = {
        type: "test"
    };
    let state = new State(initState);
    expect(state).toMatchObject(initState);
});

test("Test initstate with middleware", () => {
    let initState = {
        type: "test"
    };
    let replaceState = {
        type: "test!!"
    };
    let middleware = [
        function middleware(next, state, update) {
            next(replaceState);
        }
    ];
    let state = new State(initState, middleware);

    expect(state).toMatchObject(replaceState);
});
