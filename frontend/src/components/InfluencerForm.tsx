import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {createInfluencer, updateInfluencer, getInfluencer} from '../resource/backend';

const InfluencerForm: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [socialMedia, setSocialMedia] = useState({instagram: [], tiktok: []});

    const {nicknameParam} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(nicknameParam);
        const fetchInfluencer = async () => {
            if (nicknameParam) {
                const influencer = await getInfluencer(nicknameParam);
                if (influencer) {
                    setNickname(influencer.nickname);
                    setFirstName(influencer.firstName);
                    setLastName(influencer.lastName);
                    setSocialMedia(influencer.socialMedia);
                }
            }
        };
        fetchInfluencer();
    }, [nicknameParam]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentInfluencer = {nickname, firstName, lastName, socialMedia};

        if (nicknameParam) {
            await updateInfluencer(nicknameParam, currentInfluencer);
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
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    disabled={!!nicknameParam}
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
                {nicknameParam ? 'Сохранить изменения' : 'Создать инфлюенсера'}
            </button>
        </form>
    );
};

export default InfluencerForm;
