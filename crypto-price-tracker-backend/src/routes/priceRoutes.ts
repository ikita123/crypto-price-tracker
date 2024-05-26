import { Router } from 'express';
import { getPriceChange } from '../controllers/priceController';

const router = Router();

router.get('/v1/price-change', getPriceChange);

export default router;
