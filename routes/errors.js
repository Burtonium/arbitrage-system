class ServiceUnavailable extends Error {
  get code() {
    return 1;
  }
  get status() {
    return 503;
  }
  get message() {
    return 'Service Unavailable';
  }
}

class PairNotFound extends Error {
  get code() {
    return 2;
  }
  get status() {
    return 404;
  }
  get message() {
    return 'Currency Pair Not Found';
  }
}

class InvalidParameters extends Error {
  get code() {
    return 3;
  }
  get status() {
    return 400;
  }
}

class ServerError extends Error {
  get code() {
    return 4;
  }
  get status() {
    return 500;
  }
  get message() {
    return 'Something went wrong';
  }
}

class OrderbookOverflow extends Error {
  get code() {
    return 5;
  }
  get status() {
    return 400;
  }
}

module.exports = {
    ServiceUnavailable,
    PairNotFound,
    InvalidParameters,
    ServerError,
    OrderbookOverflow
};