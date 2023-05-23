import { Address } from "./address";
import { File } from "./file";

export interface User {
  id_user: string | undefined;
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_password: string;
  created_at: Date;
  address: Address;
  seller: boolean;
  file: Array<File> | [] | null;
}
