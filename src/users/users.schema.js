const Joi = require("joi")

exports.signupSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),  
})

exports.loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
})
