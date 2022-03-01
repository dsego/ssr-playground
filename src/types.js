import { Joi } from "./deps.js";

export const User = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .empty(""),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .empty(""),
  password: Joi.string()
    .min(8),
  // .required()
  // .empty(''),
  name: Joi.string(),
  avatar: Joi.string().uri().empty(""),
});
