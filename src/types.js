import { typebox } from "./deps.js";

const { Type } = typebox;

const Nullable = (type) => Type.Union([type, Type.String({ const: "" })]);

export const ProfileType = Type.Object({
  email: Type.String({ format: "email" }),
  name: Type.String({
    minLength: 3,
    maxLength: 255,
  }),
  job: Type.String({
    minLength: 3,
    maxLength: 255,
  }),
  city: Type.String({
    minLength: 3,
    maxLength: 255,
  }),
  bio: Type.Optional(Nullable(Type.String({
    maxLength: 8192,
  }))),
  avatar: Type.Optional(Nullable(Type.String({
    format: "uri",
  }))),
});
