import { model, Schema } from "mongoose";
import { userType } from "../types/user.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.types";

const userSchema = new Schema<userType>({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, "invalid email"],
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\d{10}$/, "Please fill a valid 10-digit phone number."],
        sparse: true
    },
    password: {
        type: String,
        trim: true,
        required: function () {
            return !this.providers || this.providers.length === 0;
        },
        minlength: 8,
        select: false,
    },
    profileImage: {
        publicId: {
            type: String,
            default: ""
        },
        imageUrl: {
            type: String,
            default: ""
        }
    },
    address: {
        address_line_1: { type: String, trim: true },
        address_line_2: { type: String, trim: true },
        landmark: { type: String, trim: true },
        city: { type: String, trim: true },
        state: { type: String, trim: true },
        pincode: {
            type: String,
            trim: true,
            match: [/^\d{6}$/, "Please fill a valid 6-digit pincode."]
        },
        country: {
            type: String,
            required: true,
            default: "India"
        }
    },
    providers: [{
        _id: false,
        provider: { type: String },
        providerId: { type: String }
    }],
    refreshToken: {
        type: String,
        default: ""
    },
    token: {
        type: String,
        default: "",
        select: false
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number,
        select: false,
    },
    verificationCodeExpiry: {
        type: Date,
        select: false,
    },
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if (this.isModified("password") && this.password) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.verifyPassword = async function (password: string) {
    if (this.password) {
        return await bcrypt.compare(password, this.password);
    }
    return false;
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
        } as jwtToken,
        process.env.ACCESS_TOKEN_SECRET as string,
        {
            expiresIn: "1h"
        }
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
        } as jwtToken,
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: "30d"
        }
    )
};

export const Users = model<userType>("Users", userSchema);