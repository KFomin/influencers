import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Influencer, validateInfluencer } from '../service/Influencer';

const router = express.Router();
const dataFilePath = path.join(__dirname, '../influencers.json');

router.post('/', (req: Request, res: Response) => {
    const newInfluencer: Influencer = req.body;
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({message: 'Error reading influencers'});
        }

        const influencers: Influencer[] = JSON.parse(data);

        if (influencers.some((influencer) => influencer.nickname === newInfluencer.nickname)) {
            return res.status(400).json({message: 'Nickname must be unique'});
        }

        const validation = validateInfluencer(newInfluencer);
        if (!validation.valid) {
            return res.status(400).json(validation.error);
        }

        influencers.push(newInfluencer);

        fs.writeFile(dataFilePath, JSON.stringify(influencers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({message: 'Error adding influencer'});
            }
            res.status(201).json(newInfluencer);
        });
    });
});

export default router;
