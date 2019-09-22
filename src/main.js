(function(glob) {
    const [FULFILLED, REJECTED, PENDING] = ['FULFILLED', 'REJECTED', 'PENDING'];

    function Promisepolyfill(func) {
        if (typeof func !== 'function') {
            throw TypeError('Promisepolyfill resolver is not a function');
        }

        this.state = PENDING;
        this.value = null;
        this.observers = [];

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

        this.value = value;
        this.state = FULFILLED;

        this.observers.forEach(function(observer) {
            let handler =
                this.state === FULFILLED
                    ? observer.onFulfilled
                    : observer.onRejected;
            let value = this.value;
            handler(value);
        }, this);

        this.observers.length = 0;
    }

    function reject(value) {
        this.value = value;
        this.state = REJECTED;

        this.observers.forEach(function(observer) {
            let handler = observer.onRejected;
            let value = this.value;
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
                            const value = onFulfilled(self.value);
                            resolve(value);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        resolve(self.value);
                    }
                }, 0);
            };

            const internalOnReject = function(value) {
                setTimeout(function() {
                    if (typeof onRejected === 'function') {
                        try {
                            const value = onRejected(self.value);
                            resolve(value);
                        } catch (e) {
                            reject(e);
                        }
                    } else {
                        reject(self.value);
                    }
                }, 0);
            };

            self.observers.push({
                onFulfilled: internalOnFulfilled,
                onRejected: internalOnReject
            });

            switch (self.state) {
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

    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = Promisepolyfill;
    }
})(
    typeof window !== 'undefined'
        ? window
        : typeof global !== 'undefined'
        ? global
        : this
);
