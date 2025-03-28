import express from 'express';
import bodyParser from 'body-parser';
import getInfluencers from './routes/GetInfluencers';
import postInfluencer from './routes/PostInfluencer';
import putInfluencer from './routes/PutInfluencer';
import getInfluencer from './routes/GetInfluencer';
import deleteInfluencer from './routes/DeleteInfluencer';

const app = express();
const PORT = process.env.PORT || 5123;

app.use(bodyParser.json());

app.use('/api/influencers', getInfluencers);
app.use('/api/influencers', postInfluencer);
app.use('/api/influencers', putInfluencer);
app.use('/api/influencers', getInfluencer);
app.use('/api/influencers', deleteInfluencer);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
