import { createUser, deleteUser, getUserInfo } from '../controllers/user.controllers.js';

import express from 'express';
const router = express.Router()

router.route("/:userEmail")
.get(getUserInfo)
.delete(deleteUser)

router.route("/")
.post(createUser)

// router.route("/server").post()

export default router;