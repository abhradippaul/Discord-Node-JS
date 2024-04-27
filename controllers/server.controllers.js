import Server from "../models/server.models.js";

export async function createServer(req, res) {
    try {
        const { serverName, imageUrl } = req.body

        if (!serverName) {
            return res.status(400).json({ message: "Give server name" });
        }

        const isServerExist = await Server.findOne({ name: serverName })

        if (isServerExist?._id) {
            return res.status(400).json({ message: "Server already exist" });
        }

        const response = await Server.create({
            name: serverName,
            imageUrl: imageUrl || ""
        })

        if (!response._id) {
            return res.status(400).json({
                message: "Server not created"
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

export async function getServer(req, res) {
    try {
        const { serverName } = req.params
        if (!serverName) {
            return res.status(400).json({
                message: "Please provide a server name"
            })
        }
        const response = await Server.aggregate([
            {
                $match: {
                    name: serverName
                }
            }
        ])
        if (!response.length) {
            return res.status(400).json({
                message: "Server not found"
            })
        }
        return res.status(200).json({
            message: "Server found",
            data: response
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