import { Publication } from "./publication";
import { ContentState } from "./content_state";
import { File } from "./file";
import { Buyer } from "./buyer";
import { Seller } from "./seller";

export interface SellerSaleDetails {
  id_sale: string;
  id_seller: Seller["id_seller"];
  buyer: Buyer;
  sale_file: File | undefined;
  fixeds: any; // formatte { {id_fixed}:quantity.... }
  publications: Array<Publication>;
  sale_state: ContentState;
  total: number;
  created_at: Date;
  updated_at: Date;
}
