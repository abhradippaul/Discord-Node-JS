import express from 'express';
import { createServer, deleteServer, getServer, isServerExist, joinToTheServer, updateServerImage } from '../controllers/server.controllers.js';

const router = express.Router()

router.route("/:serverName")
    .get(getServer)
    .patch(updateServerImage)
    .delete(deleteServer)

router.route("/:serverName/isExist")
    .get(isServerExist)

router.route("/:userEmail/server")
    .post(createServer)

router.route("/join-server/:serverId")
    .post(joinToTheServer)

export default router;