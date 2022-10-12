import { mongooseUser } from '../models/UserModel.js';
import bcrypt from 'bcrypt';

export async function registerNewUser(req, res, next) {
    // console.log(req.body);
    try {
        const { username, email, password } = req.body;
        const checkUsernameExist = await mongooseUser.findOne({ username });
        if (checkUsernameExist) {
            return res.json({
                message: 'Username already in us.',
            }).status(409);// conflict status
        }
        const checkEmailExist = await mongooseUser.findOne({ email });
        if (checkEmailExist) {
            return res.json({
                message: 'Email already in us.',
            }).status(409);// conflict status
        }
        const hashPassword = await bcrypt.hash(password, 10);

        const user = await mongooseUser.create({
            email,
            username,
            password: hashPassword,
        });
        // console.log(result);
        delete user.password;
        // console.log(result);
        return res.json({
            status: true,
            message: 'A new user has been made!',
            user
        }).status(201);
    }
    catch (err) {
        console.log(err);
        res.json({
            message: 'Error in making new user.',
        }).status(422);
    };
}

export async function login(req, res, next) {
    // console.log(req.body);
    try {
        const { username, password } = req.body;

        const loginUser = await mongooseUser.findOne({ username });
        if (!loginUser) {
            return res.json({
                message: 'Username does\'t exist.',
            }).status(409);// conflict status
        }

        const isCorrectPassword = await bcrypt.compare(password, loginUser.password);
        if (!isCorrectPassword) {
            return res.json({
                message: 'Incorrect password.',
            }).status(401);// wrong password
        }

        // console.log(result);
        delete loginUser.password;

        return res.json({
            status: true,
            message: 'Successfully logged in!',
            loginUser
        }).status(201);
    }
    catch (err) {
        console.log(err);
        res.json({
            message: 'Error in connecting.',
        }).status(422);
    };
}
export async function setAvatar(req, res, next) {
    try {
        const userId = req.params.id;
        const Image = req.body.image;
        const userData = await mongooseUser.findByIdAndUpdate(
            userId,
            {
                isAvatarImageSet: true,
                avatarImage: Image,
            },
            { new: true }
        );
        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch (ex) {
        next(ex);
    }
};

export async function getContacts(req, res, next) {
    try {
        const users = await mongooseUser.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);
        return res.json(users);
    } catch (ex) {
        next(ex);
    }
};