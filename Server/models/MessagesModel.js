import mongoose from 'mongoose';
const schema = mongoose.Schema;

// new msg schema
const messageSchema = new schema({
    messasge: {
        text: {
            type: String,
            required: true
        }
    },
    users: Array,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
    {
        timestamps: true,
    }
);
export const mongooseMessage = mongoose.model('messages', messageSchema);