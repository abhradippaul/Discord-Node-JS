import { createUser, deleteUser, getUser } from '../controllers/user.controllers.js';

import express from 'express';
const router = express.Router()

router.route("/:userEmail").get(getUser).delete(deleteUser)

router.route("/").post(createUser)

export default router;