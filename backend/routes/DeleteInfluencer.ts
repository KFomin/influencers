import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Influencer } from '../service/Influencer';

const router = express.Router();
const dataFilePath = path.join(__dirname, '../influencers.json');

router.delete('/:nickname', (req: Request, res: Response) => {
    const {nickname} = req.params;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({message: 'Error reading influencers'});

        let influencers: Influencer[] = JSON.parse(data);
        influencers = influencers.filter(
            (influencer) => influencer.nickname !== nickname
        );

        fs.writeFile(dataFilePath, JSON.stringify(influencers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({message: 'Error writing influencers'});
            }
            res.status(204).send();
        });
    });
});

export default router;
