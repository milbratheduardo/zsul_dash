import express from 'express';

import {
    createUser, getAllUsers, getUserInfoByID
} from '../controllers/user.controller.js';

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/:id').get(getUserInfoByID);
router.route('/').post(createUser);


export default router;