import { Address } from "./address";
import { File } from "./file";
import { ContentState } from "./content_state";
import { Comment } from "./comment";

export interface Publication {
  id_fixed: string | undefined;
  id_seller: string;
  title: string;
  description: string;
  dimentions: string;
  weight: string;
  closed_by_admin:boolean,
  category: string;
  unity: string;
  product_state: string;
  price: number;
  stock: number;
  content_state: ContentState | string | undefined;
  current_stock: number;
  address: Address;
  files: Array<File>;
  comments: Array<Comment>;
  created_at: Date;
}
