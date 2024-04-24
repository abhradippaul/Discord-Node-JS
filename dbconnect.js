import mongoose from "mongoose";

export function connectToTheDatabase(PORT) {
    try {
        return mongoose.connect(PORT)
    } catch (err) {
        return err
    }
}