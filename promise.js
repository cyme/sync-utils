// use ES5 and the es6-shim library from Paul Miller until node catches up to a recent enough version
// of V8 (3.27.x or newer) that better supports the ES6 collections

require('es6-shim');

// Promise.settle is a static method that takes an iterable of promises or values.
// It returns a promise that resolves to an array of values when all promises have
// resolved, like Promise.all.
// However, unlike Promise.all, if a promise rejects, it waits for all remaining
// promises to either resolve or reject and it returns a promise that rejects with
// an object that captures all resolved values and rejection reasons.
// This allows the rejection function to inspect the results and for example unwind
// the side effects of the promises that have resolved.

Promise.settle = function(promises) {
    
    var     size;
    var     results;
    var     reasons;
    var     rejected;
    var     goodPromises;

    rejected = false;
    size = 0;
    goodPromises = [];
    promises.forEach(function(value) {
        var     index;
        var     goodPromise;
        
        index = size++;
        goodPromise = Promise.resolve(value)
            .then(function(result) {
                results[index] = result;
            }, function(reason) {
                reasons[index] = reason;
                rejected = true;
            });
        goodPromises.push(goodPromise);
    });

    results = new Array(size);
    reasons = new Array(size);

    return Promise.all(goodPromises)
    .then(function() {
        if (rejected)
            return Promise.reject({ resolved: results, rejected: reasons });
        return Promise.resolve(results);
    });
};

// Promise.evaluate safely evaluates a function that returns a value or a promise
// it returns a promise that resolves to that value or the resolved promise
// if the function throws an exception, it returns a promise that rejects with
// exception as the reason

Promise.evaluate = function(task)
{
    try {
        return Promise.resolve(task());
    } catch (error) {
        return Promise.reject(error);
    }
};
