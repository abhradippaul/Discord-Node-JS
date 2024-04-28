import mongoose from "mongoose";
import Server from "../models/server.models.js";

export async function findTheServerWithServerId(serverId) {
    return await Server.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(serverId)
            }
        },
        {
            $project: {
                _id: 1
            }
        }
    ])
}

export async function findTheServerWithServerName(serverName) {
    return await Server.aggregate([
        {
            $match: {
                name: serverName
            }
        },
        {
            $project: {
                _id: 1
            }
        }
    ])
}

export async function getServerInfoFromMongodb(serverName) {
    return await Server.aggregate([
        {
            $match: {
                name: serverName
            }
        },
        {
            $lookup: {
                from: "server_members",
                localField: "_id",
                foreignField: "server",
                as: "Server_Members",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "Users"
                        }
                    },
                    {
                        $addFields: {
                            UserInfo: {
                                $first: "$Users"
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                name: 1,
                imageUrl: 1,
                "Server_Members.role": 1,
                "Server_Members.UserInfo.email": 1,
                "Server_Members.UserInfo.name": 1,
                "Server_Members.UserInfo.imageUrl": 1,
                "Server_Members.UserInfo._id": 1,
            }
        }
    ])
}