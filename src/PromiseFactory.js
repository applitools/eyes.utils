(function () {
    'use strict';

    /**
     * After initialization, provides factory methods for creating deferreds/promises.
     *
     * @constructor
     * @param {function} promiseFactoryFunc A function which receives as a parameter
     *                   the same function you would pass to a Promise constructor.
     * @param {function} deferredFactoryFunc A function which returns a deferred.
     */
    function PromiseFactory(promiseFactoryFunc, deferredFactoryFunc) {
        this._promiseFactoryFunc = promiseFactoryFunc;
        this._deferredFactoryFunc = deferredFactoryFunc;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Sets the factory methods which will be used to create promises and deferred-s.
     *
     * @param {function} promiseFactoryFunc A function which receives as a parameter
     *                   the same function you would pass to a Promise constructor.
     * @param {function} deferredFactoryFunc A function which returns a deferred.
     */
    PromiseFactory.prototype.setFactoryMethods = function (promiseFactoryFunc, deferredFactoryFunc) {
        this._promiseFactoryFunc = promiseFactoryFunc;
        this._deferredFactoryFunc = deferredFactoryFunc;
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     *
     * @param {function} asyncAction
     * @return {*}
     */
    PromiseFactory.prototype.makePromise = function (asyncAction) {
        if (this._promiseFactoryFunc) {
            return this._promiseFactoryFunc(asyncAction);
        }

        throw new Error('Promise factory was not initialized with proper callback');
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @template T
     * @param {T} [resolveValue]
     * @return {Promise<T>}
     */
    PromiseFactory.prototype.resolve = function (resolveValue) {
        return this.makePromise(function (resolve) {
            resolve(resolveValue);
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @template T
     * @param {T} [rejectValue]
     * @return {Promise<T>}
     */
    PromiseFactory.prototype.reject = function (rejectValue) {
        return this.makePromise(function (resolve, reject) {
            reject(rejectValue);
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     @param {Promise[]} promises
     @return {Promise<[*]>}
     */
    PromiseFactory.prototype.all = function (promises) {
        var accumulator = [];
        var ready = this.resolve(null);

        promises.forEach(function (promise, ndx) {
            ready = ready.then(function () {
                return promise;
            }).then(function (value) {
                accumulator[ndx] = value;
            });
        });

        return ready.then(function () {
            return accumulator;
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @param {Function<boolean>} condition
     * @param {Function<Promise>} action
     * @return {Promise<void>}
     */
    PromiseFactory.prototype.promiseWhile = function (condition, action) {
        if (!condition()) {
            return this.resolve();
        }

        var that = this;
        return action().then(function () {
            return that.promiseWhile(condition, action)
        });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * @deprecated
     * @return {*}
     */
    PromiseFactory.prototype.makeDeferred = function () {
        if (this._deferredFactoryFunc) {
            return this._deferredFactoryFunc();
        }

        throw new Error('Promise factory was not initialized with proper callback');
    };

    exports.PromiseFactory = PromiseFactory;
}());
