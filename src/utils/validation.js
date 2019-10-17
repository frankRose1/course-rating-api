import Joi from '@hapi/joi';

/**
 * Validate data needed to created an instance of a User
 * @param {Object} data - data representing a User object 
 */
export const validateCreateUser = data => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(45).required(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        name: Joi.string().min(2).max(200).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    });

    return Joi.validate(data, schema)
};

/**
 * Validate data needed to generate a User's auth token
 * @param {Object} data - a users login credentials
 */
export const validateAuthCredentials = data => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(45).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
    });

    return Joi.validate(data, schema);
};

/**
 * Validate data needed to create and update a Course
 * @param {Object} data - course data
 */
export const validateCreateUpdateCourse = data => {
    const schema = Joi.object().keys({
        title: Joi.string().min(5).max(150).required(),
        description: Joi.string().min(10).max(1000).required(),
        estimatedTime: Joi.string().min(5).max(150).required(),
        materialsNeeded: Joi.string().min(5).max(500),
        steps: Joi.array().items({
            stepNumber: Joi.number().integer(),
            title: Joi.string().min(10).max(150).required(),
            description: Joi.string().min(10).max(250).required()
        })
    });

    return Joi.validate(data, schema);
};

/**
 * Validate data needed to create and update a Review
 * @param {Object} data - review data
 */
export const validateCreateUpdateReview = data => {
    const schema = Joi.object().keys({
        rating: Joi.number().integer().min(1).max(5).required(),
        description: Joi.string().min(10).max(1000),
    });

    return Joi.validate(data, schema);
};