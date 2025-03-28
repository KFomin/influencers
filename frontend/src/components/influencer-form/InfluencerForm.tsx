import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {createInfluencer, getInfluencer, updateInfluencer} from '../../resource/backend';
import {toast} from 'react-toastify';
import './InfluencerForm.css';
import {ViewSocialMediaSection} from "./ViewSocialMediaSection";
import {viewInputField} from "./ViewInputField";

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

    const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    const onSocialMediaChanged = (socialMediaType: 'tiktok' | 'instagram', index: number, value: string) => {
        resetDuplicates(socialMediaType);
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: prevSocialMedia[socialMediaType].map((username, i) =>
                i === index ? value : username
            ),
        }));
    };

    const onNewSocialMediaAdded = (socialMediaType: 'tiktok' | 'instagram') => {
        resetDuplicates(socialMediaType);
        setSocialMedia(prevSocialMedia => ({
            ...prevSocialMedia,
            [socialMediaType]: [...prevSocialMedia[socialMediaType], '']
        }));
    };

    const onSocialMediaRemoved = (socialMediaType: 'tiktok' | 'instagram', index: number) => {
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
        <form className='form' onSubmit={onSubmit}>
            {viewInputField('Nickname', nickname, setNickname, !!nicknameParam)}
            {viewInputField('First Name', firstName, setFirstName)}
            {viewInputField('Last Name', lastName, setLastName)}

            {ViewSocialMediaSection(
                'instagram',
                instagramDuplicates,
                onNewSocialMediaAdded,
                socialMedia,
                onSocialMediaChanged,
                onSocialMediaRemoved,
            )}

            {ViewSocialMediaSection(
                'tiktok',
                tiktokDuplicates,
                onNewSocialMediaAdded,
                socialMedia,
                onSocialMediaChanged,
                onSocialMediaRemoved,
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


