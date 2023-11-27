import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nome: { type: String, required: true},
    email: {type: String, required: true},
    password: { type: String, required: true},
    avatar: { type: String, required: true},
    cidade: { type: String, required: true},
    estado: { type: String, required: true},
    allPlayers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Jogador'}],
});

const userModel = mongoose.model('User', UserSchema);

export default userModel;