import { Schema, model } from "mongoose";

const serverMemberSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    server : {
        type : Schema.Types.ObjectId,
        ref : "Server"
    },
    role: {
        type: String,
        enum: ["Admin", "Moderator", "Guest"],
        default: "Guest"
    }
}, { timestamps: true })

const ServerMember = model("Server_member", serverMemberSchema)

export default ServerMember;