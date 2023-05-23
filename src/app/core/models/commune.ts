import { Region } from "./region";

export interface Commune {
  id_commune: string;
  id_region: Region["id_region"];
  commune: string;
}
