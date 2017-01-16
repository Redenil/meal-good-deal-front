import { OpaqueToken } from "@angular/core";
export interface ApplicationConfig {
  appName: string;
  facebookAppId: number;
}
export const APP_CONFIG: ApplicationConfig = {
  appName: 'meal-good-deal-front',
  facebookAppId: 355037308190243
};
export const APP_CONFIG_TOKEN = new OpaqueToken('config');
