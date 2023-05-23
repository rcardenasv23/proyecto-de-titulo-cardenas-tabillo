import { Component, OnInit } from "@angular/core";
import { User } from "../../models/user";
import { AuthService } from "../../services/authService/auth.service";
import { BaseInfoService } from "../../../shared/services/baseInfoService/base-info.service";
import { Region } from "../../models/region";
import { PublicationService } from "../../../shared/services/publication/publication.service";
import { Publication } from "../../models/publication";
import { Router } from "@angular/router";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.scss"],
})
export class MapComponent implements OnInit {
  map: any;
  user!: User;
  logged = false;
  regions!: Array<Region>;
  publications: Array<Publication> = [];

  constructor(
    private auth: AuthService,
    private infoService: BaseInfoService,
    private pubService: PublicationService,
    private router: Router
  ) {
    this.auth.GETUSER().subscribe({
      next: (res) => {
        this.logged = true;
        this.user = res.data;
      },
    });
    this.infoService.GETCOUNTRYINFO().subscribe({
      next: (res) => {
        this.regions = res.data.regions;
      },
    });
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map = new google.maps.Map(
            document.getElementById("google") as HTMLElement,
            {
              center: pos,
              zoom: 12,
            }
          );
          this.infoService.GETMAPSLOCATION(pos.lat, pos.lng).subscribe({
            next: (res) => {
              for (let region of this.regions) {
                if (
                  region.region.includes(
                    res.results[res.results.length - 2].formatted_address.split(
                      ","
                    )[0]
                  )
                ) {
                  this.pubService
                    .GETPUBLICATIONSBYREGION(region.id_region)
                    .subscribe({
                      next: (res) => {
                        this.publications = res.data;
                        for (let publication of this.publications) {
                          let mark = new google.maps.Marker({
                            position: {
                              lat: publication.address.lat,
                              lng: publication.address.lng,
                            },
                            map: this.map,
                            title: publication.title,
                            clickable: true,
                          });
                          mark.addListener("click", () => {
                            this.router.navigate([
                              "/user/publication",
                              publication.id_fixed,
                            ]);
                          });
                        }
                      },
                    });
                }
              }
            },
          });
          new google.maps.Marker({
            position: pos,
            map: this.map,
            title: "Tu Posición",
          });
        }
      );
    }
  }

  setMapCurrent() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          let pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.map = new google.maps.Map(
            document.getElementById("google") as HTMLElement,
            {
              center: pos,
              zoom: 12,
            }
          );
          this.infoService.GETMAPSLOCATION(pos.lat, pos.lng).subscribe({
            next: (res) => {
              for (let region of this.regions) {
                if (
                  region.region.includes(
                    res.results[res.results.length - 2].formatted_address.split(
                      ","
                    )[0]
                  )
                ) {
                  this.pubService
                    .GETPUBLICATIONSBYREGION(region.id_region)
                    .subscribe({
                      next: (res) => {
                        this.publications = res.data;
                        for (let publication of this.publications) {
                          let mark = new google.maps.Marker({
                            position: {
                              lat: publication.address.lat,
                              lng: publication.address.lng,
                            },
                            map: this.map,
                            title: publication.title,
                          });
                          mark.addListener("click", () => {
                            this.router.navigate([
                              "/user/publication",
                              publication.id_fixed,
                            ]);
                          });
                        }
                      },
                    });
                }
              }
            },
          });
          new google.maps.Marker({
            position: pos,
            map: this.map,
            title: "Tu Posición",
          });
        }
      );
    }
  }

  setMapDir() {
    this.map = new google.maps.Map(
      document.getElementById("google") as HTMLElement,
      {
        center: { lat: this.user.address.lat, lng: this.user.address.lng },
        zoom: 12,
      }
    );
    let region: Region = this.user.address.region as Region;
    this.pubService.GETPUBLICATIONSBYREGION(region.id_region).subscribe({
      next: (res) => {
        this.publications = res.data;
        for (let publication of this.publications) {
          let mark = new google.maps.Marker({
            position: {
              lat: publication.address.lat,
              lng: publication.address.lng,
            },
            map: this.map,
            title: publication.title,
          });
          mark.addListener("click", () => {
            this.router.navigate(["/user/publication", publication.id_fixed]);
          });
        }
      },
    });
    new google.maps.Marker({
      position: { lat: this.user.address.lat, lng: this.user.address.lng },
      map: this.map,
      title: "Tu Direccion",
    });
  }
}
