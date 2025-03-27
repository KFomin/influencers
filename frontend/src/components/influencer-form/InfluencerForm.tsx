import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {createInfluencer, updateInfluencer, getInfluencer} from '../../resource/backend';
import './InfluencerForm.css'

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
        <form className={'form'} onSubmit={handleSubmit}>
            <div className={'form-field'}>
                <label className={'form-label'}>nickname</label>
                <input className={'form-input'}
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    disabled={!!nicknameParam}
                />
            </div>
            <div className={'form-field'}>
                <label className={'form-label'}>first name</label>
                <input className={'form-input'}
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>
            <div className={'form-field'}>
                <label className={'form-label'}>last name</label>
                <input className={'form-input'}
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </div>
            <div className={'form-buttons'}>
                <button className={'form-button'} onClick={() => navigate('/')}>
                    {'cancel'}
                </button>
                <button className={'form-button'} type="submit">
                    {'submit'}
                </button>
            </div>
        </form>
    );
};

export default InfluencerForm;
