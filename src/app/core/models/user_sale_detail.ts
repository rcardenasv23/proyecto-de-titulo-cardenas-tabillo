import { User } from "./user";
import { Publication } from "./publication";
import { ContentState } from "./content_state";
import { Store } from "./store";
import { File } from "./file";

export interface UserSaleDETAIL {
  id_sale: string;
  store: Store;
  id_user: User["id_user"];
  sale_file: File | undefined;
  fixeds: any; // formatte { {id_fixed}:quantity.... }
  publications: Array<Publication>;
  sale_state: ContentState;
  total: number;
  created_at: Date;
  updated_at: Date;
}
