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
    const { search = '' } = req.query;
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading influencers' });
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

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({message: 'Error reading influencers'});
        }

        const influencers: Influencer[] = JSON.parse(data);

        if (influencers.some((influencer) => influencer.nickname === newInfluencer.nickname)) {
            return res.status(400).json({message: 'Nickname must be unique'});
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

app.get('/api/influencers/:nickname', (req, res) => {
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

app.put('/api/influencers/:nickname', (req, res) => {
    const {nickname} = req.params;
    const updatedInfluencer: Partial<Influencer> = req.body;

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({message: 'Ошибка при чтении файла'});
        }

        let influencers: Influencer[] = JSON.parse(data);

        const index = influencers.findIndex((influencer) => influencer.nickname === nickname);

        if (index === -1) {
            return res.status(404).json({message: 'Инфлюенсер не найден'});
        }

        influencers[index] = {...influencers[index], ...updatedInfluencer};

        fs.writeFile(dataFilePath, JSON.stringify(influencers, null, 2), (err) => {
            if (err) {
                return res.status(500).json({message: 'Ошибка при записи файла'});
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
