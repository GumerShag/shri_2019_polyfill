const assert = require('assert');
const PromisePolifill = require('../src/main');

describe('Testing promise polyfill', () => {
    it('Promise resolves successfully', () => {
        return new PromisePolifill(resolve => {
            resolve(42);
        }).then(value => {
            assert.equal(value, 42);
        });
    });

    it('Promise resolves successfully and returns value', () => {
        return new PromisePolifill(resolve => {
            resolve(42);
        })
            .then(value => {
                return value + 1;
            })
            .then(value => {
                assert.equal(value, 43);
            });
    });

    it('Promise catch error', () => {
        return new PromisePolifill(resolve => {
            resolve(42);
        })
            .then(resolve => {
                throw new Error();
            })
            .then(
                resolve => {},
                reject => {
                    return 'ErrorCatched';
                }
            )
            .then(value => {
                assert.equal(value, 'ErrorCatched');
            });
    });

    it('Promise chain', () => {
        return new Promisepolyfill(function(resolve, reject) {
            resolve(42);
        })
            .then(function(resolve) {
                return resolve + 1;
            })
            .then(function(value) {
                //console.log(value); // 43
                return new Promise(function(resolve) {
                    resolve(137);
                });
            })
            .then(function(value) {
                //console.log(value); // 137
                throw new Error();
            })
            .then(
                function() {
                    //console.log('Будет проигнорировано');
                },
                function() {
                    return 'ошибка обработана';
                }
            )
            .then(function(value) {
                assert.equal(value, 'ошибка обработана');
            });
    });
});
