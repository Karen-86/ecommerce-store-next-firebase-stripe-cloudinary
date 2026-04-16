type CustomError = Error & { statusCode?: number; data?: any };

const createError = (message = "", status = 400, data = null) => {
  const err = new Error(message) as CustomError;
  err.statusCode = status;
  if (data) err.data = data;
  return err;
};

export default createError;
