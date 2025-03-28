import plus from "../../assets/plus.svg";
import delete_ from "../../assets/delete.svg";
import React from "react";

export const ViewSocialMediaSection = (
    socialMediaType: 'instagram' | 'tiktok',
    duplicates: number[],
    addNewSocialMedia: (socialMediaType: 'instagram' | 'tiktok') => void,
    socialMedia: { instagram: string[], tiktok: string[] },
    handleSocialMediaChange: (socialMediaType: 'instagram' | 'tiktok', index: number, value: string) => void,
    handleSocialMediaRemove: (socialMediaType: 'instagram' | 'tiktok', index: number) => void
) => (
    <div className='social-media'>
        <div className='social-media-header'>
            <label>{socialMediaType}</label>
            <button type={'button'}
                    className='add-social-media'
                    onClick={() => {
                        addNewSocialMedia(socialMediaType);
                        const firstSocialMedia = document.getElementById(`field-input-${socialMediaType}-0`);
                        if (firstSocialMedia) {
                            firstSocialMedia.focus();
                        }
                    }
                    }>
                <img className='add-media' src={plus} alt={`Add ${socialMediaType}`}/>
            </button>
        </div>
        {socialMedia[socialMediaType].map((username, index) => (
            <div className={'form-field social-field'} key={'social-field-' + index}>
                <input
                    id={`field-input-${socialMediaType}-${index}`}
                    className={'form-input ' + (duplicates.includes(index) ? 'error' : '')}
                    type='text'
                    value={username}
                    onChange={(e) => handleSocialMediaChange(socialMediaType, index, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            addNewSocialMedia(socialMediaType);
                        } else if (e.key === 'ArrowDown') {
                            const nextElement = document.getElementById(`field-input-${socialMediaType}-${index + 1}`);
                            if (nextElement) {
                                nextElement.focus();
                            }
                        } else if (e.key === 'ArrowUp') {
                            const prevElement = document.getElementById(`field-input-${socialMediaType}-${index - 1}`);
                            if (prevElement) {
                                prevElement.focus();
                            }
                        }
                    }}
                />
                <button type='button'
                        className='form-button remove-social-media-button'
                        onClick={() => handleSocialMediaRemove(socialMediaType, index)}>
                    <img src={delete_} className='add-media' alt={`Remove ${socialMediaType}`}/>
                </button>
            </div>
        ))}
    </div>
);
