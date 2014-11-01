module.exports = Condition;

// Condition class

function Condition()
{
    this.set = false;
    this.onhold = [];
}

// asynchronously wait on a condition variable
// returns a promise that will resolve to true once the condition is set

Condition.prototype.wait = function()
{
    var     self = this;

    return new Promise(function(fulfill, reject) {
        if (self.set) {
            fulfill(true);
            return;
        }
        self.onhold.push(function() {
            fulfill(true);
        });
    });
};

// set the condition to true and resolve all promises waiting for the condition
// The pending promises are guaranteed to resolve asynchronously, in a manner that
// is consistent with the Promise A+ rules

Condition.prototype.signal = function()
{
    if (this.set)
        return;
        
    this.set = true;
    this.onhold.forEach(function(unblock) {
        
        // we fulfill the pending promises synchronously.
        // however any then function on those promises will be called
        // asynchronously (see Promise A+)
        
        unblock();
    });
    this.onhold = [];
};

// trueCondition is a global condition variable that immediately resolves to true

Condition.trueCondition = new Condition();
Condition.trueCondition.signal();

