import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { User } from "../../../../../core/models/user";
import { PublicationService } from "../../../../../shared/services/publication/publication.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SucceedSnackbarComponent } from "../../../../../shared/components/snack-bar/succeed-snackbar/succeed-snackbar.component";
import { ErrorSnackBarComponent } from "../../../../../shared/components/snack-bar/error-snack-bar/error-snack-bar.component";
import { Comment } from "../../../../../core/models/comment";

declare var bootstrap: any;

@Component({
  selector: "app-comments",
  templateUrl: "./comments.component.html",
  styleUrls: ["./comments.component.scss"],
})
export class CommentsComponent implements OnInit {
  @Input() user: User | undefined;
  @Input() id_fixed!: string | undefined;
  @Input() canComment!: boolean;
  @Input() comments!: Array<Comment>;
  @Output("revalidate") revalidate: EventEmitter<void> =
    new EventEmitter<void>();

  commentForm: FormGroup;
  index: number = 0;
  constructor(
    private pubService: PublicationService,
    private snackBar: MatSnackBar
  ) {
    this.comments = [];
    this.commentForm = new FormGroup({
      comment: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {
    console.log(this.canComment);
  }

  nextComment() {
    this.index += 1;
  }

  previousComment() {
    this.index -= 1;
  }

  handleComment() {
    this.pubService
      .POSTPUBLICATIONCOMMENT(
        this.user?.id_user as string,
        this.id_fixed as string,
        this.commentForm.controls["comment"].value
      )
      .subscribe({
        next: (res) => {
          let modal: any = document.getElementById("commentModal");
          let modalB = bootstrap.Modal.getInstance(modal);
          modalB.hide();
          this.snackBar.openFromComponent(SucceedSnackbarComponent, {
            data: "Comentado publicado exitosamente",
            panelClass: "snack-bar-success",
          });
          this.revalidate.emit(res.data.id_fixed);
        },
        error: (err) => {
          let modal: any = document.getElementById("commentModal");
          let modalB = bootstrap.Modal.getInstance(modal);
          modalB.hide();
          this.snackBar.openFromComponent(ErrorSnackBarComponent, {
            data: "Error al procesar la solicitud",
            panelClass: "snack-bar-error",
          });
        },
      });
  }
}
