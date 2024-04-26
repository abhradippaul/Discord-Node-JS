import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    server: {
        type: Schema.Types.ObjectId,
        ref: "server_member"
    }
}, { timestamps: true })

const User = model("user", userSchema)

export default User;