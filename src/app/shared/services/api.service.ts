import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { TokenRefreshService } from '../token-refresh/token-refresh.service';
// export declare class DataFetcher {
//     private http;
//     private tokenRefreshService;
//     constructor(http: HttpClient, tokenRefreshService: TokenRefreshService);
//     fetch(url: string, lang: string, opts?: any, body?: any, cacheBustingValue?: string): Observable<any>;
// }


// import {Injectable} from '@angular/core';
// import {LanguageService, UserInfoService} from '@hdca/fe-angular-shared';
// import {DataSender, OriginService} from '@hdca/fe-angular-core';
// import {myAccountApiUrls} from '../constants/api.constants';
// @Injectable()
// export class OPayService {
//     constructor(private userInfo: UserInfoService, private dataSender: DataSender, private originService: OriginService, private languageService: LanguageService) {
//     }
//     getOPToken() {
//         const email = this.userInfo.getUserAccountData().email;
//         const cartId = this.userInfo.getCookie('cart');
//         const url = myAccountApiUrls.BASE_URL(this.originService.getOrigin()) + myAccountApiUrls.OPAY_TOKEN(email, cartId);
//         const lang = this.languageService.getLanguage();
//         return this.dataSender.post(url, lang);
//     }
// }

// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {

//   constructor(private httpClient: HttpClient) { }
// }
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient, ) { }

  getData(url: string): Observable<any> {
    return this.http.get(url);
  }
}
