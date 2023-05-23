export interface Comment {
  id_comment: string | undefined;
  comment: string;
  user: { first_name: string; last_name: string };
}
