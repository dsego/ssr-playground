import { Joi } from "./deps.js";

export const Member = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .empty(""),
  name: Joi.string(),
  bio: Joi.string(),
  skills: Joi.array().items(Joi.string()),
  avatar: Joi.string().uri().empty(""),
});
