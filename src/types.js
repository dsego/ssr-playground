import { Yup } from "./deps.js";

export const Profile = Yup.object({
  email: Yup.string()
    .email()
    .required(),
  name: Yup.string()
    .required()
    .min(3)
    .max(255),
  job: Yup.string()
    .required()
    .min(3)
    .max(255),
  city: Yup.string()
    .required()
    .min(3)
    .max(255),
  bio: Yup.string()
    .max(8192),
  avatar: Yup.string()
    .url(),
});
