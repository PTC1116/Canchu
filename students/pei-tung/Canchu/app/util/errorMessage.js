module.exports = {
  invaildHeader: { status: 400, error: 'Invalid Content-type Header' },
  serverError: { error: 'Server Error', status: 500 },
  clientError: { error: 'Client Error', status: 400 },
  dbError: { status: 500, error: 'Database Connection Failed' },
  redisError: { status: 500, error: 'Redis Connection Failed' },
  signUpFailed: { error: 'Sign Up Failed', status: 403 },
  signInFailed: { error: 'Sign In Failed', status: 403 },
  generateMsg: (statusCode, errMsg) => {
    return { status: statusCode, error: errMsg };
  },
};
