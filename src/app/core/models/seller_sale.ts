import { User } from "./user";
import { ContentState } from "./content_state";
import { Buyer } from "./buyer";

export interface SellerSale {
  id_sale: string;
  buyer: Buyer;
  id_user: User["id_user"];
  fixeds: Object; // formatte { {id_fixed}:quantity.... }
  sale_state: ContentState;
  total: number;
  created_at: Date;
  updated_at: Date;
}
