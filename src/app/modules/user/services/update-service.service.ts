import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../../../core/services/authService/auth.service";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { User } from "../../../core/models/user";
import { Address } from "../../../core/models/address";
import { Seller } from "../../../core/models/seller";

@Injectable({
  providedIn: "root",
})
export class UpdateServiceService {
  HttpUploadOptions = {};

  constructor(private auth: AuthService, private http: HttpClient) {
    this.HttpUploadOptions = {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        "Content-Type": "application/json",
        responseType: "text",
        Authorization: String(auth.getToken()),
      }),
    };
  }

  UPDATEBASICINFO(user: User | undefined): Observable<any> {
    if (!user) {
      throw new Error("User can't be undefined");
    }
    return this.http.put(
      `${environment.hostname}/user`,
      user,
      this.HttpUploadOptions
    );
  }
  UPDATEPASSWORD(
    currentPassword: string,
    newPassword: string
  ): Observable<any> {
    return this.http.put(
      `${environment.hostname}/user/password`,
      {
        current_password: currentPassword,
        new_password: newPassword,
      },
      this.HttpUploadOptions
    );
  }
  UPDATEADDRESS(address: Address): Observable<any> {
    return this.http.put(
      `${environment.hostname}/user/address`,
      {
        address: address,
      },
      this.HttpUploadOptions
    );
  }

  JOINASSELLER(seller: Seller): Observable<any> {
    return this.http.post(
      `${environment.hostname}/seller/join`,
      {
        seller: seller,
      },
      this.HttpUploadOptions
    );
  }
}
