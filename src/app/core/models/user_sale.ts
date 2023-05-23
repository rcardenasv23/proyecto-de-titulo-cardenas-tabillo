import { Seller } from "./seller";
import { User } from "./user";
import { Publication } from "./publication";
import { ContentState } from "./content_state";

export interface UserSale {
  id_sale: string;
  store: Seller;
  id_user: User["id_user"];
  fixeds: Object; // formatte { {id_fixed}:quantity.... }
  publications: Array<Publication>;
  sale_state: ContentState;
  total: number;
  created_at: Date;
  updated_at: Date;
}
