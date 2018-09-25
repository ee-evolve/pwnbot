class AsyncThrottle {

    constructor(delay) {
        this.delay = delay;
        this.nextRequestAvailableDate = new Date().getMilliseconds();
    }

    reserveAndGetDelayUntilNextRequest() {
        let now = new Date().getMilliseconds();
        let delay = this.nextRequestAvailableDate - now;
        if(delay < 0) {
            delay = 0;
        }

        this.nextRequestAvailableDate = (now > this.nextRequestAvailableDate ? now : this.nextRequestAvailableDate) +  this.delay;
        return delay;
    }
}
module.exports = AsyncThrottle;