# sync-utils

sync-utils is a Node.js module that offers synchronization primitives based on the Promise design pattern. Support for Promises is being introduced natively to Javascript as defined in the ECMAScript 6 draft.

### Semaphore

`Semaphore` is a class that implements a counted semaphore.

`Semaphore([count])` is the class constructor. Count specifies an initial semaphore count. The count is the number of times the semaphore can be grabbed before blocking. When the option count parameter is omitted, its default value is 1.

`Semaphore.prototype.wait()` decrements the semaphore count and returns a Promise that resolves to true when the semaphore is successfully grabbed. The Promise resolves immediately to true if the semaphore is available, that is when its count is positive. If the semaphore isn't available, the request is queued. The Promise returned by multiple calls to this method will resolve in the same order as the calls.

`Semaphore.prototype.signal()` increments the semaphore count. If the count was negative, it causes the next Promise in the queue to resolve.


### Condition

`Condition` is a class that implements a binary condition.

`Condition()` is the class constructor. The condition is initially set to false.

`Condition.prototype.wait()` returns a Promise that resolves to true when the condition is set to true. If the condition is already set to true at the time of the call, the Promise resolves immediately. If the condition is false, the request is queued.

`Condition.prototype.signal()` set the condition to true and causes any Promise queued for this condition to resolve to true. If the condition is already set to true, no action is taken.


### Timer

`Timer` is a class that implements timer services.

`Timer(milliseconds)` is the class constructor. The timer is initialized with a timeout expressed in millisecond. The timer is activated at this time, i.e. the timer starts counting down from the moment it is initialized.

`Timer.prototype.wait()` returns a Promise that resolves to true when the timer has elapsed, unless the timer is canceled. The Promise rejects if the timer is canceled.

`Timer.prototype.signal()` cancels a timer. The Promise rejects.

`Timer.defer()` is a static method returning a Promise that resolves on the next tick of the event loop.

### Promise extensions

The following static methods have been added to Promise for convenience.

`Promise.settle(iterable)` takes an iterable of promises or values. Like Promise.all, it returns a promise that resolves to an array of values when all promises have resolved. However, unlike Promise.all, if a promise rejects, it waits for all remaining promises to either resolve or reject, and it returns a promise that rejects with an object that captures all resolved values and rejection reasons. This allows the rejection function to inspect the results and for example unwind the side effects of the promises that have resolved.

`Promise.evaluate(task)` evaluates the passed function, and returns the value or promise returned by the function. If the function throws an exception, it returns a promise that rejects with the exception as the reason. The allows for the guarded evaluation of an expression, which Promise.resolve does not offer.

# Usage Example

```
// import the module

var Condition = require('sync-utils').Condition;
var Timer = require('sync-utils').Timer;
var Semaphore = require('sync-utils').Semaphore;

// condition demonstration

var myCondition = new Condition();

myCondition.wait().then(function() {
    console.log('condition has been fulfilled');
});
myCondition.signal();

// timer demonstration

var myTimer = new Timer(5000);
myTimer.wait().then(function() {
    console.log('timer has elapsed');
});

// semaphore demonstration

var mySemaphore = new Semaphore(0);
mySemaphore.wait().then(function() {
    console.log('semaphore was release');
});
mySemaphore.signal();

// promise demonstration

var myFirstPromise = ...;
var mySecondPromise = ...;
Promise.settle([myFirstPromise, mySecondPromise])
.then(function(results) {
    // all went well
    ...
})
.catch(function(reason) {
    // something went wrong

    // go over the promises that did resolve
    reason.resolved.forEach(function(value) {
        if (value === undefined)
            continue;
        ...
    });
    
    // go over the promises that rejected
    reason.rejected.forEach(function(reason) {
        if (reason === undefined)
            continue;
        ...
    });
});
```

# Getting Started

To install sync-utiles, simply `npm install sync-utils`.

# Credits

Special thanks to Paul Miller for his excellent ECMAScript 6 shim module `es6-shim`, which we're using here for its implementation of the Promise object.
