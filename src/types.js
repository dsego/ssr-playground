import { Joi } from "./deps.js";

export const Profile = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .empty(""),
  name: Joi.string(),
  bio: Joi.string(),
  job: Joi.string(),
  avatar: Joi.string().uri().empty(""),
});
