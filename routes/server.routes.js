import express from 'express';
import { checkIsTheUserAlreadyJoined, createServer, createServerInviteCode, deleteServer, getServer, getServerInviteCode, isServerExist, joinToTheServer, leaveTheServer, serverSidebarInfo, updateServerInfo, updateUserPermission } from '../controllers/server.controllers.js';
import { createChannel } from '../controllers/channel.controllers.js';

const router = express.Router()

router.route("/:serverId")
    .get(getServer)
    .patch(updateServerInfo)
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
    .patch(createServerInviteCode)

router.route("/invite")
    .post(joinToTheServer)

router.route("/user-permission/:serverId")
    .patch(updateUserPermission)

router.route("/leave/:serverId")
    .delete(leaveTheServer)

// Channel routes from here

router.route("/:serverId/channel")
    .post(createChannel)


export default router;