const cds = require("@sap/cds");
const { handleAll, fallback, retry, ConstantBackoff, timeout, TimeoutStrategy, circuitBreaker, ConsecutiveBreaker, BrokenCircuitError, bulkhead, BulkheadRejectedError } = require('cockatiel')

const rollTheDice = (faces) => {
    return Math.floor(Math.random() * faces)
}

const myFailingFunction = async (rolledFace) => {
    if(rolledFace === 1){
        return {msg: "We succeded!"}
    }else{
        console.log("We Failed")
        throw Error("We failed my Lord!")
    }
}

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms))

const myLongRunningFunction = async () => {
    await snooze(5000)
    return {msg: "I was very slow"}
}

const myShortBreakFunction = async () => {
    await snooze(30000)
    return {msg: "Here i am!"}
}

const myFunctionOverload = async () => {
    const calls = [0,1,2,3,4,5,6] // Add an element to see the policy being activated
    const bulkheadStrategy = bulkhead(5)
    //will fail on purpose
    for(const call in calls){
        return bulkheadStrategy.execute( () => myShortBreakFunction())
    }
}

module.exports = cds.service.impl(async (srv) => {

    srv.on("READ", "Fallback", async() => {
        const fallbackStrategy = fallback(handleAll, [{ msg: "The servants failed, but we succeded!" }])
        
        return await fallbackStrategy.execute( () => myFailingFunction(rollTheDice(2)))
       
    });

    srv.on("READ", "Retry", async() => {
        //The backoff determines how long the function will wait after receiving an error for a retry
        const retryStrategy = retry(handleAll, {maxAttempts: 3, backoff: new ConstantBackoff})
        return await retryStrategy.execute(() => myFailingFunction(rollTheDice(8)))

    })

    srv.on("READ", "CircuitBreaker", async() => {
        const circuitBreakerStrategy = circuitBreaker(handleAll, {halfOpenAfter: 10*1000, breaker: new ConsecutiveBreaker(5)})

        try{
            return await circuitBreakerStrategy.execute(() => myFailingFunction(rollTheDice(1000)))
        } catch (e){
            if(e instanceof BrokenCircuitError){
                return {msg: "Service unavailable"}
            }else{
                throw e
            }
        }
    })

    srv.on("READ", "Bulkhead", async() => {
        return await myFunctionOverload()
    })

    srv.on("READ", "Timeout", async() => {
        //Throw timeout after 3000ms, in SAP context should be done in Destination settings
        //In this case called function would answer after 5000
        const timeoutExecution = timeout(3000, TimeoutStrategy.Aggressive)
        return await timeoutExecution.execute(() => myLongRunningFunction())
    })
})