import { Router } from 'express';
import { addMessage, getAllMessages} from '../controllers/MessagesController.js'

const msgRoute = Router();

msgRoute.post('/addmsg', addMessage);
msgRoute.post('/getmsgs', getAllMessages);

export default msgRoute;