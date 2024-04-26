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
        ref: "channel"
    },
    member : {
        type: Schema.Types.ObjectId,
        ref: "server_member"
    }
}, { timestamps: true })

const Server = model("server", serverSchema)

export default Server;