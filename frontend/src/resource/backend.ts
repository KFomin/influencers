import axios from 'axios';

const API_URL = '/api/influencers';

export const getInfluencersList = async (searchQuery = '') => {
    try {
        const response = await axios.get(API_URL, {
            params: {search: searchQuery}
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching influencers list', error);
        return [];
    }
};


export const getInfluencer = async (nickname: string) => {
    const response = await axios.get(`${API_URL}/${nickname}`);
    return response.data;
};

export const createInfluencer = async (newInfluencer: any) => {
    const response = await axios.post(API_URL, newInfluencer);
    return response.data;
};

export const updateInfluencer = async (nickname: string, updatedInfluencer: any) => {
    const response = await axios.put(`${API_URL}/${nickname}`, updatedInfluencer);
    return response.data;
};

export const deleteInfluencer = async (nickname: string) => {
    await axios.delete(`${API_URL}/${nickname}`);
};
