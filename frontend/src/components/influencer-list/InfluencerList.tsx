import React, {useEffect, useState} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {getInfluencersList, deleteInfluencer} from '../../resource/backend';
import edit from '../../assets/edit.svg'
import delete_ from '../../assets/delete.svg'
import plus from '../../assets/plus.svg'
import './InfluencerList.css'

const InfluencerList: React.FC = () => {
        const [influencers, setInfluencers] = useState<any[]>([]);
        const navigate = useNavigate();

        useEffect(() => {
            const fetchInfluencers = async () => {
                const data = await getInfluencersList();
                setInfluencers(data);
            };
            fetchInfluencers();
        }, []);

        const handleDelete = async (nickname: string) => {
            await deleteInfluencer(nickname);
            setInfluencers(prev => prev.filter(influencer => influencer.nickname !== nickname));
        };

        return (
            <div className='list'>
                <div className={'list-top'}>
                    <input className={'search'} type={'text'}/>
                    <button className={'button'} onClick={() => navigate('/influencer')}>
                        <img className={'button-icon'} src={plus} alt={'Add influencer'}/>
                    </button>
                </div>
                {influencers.map(influencer => (
                    <div key={influencer.nickname} className={'influencer-details'}>
                        <ul className={'credentials'}>
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
                        <span className={'details-buttons'}>
                                <NavLink className={'button'}
                                         to={(`/influencer/${encodeURIComponent(influencer.nickname)}`)}>
                                    <img className={'button-icon'} src={edit} alt={'Edit'}/>
                                </NavLink>
                                <button className={'button'}
                                        onClick={() => handleDelete(influencer.nickname)}>
                                    <img className={'button-icon'} src={delete_} alt={'Edit'}/>
                                </button>
                            </span>
                    </div>
                ))}
            </div>
        )
            ;
    }
;

export default InfluencerList;
