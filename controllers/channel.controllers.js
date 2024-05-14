import Channel from "../models/channel.models.js"


export async function createChannel(req, res) {
    try {
        const { serverId } = req.params
        const data = req.body
        if (!serverId) {
            return res.status(400).json({
                message: "Please provide server id"
            })
        }
        
        if (!data?.name) {
            return res.status(400).json({
                message: "Please provide channel name"
            })
        }
        const response = await Channel.create({
            ...data,
            server: serverId
        })
        if (!response._id) {
            return res.status(400).json({
                message: "Error in creating channel"
            })
        }
        return res.status(201).json({
            message: "Channel created successfully",
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}