import { Schema, model } from "mongoose";

const channelSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    channel: {
        type: String,
        enum: ["Text", "Audio", "Video"],
        default: "Text"
    }
}, { timestamps: true })

const Channel = model("channel", channelSchema)

export default Channel;