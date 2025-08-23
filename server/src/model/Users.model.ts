import { model, Schema } from "mongoose";
import { userType } from "../types/user.types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.types";

const userSchema = new Schema<userType>({
    profileInfo: {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: [5, "username must be at least 3 characters"],
            maxlength: [30, "username must be at most 30 characters"],
        },
        username: {
            type: String,
            unique: true,
            trim: true,
            minlength: [5, "username must be at least 3 characters"],
            maxlength: [30, "username must be at most 30 characters"],
            sparse: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "invalid email"],
        },
        password: {
            type: String,
            trim: true,
            minlenght: 8,
            maxlenght: 16
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
        coverImage: {
            publicId: {
                type: String,
                default: ""
            },
            imageUrl: {
                type: String,
                default: ""
            }
        },
        description: {
            type: String,
            trim: true,
        }
    },
    socialLinks: {
        instagram: {
            type: String,
            default: ""
        },
        facebook: {
            type: String,
            default: ""
        },
        twitter: {
            type: String,
            default: ""
        },
        LinkedIn: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        }
    },
    providers: {
        type: [String],
        default: []
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true,
    },
    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    watchLater: [
        {
            type: Schema.Types.ObjectId,
            ref: "video"
        }
    ],
    refreshToken: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: Number,
        default: undefined
    },
    verificationCodeExpiry: {
        type: Date,
        default: undefined
    }
}, { timestamps: true });



userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.profileInfo.password = await bcrypt.hash(this.profileInfo.password, 12);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    if (this.profileInfo.password) {
        return await bcrypt.compare(password, this.profileInfo.password);
    }
    return false;
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.profileInfo.email,
            username: this.profileInfo.username,
        } as jwtToken,
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: "3d"
        }
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.profileInfo.email,
            username: this.profileInfo.username,
        } as jwtToken,
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: "30d"
        }
    )
};

export const Users = model<userType>("Users", userSchema);