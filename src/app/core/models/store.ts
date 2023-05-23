import { File } from "./file";

export interface Store {
  email: string;
  store_name: string;
  rut: string;
  phone: string;
  created_at: Date;
  file: Array<File> | undefined;
  bank_name: string;
  bank_account_name: string;
  bank_account_type: string;
  bank_account_address: string;
  bank_account_email: string;
  bank_account_rut: string;
}
