class ServiceUnavailable extends Error {
  get status() {
    return 503;
  }
  get message() {
    return 'Service Unavailable';
  }
}

class NotFound extends Error {
  get status() {
    return 404;
  }
}

class BadRequest extends Error {
  get status() {
    return 400;
  }
}

// Parameters given through the request are invalid
class InvalidParameters extends Error {
  get code() {
    return 3;
  }
  get status() {
    return 400;
  }
}

// No exchange had sufficient funds to process the quote
class InsufficientFunds extends Error {
  get code() {
    return 6;
  }
  get status() {
    return 503;
  }
  get message() {
    return 'Service Unavailable';
  }
}

// Order was not filled on the exchange
class OrderNotFilled extends ServiceUnavailable {
  get code() {
    return 7;
  }
}

// Incorrect credentials given for an exchange
class IncorrectCredentials extends ServiceUnavailable {
  get code() {
    return 8;
  }
}

// No settings are set for exchanges in the database
class NoExchangesAvailable extends ServiceUnavailable {
  get code() {
    return 9;
  }
}

// A quote's amount is bigger than the orderbook's total size
class OrderbookOverflow extends ServiceUnavailable {
  get code() {
    return 5;
  }
}

// There's already an order for this quote
class OrderDuplicate extends BadRequest {
  get code() {
    return 10;
  }
}

// Self explanatory, eh?
class QuoteExpired extends BadRequest {
  get code() {
    return 11;
  }
}

module.exports = {
    ServiceUnavailable,
    NotFound,
    InvalidParameters,
    OrderbookOverflow,
    InsufficientFunds,
    OrderNotFilled,
    IncorrectCredentials,
    NoExchangesAvailable,
    OrderDuplicate,
    QuoteExpired
};