import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { User } from "../../models/user";
import { Seller } from "../../models/seller";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: User | undefined;

  HttpUploadOptions = {
    headers: new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
      "Content-Type": "application/json",
      Authorization: String(localStorage.getItem("token")),
      responseType: "text",
    }),
  };

  constructor(private http: HttpClient) {
    if (localStorage.getItem("token") != null) {
      let token: string = String(localStorage.getItem("token"));
      this.http
        .get(`${environment.hostname}/user/jwt`, {
          headers: new HttpHeaders({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
            "Content-Type": "application/json",
            responseType: "text",
            Authorization: token,
          }),
        })
        .subscribe({
          next: (res: any) => {
            this.user = res.data;
          },
          error: (err) => {
            console.log("Error", err);
          },
        });
    }
  }

  LOGIN(email: string, password: string): Observable<any> {
    return this.http.get(
      `${environment.hostname}/user?email=` + email + "&password=" + password,
      this.HttpUploadOptions
    );
  }

  LOGOUT(): void {
    localStorage.removeItem("token");
  }

  SIGNUP(user: User): Observable<any> {
    return this.http.post(
      `${environment.hostname}/user`,
      user,
      this.HttpUploadOptions
    );
  }

  GETUSER(): Observable<any> {
    return this.http.get(`${environment.hostname}/user/jwt`, {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        "Content-Type": "application/json",
        responseType: "text",
        Authorization: String(localStorage.getItem("token")),
      }),
    });
  }
  PASSWORDRECOVERY(email: string, phone: string): Observable<any> {
    return this.http.post(
      `${environment.hostname}/user/recovery`,
      { email: email, phone: phone },
      this.HttpUploadOptions
    );
  }

  GETSELLER(): Observable<any> {
    return this.http.get(`${environment.hostname}/seller`, {
      headers: new HttpHeaders({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
        "Content-Type": "application/json",
        responseType: "text",
        Authorization: String(localStorage.getItem("token")),
      }),
    });
  }

  UPDATESELLER(seller: Seller): Observable<any> {
    return this.http.put(
      `${environment.hostname}/seller`,
      {
        seller: seller,
      },
      this.HttpUploadOptions
    );
  }

  getToken(): string | null {
    if (localStorage.getItem("token") != null) {
      return String(localStorage.getItem("token"));
    }
    return null;
  }
}
