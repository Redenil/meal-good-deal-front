export class UserProfile {
    public userName: string;
    public name: string;
    public picture: any;
    public profileType: ProfileType;

    constructor() {
    }
}

export enum ProfileType {
    Facebook = 1,
    Twitter = 2
}