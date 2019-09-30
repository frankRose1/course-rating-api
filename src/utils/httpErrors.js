export class HTTPClientError extends Error {
    constructor(message){
        if (message instanceof Object) {
            super(JSON.stringify(message))
        } else {
            super(message)
        }
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

export class HTTP400Error extends HTTPClientError {
    constructor(message = 'Bad Request'){
        super(message)
        this.statusCode = 400
    }
}

export class HTTP401Error extends HTTPClientError {
    constructor(message = 'Unauthorized'){
        super(message)
        this.statusCode = 401
    }
}

export class HTTP403Error extends HTTPClientError {
    constructor(message = 'Forbidden'){
        super(message)
        this.statusCode = 403
    }
}

export class HTTP404Error extends HTTPClientError {
    constructor(message = 'Not Found'){
        super(message)
        this.statusCode = 404
    }
}