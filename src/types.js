import { typebox } from "./deps.js";

const { Type } = typebox;

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
  bio: Type.Optional(Type.String({
    maxLength: 8192,
  })),
  avatar: Type.Optional(Type.String({ format: "uri" })),
  // id: Type.Readonly(Type.String()),
  // createdAt: Type.Readonly(Type.Integer()),
  // updatedAt: Type.Readonly(Type.Integer()),
});
