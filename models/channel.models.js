import { Schema, model } from "mongoose";

const channelSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    server: {
        type: Schema.Types.ObjectId,
        ref: "Server"
    },
    channel: {
        type: String,
        enum: ["Text", "Audio", "Video"],
        default: "Text"
    }
}, { timestamps: true })

const Channel = model("Channel", channelSchema)

export default Channel;