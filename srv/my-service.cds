service CommonResiliencePatternService {
    entity Fallback {
        key msg: String;
    }
    entity Retry {
        key msg: String;
    }
    entity Timeout {
        key msg: String;
    }

    entity CircuitBreaker {
        key msg: String;
    }
    entity Bulkhead {
        key msg: String;
    }
}