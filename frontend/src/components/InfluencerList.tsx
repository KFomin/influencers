import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInfluencersList, deleteInfluencer } from '../resource/backend';

const InfluencerList: React.FC = () => {
    const [influencers, setInfluencers] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfluencers = async () => {
            const data = await getInfluencersList();
            setInfluencers(data);
        };
        fetchInfluencers();
    }, []);

    const handleDelete = async (nickname: string) => {
        await deleteInfluencer(nickname);
        setInfluencers(prev => prev.filter(influencer => influencer.nickname !== nickname));
    };

    return (
        <div>
            <h2>Список инфлюенсеров:</h2>
            <button onClick={() => navigate('/influencer')}>Создать нового инфлюенсера</button>
            {influencers.map(influencer => (
                <div key={influencer.nickname}>
                    <p>
                        {influencer.nickname} - {influencer.firstName} {influencer.lastName}
                        <button onClick={() => navigate(`/influencer/${encodeURIComponent(influencer.nickname)}`)}>Редактировать</button>
                        <button onClick={() => handleDelete(influencer.nickname)}>Удалить</button>
                    </p>
                </div>
            ))}
        </div>
    );
};

export default InfluencerList;
