import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Influencer } from '../service/Influencer';

const router = express.Router();
const dataFilePath = path.join(__dirname, '../influencers.json');

router.get('/:nickname', (req: Request, res: Response) => {
    const { nickname } = req.params;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading influencers' });
        }

        const influencers: Influencer[] = JSON.parse(data);
        const influencer = influencers.find(i => i.nickname === nickname);

        if (!influencer) {
            return res.status(404).json({ message: 'Influencer not found' });
        }

        res.json(influencer);
    });
});

export default router;
