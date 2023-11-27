import express from 'express';

import {
    getAllPlayers, getPlayerDetail, createPlayer, 
    updatePlayer, deletePlayer,
} from '../controllers/player.controller.js';

const router = express.Router();

router.route('/').get(getAllPlayers);
router.route('/:id').get(getPlayerDetail);
router.route('/').post(createPlayer);
router.route('/:id').patch(updatePlayer);
router.route('/:id').delete(deletePlayer);


export default router;