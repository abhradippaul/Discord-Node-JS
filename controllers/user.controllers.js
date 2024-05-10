import { getUserInfoFromMongodb } from "../helpers/user.helpers.js";
import User from "../models/user.models.js";

export async function isTheUserExist (req,res) {
    try {
        const {userEmail} = req.params
        if (!userEmail) {
            return res.status(400).json({
                message: "Please provide a user email"
            })
        }
        const isUserExist = await User.findOne({ email: userEmail },{_id : 1})
        if(!isUserExist) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }
        return res.status(200).json({
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export async function getUserInfo(req, res) {
    try {
        const { userEmail } = req.params

        if (!userEmail) {
            return res.status(400).json({ message: "Please provide a user email" });
        }

        const response = await getUserInfoFromMongodb(userEmail)

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
            imageUrl: imageUrl || ""
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

export async function updateUserImage(req, res) {
    try {
        const { imageUrl, name } = req.body
        const { userName } = req.params
        if (name) {
            return res.status(200).json({
                message: "User name cannot be changed"
            })
        }
        if (!userName) {
            return res.status(400).json({
                message: "Please provide a server name"
            })
        }
        if (!imageUrl) {
            return res.status(400).json({
                message: "Please provide an image url"
            })
        }
        const response = await Server.updateOne({ name: userName }, { $set: { imageUrl: imageUrl } })

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

export async function deleteUser(req, res) {
    try {
        const { userEmail } = req.params
        if (!userEmail) {
            return res.status(400).json({
                message: "Please provide a user email"
            })
        }
        const isDeleted = await User.deleteOne({ email: userEmail })

        if (!isDeleted.deletedCount) {
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
