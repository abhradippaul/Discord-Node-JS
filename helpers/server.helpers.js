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

export async function getServerInfoFromMongodb(serverId) {
    return await Server.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(serverId)
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
        // {
        //     $lookup: {
        //         from: "channels",
        //         localField: "channel",
        //         foreignField: "_id",
        //         as: "Channel",
        //         pipeline: [
        //             {
        //                 $lookup: {
        //                     from: "users",
        //                     localField: "user",
        //                     foreignField: "_id",
        //                     as: "Users"
        //                 }
        //             },
        //             {
        //                 $addFields: {
        //                     UserInfo: {
        //                         $first: "$Users"
        //                     }
        //                 }
        //             }
        //         ]
        //     }
        // },
        {
            $project: {
                name: 1,
                imageUrl: 1,
                "Server_Members.role": 1,
                "Server_Members.UserInfo.email": 1,
                "Server_Members.UserInfo.name": 1,
                "Server_Members.UserInfo.imageUrl": 1,
                "Server_Members.UserInfo._id": 1,
                // "Channel.channel": 1,
                // "Channel.UserInfo.email": 1,
                // "Channel.UserInfo.name": 1,
                // "Channel.UserInfo.imageUrl": 1,
                // "Channel.UserInfo._id": 1,
            }
        }
    ])
}

export async function getServerSidebarInfo(serverId) {
    return await Server.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(serverId)
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
            $lookup: {
                from: "channels",
                localField: "channel",
                foreignField: "_id",
                as: "Channel",
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
                "Channel.channel": 1,
                "Channel.UserInfo.email": 1,
                "Channel.UserInfo.name": 1,
                "Channel.UserInfo.imageUrl": 1,
                "Channel.UserInfo._id": 1,
            }
        }
    ])
}

export async function getServerInfoFromMongodbForServerInvitation(serverId, inviteCode, userId) {
    return await Server.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(serverId),
                inviteCode: inviteCode,
            }
        },
        {
            $lookup: {
                from: "server_members",
                localField: "_id",
                foreignField: "server",
                as: "Server_Members",
            }
        },
        {
            $addFields: {
                "isJoined": {
                    $cond: {
                        if: {
                            $in: [new mongoose.Types.ObjectId(userId), "$Server_Members.user"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $addFields: {
                "Member_Count": {
                    $size: "$Server_Members"
                }
            }
        },
        {
            $project: {
                _id: 0,
                name: 1,
                imageUrl: 1,
                "Member_Count": 1,
                "isJoined": 1
            }
        }
    ])
}