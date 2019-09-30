import {
    HTTPClientError,
    HTTP404Error
} from './httpErrors'

export const notFoundError = () => {
    throw new HTTP404Error('Route not found')
}

/**
 * Return client errors to the client or propogate the
 * error down the chain
 * @param {Object} err - Error object being thrown 
 * @param {Object} res - response object from express
 * @param {Function} next - next functionn from express
 */
export const clientError = (err, res, next) => {
    if (err instanceof HTTPClientError) {
        console.warn(err)
        res
          .status(err.statusCode)
          .json({ error: err.message })
    } else {
        next(err)
    }
}

/**
 * Send a 500 to the client. If in development a stack
 * trace will also be sent
 * @param {Object} err - Error object being thrown 
 * @param {Object} res - response object from express
 * @param {Function} next - next functionn from express
 */
export const serverError = (err, res, next) => {
    console.error(err)
    if (process.env.NODE_ENV == 'production'){
        res
          .status(500)
          .json({ error: 'Internal server error.' })
    } else {
        res
          .status(500)
          .json({ 
              error: 'Server error.',
              stackTrace: err.stack
           })
    }
}
