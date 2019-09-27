const _ = require('lodash');
(function(global) {
    const [FULFILLED, REJECTED, PENDING] = ['FULFILLED', 'REJECTED', 'PENDING'];
    function Promisepolyfill(func) {
        if (typeof func !== 'function') {
            throw TypeError('Promisepolyfill resolver is not a function');
        }

        if(!(func instanceof Promisepolyfill)) {
            throw  TypeError('Promise should be created via new')
        }
        
        this._state = PENDING;
        this._value = null;
        this._observers = [];

        try {
            func(fullfill.bind(this), reject.bind(this));
        } catch (e) {
            reject.call(this, e);
        }
    }

    function fullfill(value) {
        //In case of function return new Promisepolyfill
        if (value instanceof Promisepolyfill) {
            value.then(fullfill.bind(this), reject.bind(this));
            return;
        }

        this._value = value;
        this._state = FULFILLED;

        this._observers.forEach(function(observer) {
            let handler =
                this._state === FULFILLED
                    ? observer.onFulfilled
                    : observer.onRejected;
            let value = this._value;
            handler(value);
        }, this);

        this._observers.length = 0;
    }

    function reject(value) {
        this._value = value;
        this._state = REJECTED;

        this._observers.forEach(function(observer) {
            let handler = observer.onRejected;
            let value = this._value;
            handler(value);
        }, this);
    }

    Promisepolyfill.prototype.then = function(onFulfilled, onRejected) {
        const self = this;

        return new Promisepolyfill(function(resolve, reject) {
            //Invoking the handlers asynchronously so need to wrap in function
            const internalOnFulfilled = function(value) {
                setTimeout(function() {
                    if (typeof onFulfilled === 'function') {
                        try {
                            const value = onFulfilled(self._value);
                            resolve(value);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        resolve(self._value);
                    }
                }, 0);
            };

            const internalOnReject = function(value) {
                setTimeout(function() {
                    if (typeof onRejected === 'function') {
                        try {
                            const value = onRejected(self._value);
                            resolve(value);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(self._value);
                    }
                }, 0);
            };

            self._observers.push({
                onFulfilled: internalOnFulfilled,
                onRejected: internalOnReject
            });

            switch (self._state) {
                case FULFILLED:
                    internalOnFulfilled(resolve, reject);
                    break;
                case REJECTED:
                    internalOnReject(resolve, reject);
                    break;
            }
        });
    };

    Promisepolyfill.prototype.resolve = function(value) {
        return new Promisepolyfill(function(resolve) {
            resolve(value);
        });
    };

    Promisepolyfill.prototype.reject = function(value) {
        return new Promisepolyfill(function(_, reject) {
            reject(value);
        });
    };

    Promisepolyfill.prototype.catch = function(onRejected) {
        return this.then(null, onRejected);
    };

    if (typeof exports !== 'undefined' && exports)
    {
        exports.Promise = Promisepolyfill;
    } else {
        global['Promise'] = Promisepolyfill;
    }
})(
    typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : this
);
