import { Schema, model } from "mongoose";

const serverSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String
    },
    inviteCode: {
        type: String
    },
    channel : {
        type: Schema.Types.ObjectId,
        ref: "Channel"
    },
    member : {
        type: Schema.Types.ObjectId,
        ref: "Server_member"
    }
}, { timestamps: true })

const Server = model("Server", serverSchema)

export default Server;