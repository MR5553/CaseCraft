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

export const phoneSchema = yup.string().required("Phone number is required").matches(/^[0-9]{10}$/, "Phone number must be 10 digits");

export const addressSchema = yup.object({
    address_line_1: yup
        .string()
        .required("Address Line 1 is required")
        .min(3, "Address Line 1 must be at least 3 characters"),

    address_line_2: yup
        .string()
        .optional()
        .max(100, "Address Line 2 must be at most 100 characters"),

    landmark: yup
        .string()
        .optional()
        .max(100, "Landmark must be at most 100 characters"),

    city: yup
        .string()
        .required("City is required")
        .min(2, "City must be at least 2 characters"),

    state: yup
        .string()
        .required("State is required")
        .min(2, "State must be at least 2 characters"),

    pincode: yup
        .string()
        .required("Pincode is required")
        .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),

    country: yup
        .string()
        .required("Country is required")
        .min(2, "Country must be at least 2 characters"),
});

export type address = yup.InferType<typeof addressSchema>;