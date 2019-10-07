import { Router } from 'express';
import * as AuthController from '../services/auth/controller';

const router = Router();

router.post('/', AuthController.createAuthToken);

export default router;