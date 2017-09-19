var hookCallback;

function _hooks () {
    return hookCallback.apply(null, arguments);
}

export interface MomentStatic {}
export import Moment = hooks.Moment;

export const hooks: MomentStatic = _hooks as any;
export namespace hooks {
    export interface Moment {}
}

// This is done to register the method called with moment()
// without creating circular dependencies.
export function setHookCallback (callback) {
    hookCallback = callback;
}

export function Object_assign (target, additions) {
    var prop;
    for (prop in additions) {
        if (Object.prototype.hasOwnProperty.call(additions, prop)) {
            target[prop] = additions[prop];
        }
    }
}
