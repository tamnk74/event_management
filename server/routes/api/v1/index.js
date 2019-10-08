import {Router} from 'express';
import EventRouter from './EventRouter';
import AuthRouter from './AuthRouter';
import UserRouter from './UserRouter';
import CommonRouter from './CommonRouter';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/events', EventRouter);
router.use('/common', CommonRouter);

export default router;