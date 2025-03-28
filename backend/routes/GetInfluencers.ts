import express, {Request, Response} from 'express';
import fs from 'fs';
import path from 'path';
import {Influencer} from '../service/Influencer';

const router = express.Router();
const dataFilePath = path.join(__dirname, '../influencers.json');

router.get('/', (req: Request, res: Response) => {
    const {search = ''} = req.query;
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({message: 'Error reading influencers'});
        }

        const influencers: Influencer[] = JSON.parse(data);
        const filteredInfluencers = influencers.filter(influencer =>
            influencer.nickname.toLowerCase().includes(search.toString().toLowerCase()) ||
            influencer.firstName.toLowerCase().includes(search.toString().toLowerCase()) ||
            influencer.lastName.toLowerCase().includes(search.toString().toLowerCase())
        );

        res.json(filteredInfluencers);
    });
});

export default router;
