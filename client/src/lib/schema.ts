import * as yup from "yup";

export const signUpSchema = yup.object().shape({
    name: yup.string()
        .min(3, "Name too short.")
        .max(20, "Name too long.")
        .required("Name required."),
    email: yup.string()
        .email("Invalid email.")
        .required("Email required."),
    password: yup.string()
        .min(8, "Password too short.")
        .max(20, "Password too long.")
        .required("Password required.")
});

export const signInSchema = yup.object().shape({
    email: yup.string()
        .email("Invalid email.")
        .required("Email required."),
    password: yup.string()
        .min(8, "Password too short.")
        .max(20, "Password too long.")
        .required("Password required.")
});

export const emailSchema = yup.object().shape({
    email: yup.string()
        .email("Invalid email.")
        .required("Email required."),
})