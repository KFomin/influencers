import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {getInfluencersList, deleteInfluencer} from '../../resource/backend';
import edit from '../../assets/edit.svg';
import delete_ from '../../assets/delete.svg';
import plus from '../../assets/plus.svg';
import collapse from '../../assets/collapse.svg';
import expand from '../../assets/expand.svg';
import tiktok from '../../assets/tiktok.svg';
import instagram from '../../assets/instagram.svg';
import './InfluencerList.css';
import {toast} from "react-toastify";
import {Influencer} from "../../models/Influencer";

const InfluencerList: React.FC = () => {
    const [influencers, setInfluencers] = useState<Influencer[]>([]);
    const [expanded, setExpanded] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfluencers = async () => {
            try {
                const data = await getInfluencersList(debouncedSearch);
                setInfluencers(data);
            } catch (error) {
                toast.error('Sorry, failed to fetch influencers');
            }
        };
        fetchInfluencers();
    }, [debouncedSearch]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    const handleDelete = async (nickname: string) => {
        try {
            deleteInfluencer(nickname).then(() => {
                getInfluencersList(debouncedSearch).then((data) => {
                    setInfluencers(data);
                    toast.success(`Influencer ${nickname} has been deleted.`);
                });
            })
        } catch (error) {
            toast.error(`Failed to delete influencer ${nickname}`);
        }
    };

    const searchInfluencers = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleExpand = (nickname: string) => {
        setExpanded(prevExpanded => {
            if (nickname === prevExpanded) {
                return '';
            }
            return nickname;
        });
    }

    return (

        <div className='list'>
            <div className='list-top'>
                <input
                    className='search'
                    placeholder='search'
                    type='text'
                    value={searchQuery}
                    onChange={searchInfluencers}
                />
                <button className='button' onClick={() => navigate('/influencer')}>
                    <img className='button-icon' src={plus} alt='Add influencer'/>
                </button>
            </div>
            {influencers.length === 0 ?
                (<div>no influencers found</div>) : (
                    influencers.map((influencer, index) => (
                        <div key={influencer.nickname + index} className='influencer-details'>
                            <div className='main-details'>
                                <ul className='credentials'>
                                    <li>
                                        <b>nickname: </b>
                                        <p>{influencer.nickname}</p>
                                    </li>
                                    <li>
                                        <b>first name: </b>
                                        <p>{influencer.firstName}</p>
                                    </li>
                                    <li>
                                        <b>last name: </b>
                                        <p>{influencer.lastName}</p>
                                    </li>
                                </ul>
                                <span className='buttons-container'>
                                    {((influencer.socialMedia.tiktok && (influencer.socialMedia.tiktok.length > 0))
                                        || (influencer.socialMedia.instagram && (influencer.socialMedia.instagram.length > 0)))
                                        ?
                                        (
                                            <button className='button expand-button'
                                                    onClick={() => handleExpand(influencer.nickname)}>
                                                {expanded === influencer.nickname ?
                                                    <img className='button-icon' src={collapse} alt='collapse'/>
                                                    : <img className='button-icon' src={expand} alt='expand'/>
                                                }
                                            </button>
                                        )
                                        :
                                        (<span></span>)
                                    }
                                    <span className='details-buttons'>
                                        <NavLink className='button'
                                                 to={`/influencer/${encodeURIComponent(influencer.nickname)}`}>
                                            <img className='button-icon' src={edit} alt='Edit'/>
                                        </NavLink>
                                        <button className='button' onClick={() => handleDelete(influencer.nickname)}>
                                            <img className='button-icon' src={delete_} alt='Delete'/>
                                        </button>
                                    </span>
                                </span>
                            </div>
                            {expanded === influencer.nickname ?
                                (<div className={'social-media-container'}>
                                    {influencer.socialMedia.tiktok && (influencer.socialMedia.tiktok.length > 0) ?
                                        <ul className={'social-media-accounts'}>
                                            <u className={'social-media-type'}>
                                                <img className='button-icon' src={tiktok} alt={'tiktok logo'}/>
                                                Tiktok accounts:
                                            </u>
                                            {influencer.socialMedia.tiktok.map((tiktok, index) => (
                                                <li key={tiktok + index}
                                                    title={tiktok}>
                                                    <a target={'_blank'}
                                                       href={`https://www.tiktok.com/@${tiktok}`}>{tiktok}</a>
                                                </li>
                                            ))}
                                        </ul>
                                        : <span></span>
                                    }

                                    {influencer.socialMedia.instagram && (influencer.socialMedia.instagram.length > 0) ?
                                        <ul className={'social-media-accounts'}>
                                            <u className={'social-media-type'}>
                                                <img className='button-icon' src={instagram} alt={'tiktok logo'}/>
                                                Instagram accounts:
                                            </u>
                                            {influencer.socialMedia.instagram.map((instagram, index) => (
                                                <li key={instagram + index}
                                                    title={instagram}>
                                                    <a target={'_blank'}
                                                       href={`https://www.instagram.com/${instagram}`}>{instagram}</a>
                                                </li>
                                            ))}
                                        </ul>
                                        : <span></span>
                                    }
                                </div>) :
                                (<span></span>)
                            }
                        </div>
                    ))
                )}
        </div>
    );
};

export default InfluencerList;
