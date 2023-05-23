import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class BaseInfoService {
  HttpUploadOptions = {
    headers: new HttpHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS,DELETE,PUT",
      "Content-Type": "application/json",
    }),
  };
  constructor(private http: HttpClient) {}

  GETCOUNTRYINFO(): Observable<any> {
    return this.http.get(
      `${environment.hostname}/info/country`,
      this.HttpUploadOptions
    );
  }

  GETMAPSLOCATION(lat: number, lng: number): Observable<any> {
    return this.http.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyDWeeCXLMG9lev4NdH_0seo-6CxgpG1Mec&language=es-419`
    );
  }

  GETHOMEINFO(): Observable<any> {
    return this.http.get(
      `${environment.hostname}/publication/home`,
      this.HttpUploadOptions
    );
  }
}
