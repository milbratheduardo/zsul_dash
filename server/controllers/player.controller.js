import Player from '../mongodb/models/player.js';
import User from '../mongodb/models/user.js';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllPlayers = async (req, res) => {};
const getPlayerDetail = async (req, res) => {};
const createPlayer = async (req, res) => {
   try { 
        const { nome, nascimento, documento, rgfrente, rgverso, 
            escola, categoria, foto } = req.body;
        
        const session = await mongoose.startSession();
        session.startTransaction();
        
        const rgfrenteUrl = await cloudinary.uploader.upload(rgfrente);
        const rgversoUrl = await cloudinary.uploader.upload(rgverso);
        const fotoUrl = await cloudinary.uploader.upload(foto);

        const user = await User.findOne({ email }).session(session);

        if(!user) throw new Error('User not found');

        const newPlayer = await Player.create({
            nome,
            nascimento,
            documento,
            rgfrente: rgfrenteUrl.url,
            rgverso: rgversoUrl.url,
            escola,
            categoria,
            foto: fotoUrl.url,
            equipe: 1
        });

        user.allPlayers.push(newPlayer._id);
        await user.save({ session });

        await session.commitTransaction();
        res.status(200).json({ message: 'Jogador Adicionado com Sucesso' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updatePlayer = async (req, res) => {};
const deletePlayer = async (req, res) => {};

export {
    getAllPlayers,
    getPlayerDetail,
    createPlayer,
    updatePlayer,
    deletePlayer,
}

