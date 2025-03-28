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
import externalLink from '../../assets/external-link.svg'
import './InfluencerList.css';
import {toast} from "react-toastify";
import {Influencer} from "../../models/Influencer";

export default function InfluencerList() {
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
            await deleteInfluencer(nickname);
            setInfluencers(prev => prev.filter(influencer => influencer.nickname !== nickname));
            toast.success(`Influencer ${nickname} has been deleted.`);
        } catch (error) {
            toast.error(`Failed to delete influencer ${nickname}`);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleExpand = (nickname: string) => {
        setExpanded(prevExpanded => (nickname === prevExpanded ? '' : nickname));
    };

    return (
        <div className='list'>
            <div className='list-top'>
                <input
                    className='search'
                    placeholder='search'
                    type='text'
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <button className='button' onClick={() => navigate('/influencer')}>
                    <img className='icon' src={plus} alt='Add influencer'/>
                </button>
            </div>
            {influencers.length === 0 ? (
                <div>No influencers found.</div>
            ) : (
                influencers.map(influencer =>
                    viewInfluencerDetails(
                        influencer,
                        influencer.nickname === expanded,
                        handleExpand,
                        handleDelete
                    )
                )
            )}
        </div>
    );
};

const viewInfluencerDetails = (
    influencer: Influencer,
    expanded: boolean,
    handleExpand: (nickname: string) => void,
    handleDelete: (nickname: string) => void,
) => {
    return (
        <div key={influencer.nickname} className='influencer-details'>
            <div className='main-details'>
                <ul className='credentials'>
                    <li>
                        <b>Nickname: </b>
                        <p>{influencer.nickname}</p>
                    </li>
                    <li>
                        <b>First Name: </b>
                        <p>{influencer.firstName}</p>
                    </li>
                    <li>
                        <b>Last Name: </b>
                        <p>{influencer.lastName}</p>
                    </li>
                </ul>
                <span className='buttons-container'>
                    <span className={'details-buttons'}>
                            <NavLink className='button' to={`/influencer/${encodeURIComponent(influencer.nickname)}`}>
                                <img className='icon' src={edit} alt='Edit'/>
                            </NavLink>
                            <button className='button' onClick={() => handleDelete(influencer.nickname)}>
                                <img className='icon' src={delete_} alt='Delete'/>
                            </button>
                        </span>
                    {((influencer.socialMedia.tiktok && influencer.socialMedia.tiktok.length > 0) || (influencer.socialMedia.instagram && influencer.socialMedia.instagram.length > 0)) ?
                        <button className='button expand-button' onClick={() => handleExpand(influencer.nickname)}>
                            {expanded ? (
                                <img className='icon' src={collapse} alt='collapse'/>
                            ) : (
                                <img className='icon' src={expand} alt='expand'/>
                            )}
                        </button>
                        :
                        <></>
                    }
                    </span>
            </div>
            {expanded && (
                <div className='social-media-container'>
                    {viewSocialAccounts(influencer.socialMedia)}
                </div>
            )}
        </div>
    );
};


const viewSocialAccounts = (socialMedia: { instagram?: string[]; tiktok?: string[] }) => (
    <>
        {socialMedia.tiktok && socialMedia.tiktok.length > 0 && (
            <div>
                <h4 className={'social-media-header'}>
                    <img className={'icon'} src={tiktok} alt={'tiktok logo'}/>
                    TikTok Accounts:
                </h4>
                <ul className='social-media-accounts'>
                    {socialMedia.tiktok.map((account) => (
                        <a key={account}
                           className={'social-media-item'}
                           target='_blank'
                           rel='noopener noreferrer'
                           href={`https://www.tiktok.com/@${account}`}>
                            <img src={externalLink} alt={'externalLink icon'} className={'icon'}/>
                            {account}
                        </a>
                    ))}
                </ul>
            </div>
        )}
        {socialMedia.instagram && socialMedia.instagram.length > 0 && (
            <div>
                <h4 className={'social-media-header'}>
                    <img className={'icon'} src={instagram} alt={'instagram logo'}/>
                    Instagram Accounts:
                </h4>
                <ul className='social-media-accounts'>
                    {socialMedia.instagram.map((account) => (
                        <a key={account}
                           className={'social-media-item'}
                           target='_blank'
                           rel='noopener noreferrer'
                           href={`https://www.instagram.com/${account}`}>
                            <img src={externalLink} alt={'externalLink icon'} className={'icon'}/>
                            {account}
                        </a>
                    ))}
                </ul>
            </div>
        )}
    </>
);
