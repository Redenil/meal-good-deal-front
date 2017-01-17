export class UserProfile {
    public userName: string;
    public name: string;
    public picture: any;
    public profileType: ProfileType;

    public facebookToken: string;
    public twitterToken: string;

    constructor(userName: string = null,
        name: string = null,
        picture: any = null,
        profileType: ProfileType = null,
        facebookToken: string = null,
        twitterToken: string = null) {
        this.userName = userName;
        this.name = name;
        this.picture = picture;
        this.profileType = profileType;
        this.facebookToken = facebookToken;
        this.twitterToken = twitterToken;
    }
}

export enum ProfileType {
    Facebook = 1,
    Twitter = 2
}