import {Influencer} from "../../models/Influencer";
import {NavLink} from "react-router-dom";
import edit from "../../assets/edit.svg";
import delete_ from "../../assets/delete.svg";
import collapse from "../../assets/collapse.svg";
import expand from "../../assets/expand.svg";
import {viewSocialAccounts} from "./ViewSocialAccounts";
import React from "react";

export const viewInfluencerDetails = (
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
