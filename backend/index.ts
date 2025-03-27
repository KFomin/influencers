import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import {Influencer} from './models/Influencer';

const app = express();
const PORT = process.env.PORT || 5123;

app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'influencers.json');

app.get('/api/influencers', (req, res) => {
    const {search = ''} = req.query;
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({message: 'Error reading influencers'});
        }

        const influencers: Influencer[] = JSON.parse(data);

        // Применяем фильтрацию по всем полям: nickname, firstName, lastName
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

    const duplicateIndices = {
        instagram: [] as number[],
        tiktok: [] as number[],
    };

    newInfluencer.socialMedia?.instagram?.forEach((username, index) => {
        if (newInfluencer.socialMedia?.instagram?.indexOf(username) !== index) {
            duplicateIndices.instagram.push(index);
        }
    });

    newInfluencer.socialMedia?.tiktok?.forEach((username, index) => {
        if (newInfluencer.socialMedia?.tiktok?.indexOf(username) !== index) {
            duplicateIndices.tiktok.push(index);
        }
    });

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        const hasDuplicates = duplicateIndices.instagram.length > 0 || duplicateIndices.tiktok.length > 0;

        if (hasDuplicates) {
            return res.status(400).json({
                message: 'Duplicate social media accounts found',
                duplicates: duplicateIndices,
            });
        }

        if (err) {
            return res.status(500).json({message: 'Error reading influencers'});
        }

        const influencers: Influencer[] = JSON.parse(data);


        // Check if the nickname is unique
        if (influencers.some((influencer) => influencer.nickname === newInfluencer.nickname)) {
            return res.status(400).json({message: 'Nickname must be unique'});
        }

        // Add the new influencer to the existing list
        influencers.push(newInfluencer);

        // Save the updated list back to the JSON file
        fs.writeFile(dataFilePath, JSON.stringify(influencers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({message: 'Error adding influencer'});
            }
            // Return the newly added influencer with a 201 status
            res.status(201).json(newInfluencer);
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

        // Validate for duplicate social media
        const duplicateIndices = {
            instagram: [] as number[],
            tiktok: [] as number[],
        };

        updatedInfluencer.socialMedia?.instagram?.forEach((username, index) => {
            if (updatedInfluencer.socialMedia?.instagram?.indexOf(username) !== index) {
                duplicateIndices.instagram.push(index);
            }
        });

        updatedInfluencer.socialMedia?.tiktok?.forEach((username, index) => {
            if (updatedInfluencer.socialMedia?.tiktok?.indexOf(username) !== index) {
                duplicateIndices.tiktok.push(index);
            }
        });

        const hasDuplicates = duplicateIndices.instagram.length > 0 || duplicateIndices.tiktok.length > 0;

        if (hasDuplicates) {
            return res.status(400).json({
                message: 'Duplicate social media accounts found',
                duplicates: duplicateIndices,
            });
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
