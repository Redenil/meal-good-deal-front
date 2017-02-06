export class UserProfile {
    public email:string;
    public userName: string;
    public name: string;
    public firstName: string;
    public lastName: string;
    public ageMin: string;
    public ageMax: string;
    public gender: string;
    public local: string;
    public picture: any;
    public isConnected:boolean
    public profileType: ProfileType;

    public facebookToken: string;
    public twitterToken: string;

    constructor(email:string=null,
        userName: string = null,
        userId : string = null,
        name: string = null,
        firstName: string = null,
        lastName: string = null,
        ageMin: string = null,
        ageMax: string = null,
        gender: string = null,
        local: string = null,
        picture: any = null,
        isConnected: boolean = null,
        profileType: ProfileType = null,
        facebookToken: string = null,
        twitterToken: string = null) {
        this.email=email;
        this.userName = userName;
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
        this.ageMin = ageMin;
        this.ageMax = ageMax;
        this.gender = gender;
        this.local = local;
        this.picture = picture;
        this.isConnected=isConnected;
        this.profileType = profileType;
        this.facebookToken = facebookToken;
        this.twitterToken = twitterToken;
    }
}

export enum ProfileType {
    Facebook = 1,
    Twitter = 2
}
