import mongoose from 'mongoose';
const schema = mongoose.Schema;

// new user schema
const userSchema = new schema({
    username: {
        type: String,
        required: true,
        min: 5,
        max: 15,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false
    },
    avatarImage: {
        type: String,
        default: ""
    }
}
);
export const mongooseUser = mongoose.model('users', userSchema);