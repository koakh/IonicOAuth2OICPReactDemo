import { isPlatform } from '@ionic/react';
import { App } from '@capacitor/app';
import { ConsoleLogObserver, AuthService } from 'ionic-appauth';
import { CapacitorBrowser, CapacitorSecureStorage } from 'ionic-appauth/lib/capacitor';

import { AxiosRequestor } from './AxiosService';

const AUTH_CLIENT_ID: string = process.env.REACT_APP_AUTH_CLIENT_ID || '';
const AUTH_SERVER_HOST = process.env.REACT_APP_AUTH_SERVER_HOST || '';
const AUTH_SCOPES = process.env.REACT_APP_AUTH_SCOPES || 'openid profile';

console.log('AUTH_CLIENT_ID: ', AUTH_CLIENT_ID);
console.log('AUTH_SERVER_HOST: ', AUTH_SERVER_HOST);
console.log('AUTH_SCOPES: ', AUTH_SCOPES);

export class Auth {

  private static authService: AuthService | undefined;

  private static buildAuthInstance() {
    const authService = new AuthService(new CapacitorBrowser(), new CapacitorSecureStorage(), new AxiosRequestor());
    authService.authConfig = {
      client_id: AUTH_CLIENT_ID,
      server_host: AUTH_SERVER_HOST,
      redirect_url: isPlatform('capacitor') ? 'com.appauth.demo://callback' : window.location.origin + '/loginredirect',
      end_session_redirect_url: isPlatform('capacitor') ? 'com.appauth.demo://endSession' : window.location.origin + '/endredirect',
      scopes: AUTH_SCOPES,
      pkce: true,
    }

    if (isPlatform('capacitor')) {
      console.log("applistenercreated");
      App.addListener('appUrlOpen', (data: any) => {
        if ((data.url).indexOf(authService.authConfig.redirect_url) === 0) {
          authService.authorizationCallback(data.url);
        }else{
            authService.endSessionCallback();
        }
      });
    }
    
    authService.init();
    return authService;
  }

  public static get Instance(): AuthService {
    if (!this.authService) {
      this.authService = this.buildAuthInstance();
    }

    return this.authService;
  }
}
