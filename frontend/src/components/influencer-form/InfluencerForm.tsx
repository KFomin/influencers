import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {createInfluencer, updateInfluencer, getInfluencer} from '../../resource/backend';
import {toast} from 'react-toastify';
import plus from '../../assets/plus.svg';
import delete_ from '../../assets/delete.svg';
import './InfluencerForm.css';

const InfluencerForm: React.FC = () => {
    const [nickname, setNickname] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [socialMedia, setSocialMedia] = useState({instagram: [], tiktok: []});

    const {nickname: paramNickname} = useParams<{ nickname: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfluencer = async () => {
            if (paramNickname) {
                const influencer = await getInfluencer(paramNickname);
                if (influencer) {
                    setNickname(influencer.nickname);
                    setFirstName(influencer.firstName);
                    setLastName(influencer.lastName);
                    setSocialMedia(influencer.socialMedia);
                }
            }
        };
        fetchInfluencer();
    }, [paramNickname]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const currentInfluencer = {nickname, firstName, lastName, socialMedia};

        try {
            if (paramNickname) {
                await updateInfluencer(paramNickname, currentInfluencer);
                toast.success(`Influencer ${nickname} updated`);
            } else {
                await createInfluencer(currentInfluencer);
                toast.success(`Influencer ${nickname} created`);
            }
            navigate('/');
        } catch (error) {
            toast.error(`Failed to save influencer: ${error}`);
        }
    };

    const handleSocialMediaChange = (socialMediaType: 'tiktok' | 'instagram', index: number, value: string) => {
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: prevSocialMedia[socialMediaType].map((username, i) =>
                i === index ? value : username
            ),
        }));
    };

    const addNewSocialMedia = (socialMediaType: 'tiktok' | 'instagram') => {
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: [...prevSocialMedia[socialMediaType], '']
        }));
    };

    const handleSocialMediaRemove = (socialMediaType: 'tiktok' | 'instagram', index: number) => {
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: prevSocialMedia[socialMediaType].filter((_, i) => i !== index),
        }));
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

    const viewSocialMediaSection = (socialMediaType: 'instagram' | 'tiktok') => (
        <div className='social-media'>
            <div className='social-media-header'>
                <label>{socialMediaType}</label>
                <button className='add-social-media' onClick={() => addNewSocialMedia(socialMediaType)}>
                    <img className='add-media' src={plus} alt={`Add ${socialMediaType}`}/>
                </button>
            </div>
            {socialMedia[socialMediaType].map((username, index) => (
                <div className='form-field social-field' key={index}>
                    <input
                        className='form-input'
                        type='text'
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
    return (
        <form className='form' onSubmit={handleSubmit}>
            {viewInputField('Nickname', nickname, setNickname, false)}
            {viewInputField('First Name', firstName, setFirstName)}
            {viewInputField('Last Name', lastName, setLastName)}

            {viewSocialMediaSection('instagram')}
            {viewSocialMediaSection('tiktok')}

            <div className='form-buttons'>
                <button className='form-button' type='button' onClick={() => navigate('/')}>
                    {'Cancel'}
                </button>
                <button className='form-button' type='submit'>
                    {paramNickname ? 'Save' : 'Create'}
                </button>
            </div>
        </form>
    )
};


export default InfluencerForm;
