module.exports = Semaphore;

// Mutex class

function Semaphore(count)
{
    if (count === undefined)
        count = 1;
    this.count = count;
    this.onhold = [];
}

// asynchronously wait on a semaphore
// returns a promise that will resolve to true once the semaphore is available

Semaphore.prototype.wait = function()
{
    var     self = this;
    
    return new Promise(function(fulfill, reject) {
        if (--self.count >= 0) {
            fulfill(true);
            return;
        }
        self.onhold.push(function() {
            fulfill(true);
        });
    });
};

// signal a semaphore and resolve the next promise in line waiting for it

Semaphore.prototype.signal = function()
{
    var     blocked;
    
    if (this.count++ < 0) {
        blocked = this.onhold.shift();
        blocked();
    }
};