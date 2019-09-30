import Joi from '@hapi/joi'

/**
 * Validate data needed to created an instance of a User
 * @param {Object} data - data representing a User object 
 */
export const validateCreateUser = (data) => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        name: Joi.string().alphanum().min(2).max(200).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    })

    return Joi.validate(data, schema)
}