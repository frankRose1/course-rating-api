import Joi from '@hapi/joi';

/**
 * Validate data needed to created an instance of a User
 * @param {Object} data - data representing a User object 
 */
export const validateCreateUser = (data) => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(45).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        name: Joi.string().alphanum().min(2).max(200).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    })

    return Joi.validate(data, schema)
}

/**
 * Validate data needed to generate a User's auth token
 * @param {Object} data - a users login credentials
 */
export const validateAuthCredentials = (data) => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(45).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    })

    return Joi.validate(data, schema)
}