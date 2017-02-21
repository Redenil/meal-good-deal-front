export interface ISocialService {

    login(): Promise<any>;

    logout(): Promise<boolean>;

    getLoginStatus();
}