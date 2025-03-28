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

export const validateInfluencer = (influencer: Influencer) => {

    const blanks = {
        instagram: [] as number[],
        tiktok: [] as number[],
    }

    const duplicates = {
        instagram: [] as number[],
        tiktok: [] as number[],
    };

    if (influencer.socialMedia.instagram) {
        const instagram = influencer.socialMedia.instagram;
        instagram.forEach((username, index) => {
            if (username.trim().length === 0) {
                blanks.instagram.push(index);
            }
            if (instagram.indexOf(username) !== index) {
                duplicates.instagram.push(index);
            }
        });
    }

    if (influencer.socialMedia.tiktok) {
        const tiktok = influencer.socialMedia.tiktok;
        tiktok.forEach((username, index) => {
            if (username.trim().length === 0) {
                blanks.tiktok.push(index);
            }
            if (tiktok.indexOf(username) !== index) {
                duplicates.tiktok.push(index);
            }
        });
    }

    const hasBlanks = blanks.instagram.length > 0 || blanks.tiktok.length > 0;

    if (hasBlanks) {
        return {
            valid: false,
            error: {
                message: 'Blank social media accounts found',
                indexes: blanks,
            },
        };
    }

    const hasDuplicates = duplicates.instagram.length > 0 || duplicates.tiktok.length > 0;

    if (hasDuplicates) {
        return {
            valid: false,
            error: {
                message: 'Duplicate social media accounts found',
                indexes: duplicates,
            },
        };
    }

    if (influencer.nickname.length > 50 || influencer.firstName.length > 50 || influencer.lastName.length > 50) {
        return {
            valid: false,
            error: {
                message: 'Nickname, first name, and last name must not exceed 50 characters',
            },
        };
    }

    if (influencer.nickname.trim().length === 0 || influencer.firstName.trim().length === 0 || influencer.lastName.trim().length === 0) {
        return {
            valid: false,
            error: {
                message: 'Nickname, first name, and last name must not be empty',
            },
        };
    }

    return {valid: true};
};
