import { Router } from 'express';
import { predict, model } from '../utils/ml-model';

const router = Router();

router.get('/model/info', (req, res) => res.json(model.getInternals()));

router.post('/predict', async (req, res) => res.json(await predict(req.body)));

router.get('/model/export', (req, res) => res.json(model.dump()));

export default router;


