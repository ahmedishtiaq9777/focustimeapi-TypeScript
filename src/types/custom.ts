import { User } from "../models";
export type Status = "Not Started" | "In Progress" | "Completed";
export type Priority = "Low" | "Moderate" | "Extreme";

export type requiredAttributes = Pick<
  User,
  "name" | "email" | "password" | "role"
>;
export type UserInput = Required<requiredAttributes>;
