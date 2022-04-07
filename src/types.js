import { Joi } from "./deps.js";

export const Profile = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .empty(""),
  name: Joi.string().empty(""),
  bio: Joi.string().empty(""),
  job: Joi.string().empty(""),
  city: Joi.string().empty(""),
  avatar: Joi.string().uri().empty(""),
});
