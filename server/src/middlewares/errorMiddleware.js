export const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.isOperational ? err.message : 'Lỗi máy chủ';

  // Mongoose CastError - invalid ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'ID không hợp lệ';
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((e) => e.message).join('. ');
  }

  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    console.error('ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
