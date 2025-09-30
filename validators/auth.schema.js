import * as yup from "yup";

export const signupSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

export const loginSchema = yup.object({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const profileSchema = yup.object({
  name: yup.string().optional(),
  email: yup.string().email("Invalid email format").optional(),
  password: yup.string().min(6, "Password must be at least 6 characters").optional(),
});
