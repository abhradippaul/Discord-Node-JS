import express from 'express';
import { createServer, getServer, updateServerImage } from '../controllers/server.controllers.js';

const router = express.Router()

router.route("/:serverName")
    .get(getServer)
    .post(createServer)
    .patch(updateServerImage)

export default router;