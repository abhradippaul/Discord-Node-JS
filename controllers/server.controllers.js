import { findTheServerWithServerId, findTheServerWithServerName, getServerInfoFromMongodb, getServerSidebarInfo } from "../helpers/server.helpers.js";
import { findTheUserWithEmail } from "../helpers/user.helpers.js";
import Channel from "../models/channel.models.js";
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

        const isUserExist = await findTheUserWithEmail(userEmail)

        if (!isUserExist.length) {
            return res.status(400).json({ message: "User not found" });
        }

        const isServerCreated = await Server.create({
            name,
            imageUrl: imageUrl || ""
        })

        if (!isServerCreated._id) {
            return res.status(400).json({
                message: "Server not created"
            })
        }

        const isJoinedToServer = await ServerMember.create({
            user: isUserExist[0]._id,
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

        const isJoinedToServer = await ServerMember.create({
            user: userId,
            server: serverId
        })

        if (!isJoinedToServer?._id) {
            return res.status(400).json({
                message: "User already joined to the server"
            })
        }

        return res.status(201).json({
            message: "Successfully joined to the server",
            data: isJoinedToServer
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function checkIsTheUserAlreadyJoined(req, res) {
    try {
        const { userEmail, inviteCode } = req.body
        const { serverId } = req.params
        if (!userEmail || !serverId || !inviteCode) {
            return res.status(400).json({
                message: "Please provide user id, invite code and server id"
            })
        }

        const isServerExist = await Server.findOne({
            _id: serverId,
            inviteCode: inviteCode
        }, { inviteCode: 1 })

        if (!isServerExist) {
            return res.status(400).json({
                message: "Server does not exist or invite code is not valid"
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

        const isAlreadyJoined = await ServerMember.findOne({
            user: isUserExist._id,
            server: serverId
        }, { _id: 1 })

        if (isAlreadyJoined?._id) {
            return res.status(400).json({
                message: "User already joined to the server"
            })
        }

        return res.status(201).json({
            message: "You have already joined to the server",
            succes: true,
            data: {
                userId : isUserExist._id
            }
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
            message: "Invite code updated successfully",
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
        const { userId, serverId } = req.body
        if (!userId || !serverId) {
            return res.status(400).json({
                message: "Please provide user id and server id"
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
        return res.status(201).json({
            message: "Leaved from the server successfully",
            data: response
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
                message: "Please provide a server name"
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

export async function updateServerImage(req, res) {
    try {
        const { imageUrl, name } = req.body
        const { serverName } = req.params
        if (name) {
            return res.status(200).json({
                message: "Server name cannot be changed"
            })
        }
        if (!serverName) {
            return res.status(400).json({
                message: "Please provide a server name"
            })
        }
        if (!imageUrl) {
            return res.status(400).json({
                message: "Please provide an image url"
            })
        }
        const response = await Server.updateOne({ name: serverName }, { $set: { imageUrl: imageUrl } })

        if (!response.modifiedCount) {
            return res.status(400).json({
                message: "Error in updating image"
            })
        }

        return res.status(200).json({
            message: "Image updated successfully",
            data: response
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function deleteServer(req, res) {
    try {
        const { serverName } = req.params
        if (!serverName) {
            return res.status(400).json({
                message: "Please provide a server name"
            })
        }

        const response = await Server.deleteOne({ name: serverName })

        if (!response.deletedCount) {
            return res.status(400).json({
                message: "Error occurred while deleting"
            })
        }

        return res.status(200).json({
            success: true,
            data: response
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}