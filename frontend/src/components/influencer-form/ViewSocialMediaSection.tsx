import plus from "../../assets/plus.svg";
import delete_ from "../../assets/delete.svg";
import React from "react";

export const ViewSocialMediaSection = (socialMediaType: 'instagram' | 'tiktok',
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
