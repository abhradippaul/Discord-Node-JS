import { findTheServerWithServerName, getServerInfoFromMongodb, getServerInfoFromMongodbForServerInvitation, getServerSidebarInfo } from "../helpers/server.helpers.js";
import Server from "../models/server.models.js";
import ServerMember from "../models/server_member.models.js";
import { v4 } from "uuid"
import User from "../models/user.models.js";

export async function isServerExist(req, res) {
    try {
        const { serverName } = req.params
        if (!serverName) {
            return res.status(400).json({ message: "Please provide a server name" })
        }
        const isServerExist = await findTheServerWithServerName(serverName)

        if (!isServerExist.length) {
            return res.status(200).json({ success: true, message: "Server name is unique" });
        }
        else {
            return res.status(200).json({ success: false, message: "Server name is not unique" });
        }
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function createServer(req, res) {
    try {
        const { name, imageUrl } = req.body
        const { userEmail } = req.params

        if (!name) {
            return res.status(400).json({ message: "Give server name" });
        }

        if (!userEmail) {
            return res.status(400).json({ message: "Give owner info" });
        }

        const isUserExist = await User.findOne({ email: userEmail }, { _id: 1 })

        if (!isUserExist?._id) {
            return res.status(400).json({ message: "User not found" });
        }

        const inviteCode = v4()

        if (!inviteCode) {
            return res.status(400).json({
                message: "Failed to generate invite code"
            })
        }

        const isServerCreated = await Server.create({
            name,
            imageUrl: imageUrl || "",
            inviteCode
        })

        if (!isServerCreated._id) {
            return res.status(400).json({
                message: "Server not created"
            })
        }

        const isJoinedToServer = await ServerMember.create({
            user: isUserExist._id,
            server: isServerCreated._id,
            role: "Admin"
        })

        if (!isJoinedToServer._id) {
            return res.status(400).json({
                message: "Failed to join to the server"
            })
        }

        // const isChannelCreated = await Channel.create({
        //     user: isUserExist[0]._id,
        //     server: isServerCreated._id
        // })

        // if (!isChannelCreated._id) {
        //     return res.status(400).json({
        //         message: "Failed to create channel"
        //     })
        // }

        return res.status(201).json({
            message: "Server created successfully",
            success: true,
            data: {
                isServerCreated,
                isJoinedToServer
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function joinToTheServer(req, res) {
    try {
        const { userId, serverId } = req.body

        if (!userId || !serverId) {
            return res.status(400).json({
                message: "Please provide user id, invite code and server id"
            })
        }

        await ServerMember.create({
            user: userId,
            server: serverId
        })

        return res.status(201).json({
            message: "Successfully joined to the server",
            success: true,
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function checkIsTheUserAlreadyJoined(req, res) {
    // In this function first checking is the user exists and getting the user id and checking is the server exist with this invite code if exist getting the server info and checking is the user is already joined or not
    try {
        const { userEmail, inviteCode } = req.body
        const { serverId } = req.params

        if (!userEmail || !serverId || !inviteCode) {
            return res.status(400).json({
                message: "Please provide user id, invite code and server id"
            })
        }

        const isUserExist = await User.findOne({
            email: userEmail
        }, { _id: 1 })


        if (!isUserExist) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        const serverInfo = await getServerInfoFromMongodbForServerInvitation(serverId, inviteCode, isUserExist._id)

        if (!serverInfo?.length) {
            return res.status(400).json({
                message: "Server not found or invalid invite code"
            })
        }

        if (serverInfo[0].isJoined) {
            return res.status(200).json({
                message: "Already Joined"
            })
        }

        return res.status(202).json({
            success: true,
            userId: isUserExist._id,
            serverInfo: serverInfo[0]
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function getServerInviteCode(req, res) {
    try {
        const { serverId } = req.params

        if (!serverId) {
            return res.status(400).json({
                message: "Please provide server id"
            })
        }

        const response = await Server.findOne({ _id: serverId }, { inviteCode: 1, _id: 0 })

        if (!response?.inviteCode) {
            return res.status(400).json({
                message: "Server not found"
            })
        }

        return res.status(200).json({
            message: "Server found",
            success: true,
            inviteCode: response?.inviteCode
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function createServerInviteCode(req, res) {
    try {
        const { serverId } = req.params
        if (!serverId) {
            return res.status(400).json({
                message: "Please provide server id"
            })
        }

        const inviteCode = v4()

        if (!inviteCode) {
            return res.status(400).json({
                message: "Please provide invite code"
            })
        }
        const isInviteCodeUpdated = await Server.findByIdAndUpdate(serverId, {
            $set: {
                inviteCode: inviteCode
            }
        }, { new: true })

        if (!isInviteCodeUpdated.inviteCode) {
            return res.status(400).json({
                message: "Failed to update invite code"
            })
        }
        return res.status(201).json({
            success: true,
            inviteCode: isInviteCodeUpdated.inviteCode
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function leaveTheServer(req, res) {
    try {
        const { serverId } = req.params
        const { userEmail } = req.body

        if (!userEmail || !serverId) {
            return res.status(400).json({
                message: "Please provide user email and server id"
            })
        }

        const userId = await User.findOne({ email: userEmail }, { _id: 1 })

        if (!userId?.id) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        const response = await ServerMember.deleteOne({
            user: userId,
            server: serverId
        })

        if (!response.deletedCount) {
            return res.status(400).json({
                message: "Failed to leave the server"
            })
        }

        return res.status(200).json({
            message: "Leaved from the server successfully",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function getServer(req, res) {
    try {
        const { serverId } = req.params

        if (!serverId) {
            return res.status(400).json({
                message: "Please provide a server name"
            })
        }

        const response = await getServerInfoFromMongodb(serverId)

        if (!response.length) {
            return res.status(400).json({
                message: "Server not found"
            })
        }

        return res.status(200).json({
            message: "Server found",
            success: true,
            data: response[0]
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function serverSidebarInfo(req, res) {
    try {
        const { serverId } = req.params

        if (!serverId) {
            return res.status(400).json({
                message: "Please provide a server id"
            })
        }

        const response = await getServerSidebarInfo(serverId)

        if (!response.length) {
            return res.status(400).json({
                message: "Server not found"
            })
        }

        return res.status(200).json({
            message: "Server found",
            success: true,
            data: response[0]
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function updateServerInfo(req, res) {
    try {
        const data = req.body
        const { serverId } = req.params
        if (!data.name && !data.imageUrl) {
            return res.status(404).json({
                message: "Please provide server name or image url"
            })
        }
        const response = await Server.updateOne({ _id: serverId }, { $set: data })

        if (!response.modifiedCount) {
            return res.status(400).json({
                message: "Error in updating server info"
            })
        }

        return res.status(200).json({
            message: "Image updated successfully",
            success: true
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function deleteServer(req, res) {
    try {
        const { serverId } = req.params
        if (!serverId) {
            return res.status(400).json({
                message: "Please provide a server id"
            })
        }
        const leave = await ServerMember.deleteMany({ server: serverId })

        if (!leave.deletedCount) {
            return res.status(400).json({
                message: "Error occurred while deleting server member"
            })
        }

        const response = await Server.deleteOne({ _id: serverId })

        if (!response.deletedCount) {
            return res.status(400).json({
                message: "Error occurred while deleting"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Server deleted successfully"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function updateUserPermission(req, res) {
    try {
        const { serverId } = req.params
        const { userId, role } = req.body

        if (!serverId) {
            return res.status(400).json({
                message: "Please provide server id"
            })
        }

        if (!userId || !(role === "Admin" || role === "Moderator" || role === "Guest")) {
            return res.status(400).json({
                message: "Please provide valid user information"
            })
        }

        const response = await ServerMember.updateOne({
            server: serverId,
            user: userId
        }, { $set: { role: role } })

        if (!response?.modifiedCount) {
            return res.status(400).json({
                message: "Error occurred while updating user permission"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Permission updated successfully"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}