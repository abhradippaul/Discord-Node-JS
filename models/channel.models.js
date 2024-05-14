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
    type: {
        type: String,
        enum: ["TEXT", "AUDIO", "VIDEO"],
        default: "TEXT"
    },
    name : {
        type: String,
        required: true
    }
}, { timestamps: true })

const Channel = model("Channel", channelSchema)

export default Channel;