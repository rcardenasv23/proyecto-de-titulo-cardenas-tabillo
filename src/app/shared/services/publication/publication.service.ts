import { Injectable } from "@angular/core";
import { AuthService } from "../../../core/services/authService/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { Publication } from "../../../core/models/publication";
import { Address } from "../../../core/models/address";

@Injectable({
  providedIn: "root",
})
export class PublicationService {
  HttpUploadOptions: { headers: HttpHeaders };

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

  POSTPUBLICATION(publication: Publication): Observable<any> {
    return this.http.post(
      `${environment.hostname}/publication`,
      publication,
      this.HttpUploadOptions
    );
  }

  POSTPUBLICATIONCOMMENT(
    id_user: string,
    id_fixed: string,
    comment: string
  ): Observable<any> {
    return this.http.post(
      `${environment.hostname}/publication/comment`,
      { id_user, id_fixed, comment },
      this.HttpUploadOptions
    );
  }

  GETPUBLICATIONSBYSELLER(id_seller: string): Observable<any> {
    return this.http.get(`${environment.hostname}/publication/seller`, {
      ...this.HttpUploadOptions,
      params: { id_seller: id_seller },
    });
  }

  GETPUBLICATION(id_publication: string): Observable<any> {
    return this.http.get(`${environment.hostname}/publication`, {
      ...this.HttpUploadOptions,
      params: { id_fixed: id_publication },
    });
  }

  COMMENTPERMISSION(id_user: string, id_publication: string): Observable<any> {
    return this.http.get(`${environment.hostname}/publication/can-comment`, {
      ...this.HttpUploadOptions,
      params: { id_user: id_user, id_fixed: id_publication },
    });
  }

  GETPUBLICATIONS(filters: any): Observable<any> {
    return this.http.get(`${environment.hostname}/publication/all`, {
      ...this.HttpUploadOptions,
      params: filters,
    });
  }

  GETPUBLICATIONSBYREGION(id_region: string): Observable<any> {
    return this.http.get(`${environment.hostname}/publication/region`, {
      ...this.HttpUploadOptions,
      params: { id_region: id_region },
    });
  }

  GETPUBLICATIONSBYID(ids: string[]): Observable<any> {
    return this.http.post(
      `${environment.hostname}/publication/stocks`,
      { ids },
      this.HttpUploadOptions
    );
  }

  UPDATEPUBLICATION(publication: Publication): Observable<any> {
    return this.http.put(
      `${environment.hostname}/publication`,
      {
        publication: publication,
      },
      this.HttpUploadOptions
    );
  }

  OPENPUBLICATION(id_fixed: string): Observable<any> {
    return this.http.put(
      `${environment.hostname}/publication/enable`,
      {
        id_fixed: id_fixed,
      },
      this.HttpUploadOptions
    );
  }

  REACTIVATEPUBLICATION(id_fixed: string): Observable<any> {
    return this.http.post(
        `${environment.hostname}/publication/repeat`,
        {
          id_fixed: id_fixed,
        },
        this.HttpUploadOptions
    );
  }

  CLOSEPUBLICATION(id_fixed: string): Observable<any> {
    return this.http.put(
      `${environment.hostname}/publication/disable`,
      {
        id_fixed: id_fixed,
      },
      this.HttpUploadOptions
    );
  }

  UPDATEADDRESS(address: Address): Observable<any> {
    return this.http.put(
      `${environment.hostname}/publication/address`,
      {
        address: address,
      },
      this.HttpUploadOptions
    );
  }

  DELETEFILEPUBLICATION(id_file: string): Observable<any> {
    return this.http.delete(`${environment.hostname}/publication/file`, {
      ...this.HttpUploadOptions,
      params: { id_file: id_file },
    });
  }

  ADDFILESPUBLICATION(files: Array<any>, id_fixed: string): Observable<any> {
    return this.http.post(
      `${environment.hostname}/publication/file`,
      {
        files,
        id_fixed: id_fixed,
      },
      this.HttpUploadOptions
    );
  }
}
