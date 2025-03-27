import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {getInfluencersList, deleteInfluencer} from '../../resource/backend';
import edit from '../../assets/edit.svg';
import delete_ from '../../assets/delete.svg';
import plus from '../../assets/plus.svg';
import './InfluencerList.css';
import {toast} from "react-toastify";

const InfluencerList: React.FC = () => {
    const [influencers, setInfluencers] = useState<any[]>([]);
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
        setSearchQuery(event.target.value); // Обновить поиск
    };

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
                    influencers.map(influencer => (
                        <div key={influencer.nickname} className='influencer-details'>
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
                            <span className='details-buttons'>
                        <NavLink className='button' to={`/influencer/${encodeURIComponent(influencer.nickname)}`}>
                            <img className='button-icon' src={edit} alt='Edit'/>
                        </NavLink>
                        <button className='button' onClick={() => handleDelete(influencer.nickname)}>
                            <img className='button-icon' src={delete_} alt='Delete'/>
                        </button>
                    </span>
                        </div>
                    ))
                )}
        </div>
    );
};

export default InfluencerList;
