export function exceptionResponseMapper(exception) {
  try {
    throw new exception();
  } catch (httpError) {
    const { message, error, statusCode } = httpError.response;
    return { message, error, statusCode };
  }
}
