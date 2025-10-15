const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let error = {
    message: 'Internal Server Error',
    status: 500
  };

  // Handle specific error types
  if (err.name === 'ValidationError') {
    error.message = 'Validation Error';
    error.status = 400;
    error.details = err.details || err.message;
  } else if (err.name === 'UnauthorizedError') {
    error.message = 'Unauthorized';
    error.status = 401;
  } else if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.status = 400;
  } else if (err.code === 11000) {
    error.message = 'Duplicate field value';
    error.status = 400;
  } else if (err.message) {
    error.message = err.message;
    error.status = err.status || 500;
  }

  // Send error response
  res.status(error.status).json({
    error: {
      message: error.message,
      status: error.status,
      ...(error.details && { details: error.details }),
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

module.exports = errorHandler;