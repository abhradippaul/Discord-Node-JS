import { Schema, model } from "mongoose";

const serverMemberSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "user"
    },
    server : {
        type : Schema.Types.ObjectId,
        ref : "server"
    },
    role : {
        type : Schema.Types.ObjectId,
        ref : "role"
    }
}, { timestamps: true })

const ServerMember = model("server_member", serverMemberSchema)

export default ServerMember;