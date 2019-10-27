import * as ErrorHandler from '../utils/ErrorHandler';

const handle404Error = app => {
  app.use((req, res, next) => {
    ErrorHandler.notFoundError();
  });
}

const handleClientError = app => {
  app.use((err, req, res, next) => {
    ErrorHandler.clientError(err, res, next);
  });
}

const handleServerError = app => {
  app.use((err, req, res, next) => {
    ErrorHandler.serverError(err, res, next);
  });
}

export default [
  handle404Error,
  handleClientError,
  handleServerError
];