import { Router } from 'express';
import * as UserController from '../../services/user/controller';

const router = Router();

router.post('/', UserController.createUser);

export default router;