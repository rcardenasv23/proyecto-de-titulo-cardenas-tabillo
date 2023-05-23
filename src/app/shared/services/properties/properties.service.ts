import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class PropertiesService {
  HttpUploadOptions = {
    headers: new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
      "Content-Type": "application/json",
    }),
  };

  constructor(private http: HttpClient) {}

  GETPUBLICATIONPROPERTIES(): Observable<any> {
    return this.http.get(
      `${environment.hostname}/info/publication-properties`,
      this.HttpUploadOptions
    );
  }
  GETCONTENTSTATE(): Observable<any> {
    return this.http.get(
      `${environment.hostname}/info/content-state`,
      this.HttpUploadOptions
    );
  }
}
