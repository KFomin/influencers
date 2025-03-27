import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {createInfluencer, updateInfluencer, getInfluencer} from '../../resource/backend';
import './InfluencerForm.css'
import {toast} from "react-toastify";

const InfluencerForm: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [socialMedia, setSocialMedia] = useState({instagram: [], tiktok: []});

    const {nicknameParam} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfluencer = async () => {
            if (nicknameParam) {
                try {
                    const influencer = await getInfluencer(nicknameParam);
                    if (influencer) {
                        setNickname(influencer.nickname);
                        setFirstName(influencer.firstName);
                        setLastName(influencer.lastName);
                        setSocialMedia(influencer.socialMedia);
                    }
                } catch (error) {
                    toast.error(`Failed to fetch influencer ${nicknameParam} data.`);
                    navigate('/');
                }
            }
        };
        fetchInfluencer();
    }, [nicknameParam]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentInfluencer = {nickname, firstName, lastName, socialMedia};

        if (nicknameParam) {
            try {
                await updateInfluencer(nicknameParam, currentInfluencer);
                toast.success(`Influencer ${nickname} updated`);
                navigate('/');
            } catch (error: any) {
                toast.error(`Error: ${String(error)}`);
                if (error.response.data.message) {
                    toast.error(`Error: ${error.response.data.message}`);
                } else {
                    toast.error(`Error while trying to update influencer.`);
                }
            }
        } else {
            try {
                await createInfluencer(currentInfluencer);
                toast.success(`Influencer ${nickname} created`);
                navigate('/');
            } catch (error: any) {
                console.log(error.response);
                if (error.response.data.message) {
                    toast.error(`Error: ${error.response.data.message}`);
                } else {
                    toast.error(`Error while trying to create influencer.`);
                }
            }
        }
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
