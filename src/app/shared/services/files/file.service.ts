import { Injectable } from "@angular/core";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { environment } from "src/environments/environment";

firebase.initializeApp(environment.firebase);

@Injectable({
  providedIn: "root",
})
export class FileService {
  storageRef = firebase.app().storage().ref();

  constructor() {}

  async UPLOADPUBLICATIONFILE(nombre: string, imgBase64: any) {
    try {
      let file = await this.storageRef
        .child("publication/" + nombre)
        .putString(imgBase64, "data_url");
      return await file.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return console.log("error");
    }
  }
  async DELETEPUBLICATIONFILE(url: string) {
    try {
      await this.storageRef.child(url).delete();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
  async UPLOADUSERFILE(nombre: string, imgBase64: any) {
    try {
      let file = await this.storageRef
        .child("user/" + nombre)
        .putString(imgBase64, "data_url");
      return await file.ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      return console.log("error");
    }
  }
  async DELETEUSERFILE(url: string) {
    try {
      await this.storageRef.child(url).delete();
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
