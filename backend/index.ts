import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import {Influencer} from './models/Influencer';

const app = express();
const PORT = process.env.PORT || 5123;

app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'influencers.json');
const validateInfluencer = (influencer: Influencer) => {

    const blanks = {
        instagram: [] as number[],
        tiktok: [] as number[],
    }

    const duplicates = {
        instagram: [] as number[],
        tiktok: [] as number[],
    };

    if (influencer.socialMedia.instagram) {
        const instagram = influencer.socialMedia.instagram;
        instagram.forEach((username, index) => {
            if (username.trim().length === 0) {
                blanks.instagram.push(index);
            }
            if (instagram.indexOf(username) !== index) {
                duplicates.instagram.push(index);
            }
        });
    }

    if (influencer.socialMedia.tiktok) {
        const tiktok = influencer.socialMedia.tiktok;
        tiktok.forEach((username, index) => {
            if (username.trim().length === 0) {
                blanks.tiktok.push(index);
            }
            if (tiktok.indexOf(username) !== index) {
                duplicates.tiktok.push(index);
            }
        });
    }

    const hasBlanks = blanks.instagram.length > 0 || blanks.tiktok.length > 0;

    if (hasBlanks) {
        return {
            valid: false,
            error: {
                message: 'Blank social media accounts found',
                indexes: blanks,
            },
        };
    }

    const hasDuplicates = duplicates.instagram.length > 0 || duplicates.tiktok.length > 0;

    if (hasDuplicates) {
        return {
            valid: false,
            error: {
                message: 'Duplicate social media accounts found',
                indexes: duplicates,
            },
        };
    }

    if (influencer.nickname.length > 50 || influencer.firstName.length > 50 || influencer.lastName.length > 50) {
        return {
            valid: false,
            error: {
                message: 'Nickname, first name, and last name must not exceed 50 characters',
            },
        };
    }

    if (influencer.nickname.trim().length === 0 || influencer.firstName.trim().length === 0 || influencer.lastName.trim().length === 0) {
        return {
            valid: false,
            error: {
                message: 'Nickname, first name, and last name must not be empty',
            },
        };
    }

    return {valid: true};
};

app.get('/api/influencers', (req, res) => {
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

app.post('/api/influencers', (req, res) => {
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

app.put('/api/influencers/:nickname', (req, res) => {
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

app.get('/api/influencers/:nickname', (req, res) => {
    const {nickname} = req.params;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({message: 'Error reading influencers'});
        }

        const influencers: Influencer[] = JSON.parse(data);
        const influencer = influencers.find(i => i.nickname === nickname);

        if (!influencer) {
            return res.status(404).json({message: 'Influencer not found'});
        }

        res.json(influencer);
    });
});

app.delete('/api/influencers/:nickname', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
