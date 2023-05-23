export interface File {
  id_file: string | null | undefined;
  url: string;
  name: string;
  extensions: Array<string> | [];
  width: number | null | undefined;
  height: number | null | undefined;
}
