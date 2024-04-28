import { findTheServerWithServerId, findTheServerWithServerName, getServerInfoFromMongodb } from "../helpers/server.helpers.js";
import { findTheUserWithEmail } from "../helpers/user.helpers.js";
import Server from "../models/server.models.js";
import ServerMember from "../models/server_member.models.js";

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

        return res.status(201).json({
            message: "Server created successfully",
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
        const { userEmail } = req.body
        const { serverId } = req.params

        if (!userEmail || !serverId) {
            return res.status(400).json({
                message: "Please provide user email and server id"
            })
        }

        const isUserExist = await findTheUserWithEmail(userEmail)

        if (!isUserExist.length) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const isServerExist = await findTheServerWithServerId(serverId)


        if (!isServerExist.length) {
            return res.status(400).json({
                message: "Server not found"
            })
        }

        const isJoinedToServer = await ServerMember.findOne({
            user: isUserExist[0]._id,
            server: serverId,
        })

        if (isJoinedToServer?._id) {
            return res.status(400).json({
                message: "User already joined to the server"
            })
        }

        const response = await ServerMember.create({
            user: isUserExist[0]._id,
            server: serverId
        })
        if (!response._id) {
            return res.status(400).json({
                message: "Failed to join to the server"
            })
        }
        return res.status(201).json({
            message: "Server created successfully",
            data: response
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
        const { serverName } = req.params

        if (!serverName) {
            return res.status(400).json({
                message: "Please provide a server name"
            })
        }

        const response = await getServerInfoFromMongodb(serverName)

        if (!response.length) {
            return res.status(400).json({
                message: "Server not found"
            })
        }

        return res.status(200).json({
            message: "Server found",
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