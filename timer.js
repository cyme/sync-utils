module.exports = Timer;

// Timer is a class that can be used to scheduled timeouts
// it is initialized with a timeout expressed in milliseconds, from the time of the call

function Timer(milliseconds)
{
    var     self;
    
    self = this;
    this.promise = new Promise(function(fulfill, reject) {
        self.reject = reject;
        self.timeout = setTimeout(function() {
            fulfill(true);
        }, milliseconds);
    });
}

// wait returns a promise that resolves when the timeout has elapsed

Timer.prototype.wait = function()
{
    return this.promise;
};

// cancel cancels a timeout. the promise will reject if the timeout hasn't elapsed yet

Timer.prototype.cancel = function()
{
    this.reject("timeout canceled");
};

// defer is a static method that returns a promise that asynchronously fulfills after
// the event loop has processed pending IO requests.

Timer.defer = function()
{
    return new Promise (function(fulfill, reject) {
        setImmediate(function() {
            fulfill(true);
        });
    });
}
