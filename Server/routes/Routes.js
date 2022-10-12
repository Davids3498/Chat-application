import { Router } from 'express';
import { registerNewUser, login, getContacts, setAvatar } from '../controllers/UserController.js'

const userRoute = Router();

userRoute.post('/register', registerNewUser);
userRoute.post('/login', login);
userRoute.get('/contacts/:id', getContacts);
userRoute.post("/setAvatar/:id", setAvatar);
export default userRoute;