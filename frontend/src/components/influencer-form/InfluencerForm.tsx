import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {createInfluencer, updateInfluencer, getInfluencer} from '../../resource/backend';
import {toast} from 'react-toastify';
import plus from '../../assets/plus.svg';
import delete_ from '../../assets/delete.svg';
import './InfluencerForm.css';

export default function InfluencerForm() {
    const [nickname, setNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [socialMedia, setSocialMedia] = useState({instagram: [], tiktok: []});
    const [instagramDuplicates, setInstagramDuplicates] = useState<number[]>([]);
    const [tiktokDuplicates, setTiktokDuplicates] = useState<number[]>([]);

    const {nicknameParam} = useParams<{ nicknameParam: string }>();
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
                } catch (e) {
                    toast.error(`Sorry, influencer ${nicknameParam} not found.`);
                    navigate('/influencer');
                }
            }
        };
        fetchInfluencer();
    }, [nicknameParam]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentInfluencer = {nickname, firstName, lastName, socialMedia};

        try {
            if (nicknameParam) {
                await updateInfluencer(nicknameParam, currentInfluencer);
                toast.success(`Influencer ${nickname} updated`);
            } else {
                await createInfluencer(currentInfluencer);
                toast.success(`Influencer ${nickname} created`);
            }
            navigate('/');
        } catch (error: any) {
            if (error.response?.data?.duplicates) {
                if (error.response.data.duplicates.instagram) {
                    setInstagramDuplicates(error.response.data.duplicates.instagram);
                }
                if (error.response.data.duplicates.tiktok) {
                    setTiktokDuplicates(error.response.data.duplicates.tiktok);
                }
            }
            if (error.response.data.message) {
                toast.error(error.response.data.message);
                return;
            }
            toast.error(`Failed to save influencer. ${error}`);
        }
    };

    const handleSocialMediaChange = (socialMediaType: 'tiktok' | 'instagram', index: number, value: string) => {
        resetDuplicates(socialMediaType);
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: prevSocialMedia[socialMediaType].map((username, i) =>
                i === index ? value : username
            ),
        }));
    };

    const addNewSocialMedia = (socialMediaType: 'tiktok' | 'instagram') => {
        resetDuplicates(socialMediaType);
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: [...prevSocialMedia[socialMediaType], '']
        }));
    };

    const handleSocialMediaRemove = (socialMediaType: 'tiktok' | 'instagram', index: number) => {
        resetDuplicates(socialMediaType);
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: prevSocialMedia[socialMediaType].filter((_, i) => i !== index),
        }));
    };


    const resetDuplicates = (socialMediaType: 'tiktok' | 'instagram') => {
        switch (socialMediaType) {
            case 'tiktok':
                setTiktokDuplicates([]);
                break;
            case 'instagram':
                setInstagramDuplicates([]);
                break;
        }
    }

    return (
        <form className='form' onSubmit={handleSubmit}>
            {viewInputField('Nickname', nickname, setNickname, false)}
            {viewInputField('First Name', firstName, setFirstName)}
            {viewInputField('Last Name', lastName, setLastName)}

            {viewSocialMediaSection(
                'instagram',
                instagramDuplicates,
                addNewSocialMedia,
                socialMedia,
                handleSocialMediaChange,
                handleSocialMediaRemove,
            )}
            {viewSocialMediaSection(
                'tiktok',
                tiktokDuplicates,
                addNewSocialMedia,
                socialMedia,
                handleSocialMediaChange,
                handleSocialMediaRemove,
            )}

            <div className='form-buttons'>
                <button className='form-button' type='button' onClick={() => navigate('/')}>
                    {'Cancel'}
                </button>
                <button className='form-button' type='submit'>
                    {nicknameParam ? 'Save' : 'Create'}
                </button>
            </div>
        </form>
    )
};


const viewInputField = (
    label: string,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    required = true) => (
    <div className='form-field'>
        <label className='form-label'>{label}</label>
        <input
            className='form-input'
            type='text'
            value={value}
            onChange={(e) => setter(e.target.value)}
            required={required}
        />
    </div>
);

const viewSocialMediaSection = (socialMediaType: 'instagram' | 'tiktok',
                                duplicates: number[],
                                addNewSocialMedia: (socialMediaType: 'instagram' | 'tiktok') => void,
                                socialMedia: { instagram: string[], tiktok: string[] },
                                handleSocialMediaChange: (socialMediaType: 'instagram' | 'tiktok', index: number, value: string) => void,
                                handleSocialMediaRemove: (socialMediaType: 'instagram' | 'tiktok', index: number) => void) => (
    <div className='social-media'>
        <div className='social-media-header'>
            <label>{socialMediaType}</label>
            <button className='add-social-media' onClick={() => addNewSocialMedia(socialMediaType)}>
                <img className='add-media' src={plus} alt={`Add ${socialMediaType}`}/>
            </button>
        </div>
        {socialMedia[socialMediaType].map((username, index) => (
            <div className={'form-field social-field '} key={index}>
                <input
                    className={'form-input ' + (duplicates.includes(index) ? 'error' : '')}
                    type='text'
                    title={index + " lol ? " + duplicates[0]}
                    value={username}
                    onChange={(e) => handleSocialMediaChange(socialMediaType, index, e.target.value)}
                    required
                />
                <button type='button'
                        className={'form-button remove-social-media-button'}
                        onClick={() => handleSocialMediaRemove(socialMediaType, index)}>
                    <img src={delete_} className='add-media' alt={`Remove ${socialMediaType}`}/>
                </button>
            </div>
        ))}
    </div>
);
