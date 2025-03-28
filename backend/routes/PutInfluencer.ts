import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Influencer, validateInfluencer } from '../service/Influencer';

const router = express.Router();
const dataFilePath = path.join(__dirname, '../influencers.json');

router.put('/:nickname', (req: Request, res: Response) => {
    const {nickname} = req.params;
    const updatedInfluencer: Partial<Influencer> = req.body;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({message: 'Error reading file'});
        }

        let influencers: Influencer[] = JSON.parse(data);
        const index = influencers.findIndex(influencer => influencer.nickname === nickname);

        if (index === -1) {
            return res.status(404).json({message: 'Influencer not found'});
        }

        const validation = validateInfluencer({...influencers[index], ...updatedInfluencer});
        if (!validation.valid) {
            return res.status(400).json(validation.error);
        }

        influencers[index] = {...influencers[index], ...updatedInfluencer};

        fs.writeFile(dataFilePath, JSON.stringify(influencers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({message: 'Error writing to file'});
            }
            res.json(influencers[index]);
        });
    });
});

export default router;
