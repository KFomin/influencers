export interface SocialMediaAccounts {
    instagram?: string[];
    tiktok?: string[];
}

export interface Influencer {
    nickname: string;
    firstName: string;
    lastName: string;
    socialMedia: SocialMediaAccounts;
}
