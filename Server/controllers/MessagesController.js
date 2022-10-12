import { mongooseMessage } from '../models/MessagesModel.js';

export async function addMessage(req, res, next) {
    try {
        const { from, to, message } = req.body;
        const data = await mongooseMessage.create({
            messasge: { text: message },
            users: [from, to],
            sender: from
        });
        if (data)
            return res.json({ msg: 'Added message successfully.' })
        return res.json({ msg: 'Failed to add message.' })

    } catch (error) {
        next(error);
    }
}


export async function getAllMessages(req, res, next) {
    try {
        const { from, to } = req.body;
        const messages = await mongooseMessage.find({
            users: { $all: [from, to] }
        }).sort({ "timestamp": -1 });
        // updatedAt:1
        const pm = messages.map((msg) => {
            return {
                fromSelf: msg.sender.toString() == from,
                message: msg.messasge.text
            }
        })
        return res.json(pm);
    } catch (error) {
        next(error);
    }
}