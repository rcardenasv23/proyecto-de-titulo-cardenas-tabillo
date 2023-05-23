import { File } from "./file";
import { Publication } from "./publication";

export interface Seller {
  id_user: string;
  id_seller: string | undefined;
  email: string;
  rut: string;
  store_name: string;
  phone: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_type: string;
  bank_account_address: string;
  bank_account_email: string;
  bank_account_rut: string;
  created_at: Date;
  file: Array<File> | [] | null;
  publications: Array<Publication> | [] | null;
}
