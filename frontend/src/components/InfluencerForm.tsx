import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {createInfluencer, updateInfluencer, getInfluencer} from '../resource/backend';

const InfluencerForm: React.FC = () => {
    const [influencerNickname, setInfluencerNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [socialMedia, setSocialMedia] = useState({instagram: [], tiktok: []});

    const {nickname} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(nickname);
        const fetchInfluencer = async () => {
            if (nickname) {
                const influencer = await getInfluencer(nickname);
                if (influencer) {
                    setInfluencerNickname(influencer.nickname);
                    setFirstName(influencer.firstName);
                    setLastName(influencer.lastName);
                    setSocialMedia(influencer.socialMedia);
                }
            }
        };
        fetchInfluencer();
    }, [nickname]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentInfluencer = {nickname, firstName, lastName, socialMedia};

        if (nickname) {
            await updateInfluencer(nickname, currentInfluencer);
        } else {
            await createInfluencer(currentInfluencer);
        }
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Nickname:</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setInfluencerNickname(e.target.value)}
                    required
                    disabled={!!nickname} // Запретить редактирование никнейма, если это редактирование
                />
            </div>
            <div>
                <label>First Name:</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Last Name:</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
            <button type="submit">
                {nickname ? 'Сохранить изменения' : 'Создать инфлюенсера'}
            </button>
        </form>
    );
};

export default InfluencerForm;
