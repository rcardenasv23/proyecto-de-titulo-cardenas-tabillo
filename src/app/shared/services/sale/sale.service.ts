import { Injectable } from "@angular/core";
import { AuthService } from "../../../core/services/authService/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Buy } from "../../../core/models/buy";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class SaleService {
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

  BUY(sale: Buy): Observable<any> {
    return this.http.post(
      `${environment.hostname}/sale`,
      {
        sale: sale,
      },
      this.HttpUploadOptions
    );
  }

  GETBYUSER(id_user: string): Observable<any> {
    return this.http.get(`${environment.hostname}/sale/by-user`, {
      ...this.HttpUploadOptions,
      params: { id_user },
    });
  }

  GETDETAILBYUSER(id_sale: string): Observable<any> {
    return this.http.get(`${environment.hostname}/sale/detail/user`, {
      ...this.HttpUploadOptions,
      params: { id_sale },
    });
  }

  GETBYSELLER(id_seller: string): Observable<any> {
    return this.http.get(`${environment.hostname}/sale/by-seller`, {
      ...this.HttpUploadOptions,
      params: { id_seller },
    });
  }

  GETDETAILBYSELLER(id_sale: string): Observable<any> {
    return this.http.get(`${environment.hostname}/sale/detail/seller`, {
      ...this.HttpUploadOptions,
      params: { id_sale },
    });
  }

  UPLOADPAYMENTFILE(file: any, id_sale: string): Observable<any> {
    return this.http.post(
      `${environment.hostname}/sale/file`,
      {
        file: file,
        id_sale: id_sale,
      },
      this.HttpUploadOptions
    );
  }
  DELETEPAYMENTFILE(id_file: string): Observable<any> {
    return this.http.delete(`${environment.hostname}/sale/file`, {
      ...this.HttpUploadOptions,
      params: { id_file: id_file },
    });
  }

  ACCEPT(
    id_sale: string,
    datePickUp: Date,
    description: string
  ): Observable<any> {
    return this.http.post(
      `${environment.hostname}/sale/accept`,
      {
        id_sale: id_sale,
        datePickUp: datePickUp,
        description: description,
      },
      this.HttpUploadOptions
    );
  }

  REJECT(id_sale: string, description: string): Observable<any> {
    return this.http.post(
      `${environment.hostname}/sale/reject`,
      {
        id_sale: id_sale,
        description: description,
      },
      this.HttpUploadOptions
    );
  }
}
