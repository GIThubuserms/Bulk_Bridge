class ApiError extends Error {
  constructor(
    statuscode,
    message = "Something went wrong",
    error = [],
    stack = "",
  ) {
    super(message),
    this.statuscode=statuscode,
    Error.captureStackTrace(this,this.constructor),
    this.error=error,
    this.stack=stack
  }
}

export default ApiError
