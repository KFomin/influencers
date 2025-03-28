import tiktok from "../../assets/tiktok.svg";
import externalLink from "../../assets/external-link.svg";
import instagram from "../../assets/instagram.svg";
import React from "react";

export const viewSocialAccounts = (socialMedia: { instagram?: string[]; tiktok?: string[] }) => (
    <>
        {socialMedia.tiktok && socialMedia.tiktok.length > 0 && (
            <div>
                <h4 className={'social-media-type'}>
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
                <h4 className={'social-media-type'}>
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
