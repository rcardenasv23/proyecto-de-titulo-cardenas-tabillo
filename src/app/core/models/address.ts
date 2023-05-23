import { Commune } from "./commune";
import { Region } from "./region";

export interface Address {
  id_address: string | undefined;
  address: string;
  lat: number;
  lng: number;
  description: string | undefined;
  commune: Commune | string;
  region: Region | string;
}
