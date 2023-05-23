import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Seller } from "../../../../../core/models/seller";
import { Publication } from "../../../../../core/models/publication";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PublicationService } from "../../../../../shared/services/publication/publication.service";
import * as uuid from "uuid";
import { FileService } from "../../../../../shared/services/files/file.service";
import { File } from "../../../../../core/models/file";

@Component({
  selector: "app-media-form",
  templateUrl: "./media-form.component.html",
  styleUrls: ["./media-form.component.scss"],
})
export class MediaFormComponent implements OnInit {
  @Input() publication: Publication | undefined;
  @Input() seller: Seller | undefined;
  @Output("revalidate") revalidate: EventEmitter<void> =
    new EventEmitter<void>();

  loading = false;
  media: Array<any> = [];
  mediaControl: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private publicationService: PublicationService,
    private fileService: FileService
  ) {
    this.mediaControl = new FormGroup({
      media: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {}

  loadMedia(event: any) {
    let files = event.target.files;
    this.media = [];
    for (let i = 0; i < files.length; i++) {
      let reader = new FileReader();
      reader.readAsDataURL(files[i]);
      reader.onloadend = async () => {
        this.media.push(reader.result);
      };
    }
  }

  deletemedia(i: number): void {
    this.media = [
      ...this.media.slice(0, i),
      ...this.media.slice(i + 1, this.media.length),
    ];
  }

  async handleAdd() {
    this.loading = true;
    let mediaInput: any = document.getElementById("files");
    if (this.media.length + mediaInput.files?.length > 15) {
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Máximo 15 archivos por publicación",
        panelClass: "snack-bar-error",
      });
      return;
    }
    const urls = [];
    for (let url of this.media) {
      let name = uuid.v4();
      let urlFirebase = await this.fileService.UPLOADPUBLICATIONFILE(
        this.seller?.id_seller + "/" + name,
        url
      );
      urls.push({
        extensions: [],
        height: undefined,
        id_file: undefined,
        width: undefined,
        url: urlFirebase as string,
      });
    }
    this.publicationService
      .ADDFILESPUBLICATION(urls, this.publication?.id_fixed as string)
      .subscribe({
        next: (res) => {
          this.revalidate.emit();
        },
        error: () => {
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al agregar archivos",
            panelClass: "snack-bar-error",
          });
        },
        complete: () => {
          this.loading = false;
          this.mediaControl.reset();
          this.media = [];
        },
      });
  }

  handleDelete(file: File) {
    this.loading = true;
    if (this.publication?.files.length === 1) {
      this.snackBar.openFromComponent(ErrorSnackBarComponent, {
        data: "Error al eliminar archivo, mínimo debe existir un archivo por publicación",
        panelClass: "snack-bar-error",
      });
      this.loading = false;
    } else {
      this.publicationService.DELETEFILEPUBLICATION(file.id_file!).subscribe({
        next: async (res) => {
          try {
            await this.fileService.DELETEPUBLICATIONFILE(
              file.url.split("o/")[1].split("?")[0].split("%2F").join("/")
            );
            this.revalidate.emit();
          } catch (e) {
            console.log(e);
          }
        },
        error: (err) => {
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al eliminar archivo, por favor intente nuevamente",
            panelClass: "snack-bar-error",
          });
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
