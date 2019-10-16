import { Router } from 'express';
import auth from '../../middleware/auth';
import * as UserController from '../../services/user/controller';

const router = Router();

router.get('/', auth, UserController.getUser);
router.post('/', UserController.createUser);

export default router;