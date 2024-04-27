import User from "../models/user.models.js";

export async function getUserInfo(req, res) {
    try {
        const { userEmail } = req.params
        if (!userEmail) {
            return res.status(400).json({ message: "Please provide a user email" });
        }

        const response = await User.aggregate([
            {
                $match: {
                    email: userEmail
                }
            },
            {
                $lookup : {
                    from: "server_members",
                    localField: "_id",
                    foreignField: "user",
                    as: "server"
                }
            },
            {
                $project : {
                    _id: 0,
                    name: 1,
                    email: 1,
                    imageUrl: 1,
                    server: 1
                }
            }
        ])

        if (!response.length) {
            return res.status(400).json({ message: "User does not exist" });
        }

        return res.status(200).json({
            success: true,
            data: response[0],
            message: "User found successfully"
        })
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export async function createUser(req, res) {
    try {
        const { name, email, imageUrl } = req.body
        if (!name || !email) {
            return res.status(400).json({ message: "Please provide a name and email" });
        }

        const isUserExist = await User.findOne({ email: email })

        if (isUserExist?._id) {
            return res.status(400).json({ message: "User already exist" });
        }

        const response = await User.create({
            name,
            email,
            imageUrl : imageUrl || ""
        })

        if (!response._id) {
            return res.status(400).json({
                message: "Problem in user creation"
            })
        }

        return res.status(201).json({
            success: true,
            data: response,
            message: "User created successfully"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function deleteUser(req, res) {
    try {
        const { userEmail } = req.params
        if (!userEmail) {
            return res.status(400).json({
                message: "Please provide a user email"
            })
        }
        const isDeleted = await User.deleteOne({ email: userEmail })

        if(!isDeleted.deletedCount) {
            return res.status(400).json({
                message: "Error occurred while deleting"
            })
        }

        return res.status(200).json({
            success: true,
            data: isDeleted,
            message: "User deleted successfully"
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}
