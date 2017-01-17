export interface IloginService {

    login(): Promise<any>;

    logout(): Promise<boolean>;

    getConnectionStatus();
}