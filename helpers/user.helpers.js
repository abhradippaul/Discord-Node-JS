import { Schema } from "mongoose"
import User from "../models/user.models.js"

export async function findTheUserWithEmail(userEmail) {
    return await User.aggregate([
        {
            $match: {
                email: userEmail
            }
        },
        {
            $project: {
                _id: 1
            }
        }
    ])
}

export async function getUserInfoForSideNavbar(userEmail) {
    return await User.aggregate([
        {
            $match: {
                email: userEmail
            }
        },
        {
            $lookup: {
                from: "server_members",
                localField: "_id",
                foreignField: "user",
                as: "Server",
                pipeline: [
                    {
                        $lookup: {
                            from: "servers",
                            localField: "server",
                            foreignField: "_id",
                            as: "ServerInfo",
                        }
                    },
                    {
                        $addFields: {
                            ServerInfo: {
                                $first: "$ServerInfo"
                            }
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                imageUrl: 1,
                "Server.role": 1,
                "Server.ServerInfo.name": 1,
                "Server.ServerInfo.name": 1,
                "Server.ServerInfo.imageUrl": 1,
                "Server.ServerInfo._id": 1,
            }
        }
    ])
}