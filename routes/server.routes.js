import express from 'express';
import { checkIsTheUserAlreadyJoined, createServer, createServerInviteCode, deleteServer, getServer, getServerInviteCode, isServerExist, joinToTheServer, serverSidebarInfo, updateServerImage } from '../controllers/server.controllers.js';

const router = express.Router()

router.route("/:serverId")
    .get(getServer)
    .patch(updateServerImage)
    .delete(deleteServer)

router.route("/sidebar/:serverId")
    .get(serverSidebarInfo)

router.route("/:serverName/isExist")
    .get(isServerExist)

router.route("/:userEmail/create")
    .post(createServer)

router.route("/invite/:serverId")
    .get(getServerInviteCode)
    .post(checkIsTheUserAlreadyJoined)
    .put(createServerInviteCode)

router.route("/invite")
    .post(joinToTheServer)


export default router;