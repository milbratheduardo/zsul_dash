import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
    nome: { type: String, required: true},
    nascimento: {type: String, required: true},
    documento: { type: String, required: true},
    rgfrente: { type: String, required: true},
    rgverso: { type: String, required: true},
    escola: { type: String, required: true},
    categoria: { type: String, required: true},
    foto: { type: String, required: true},
    numInscricao: { type: Number},
    equipe: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});

const playerModel = mongoose.model('Player', PlayerSchema);

export default playerModel;