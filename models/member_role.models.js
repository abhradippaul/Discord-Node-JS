import { Schema, model } from "mongoose";

const memberRoleSchema = new Schema({
    role: {
        type: String,
        enum: ["Admin", "Moderator", "Guest"],
        default: "Guest"
    }
}, { timestamps: true })

const MemberRole = model("member_role", memberRoleSchema)

export default MemberRole;