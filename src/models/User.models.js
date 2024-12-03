import mongoose, { Schema, SchemaType } from "mongoose";

const User = Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum:["professor","student"],
            default: false,
        },
        
    },
    {
        timestamps: true,
    }
);

export const UserSchema = mongoose.model("User", User);