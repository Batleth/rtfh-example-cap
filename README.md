# Motivation
Today`s cloud-based applications often depend on communicating with other systems or applications over a wide ranging network spanned over different zones and landscapes. Such systems can be unavailable due to transient faults such as network problems, timeouts or unresponsive subsystems.

Therefor in all languages we have a set of reactive strategies for dealing with transient faults and proactive strategies for supporting resilience and stability.

In context of the [SAP Cloud Application Programming Model](https://cap.cloud.sap/) the Java version has the ability to use the resilience features of the SAP Cloud SDK. Also if you are running you application on Kyma you can use Istio to configure resilience for the network destinations of your service mesh.

In the case of an CAP Node.js application running on Cloud Foundry you have to implement your own resilience and transient-fault.handling capabilities. But since we do not want to reinvent the wheel we can use libraries like Cockatiel to address our problems.

[Cockatiel](https://github.com/connor4312/cockatiel) as its role model [Polly](https://github.com/App-vNext/Polly), identifiable by the name giving animals, provide standard ways for developers to express common policies as Retry, Circuit Breaker, Timeout, Bulkhead and Fallback.

In the following part we will take a look at these policies, take a look at the use cases and see how we would implemented in our CAP application.

## Next Steps

- Open a new terminal and run `cds watch` 
- Tryout patterns using the Get request on the Entity of the service
- Watch console and code for understanding

I got some issues on CircuitBreakers and Bulkhead Operation and implementing them to be CAPsafe.
If someone is a Node.js magician it would be nice to do a pull request :)
## Learn More
Learn more at [Blogpost]()
