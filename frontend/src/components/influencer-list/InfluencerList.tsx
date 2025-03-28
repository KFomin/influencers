import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {deleteInfluencer, getInfluencersList} from '../../resource/backend';
import plus from '../../assets/plus.svg';
import './InfluencerList.css';
import {toast} from "react-toastify";
import {Influencer} from "../../models/Influencer";
import {viewInfluencerDetails} from "./ViewInfluencerDetails";

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


