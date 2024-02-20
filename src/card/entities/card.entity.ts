export interface Card {
  spaceID: string;
  id: string;
  type: string;
  name: string;
  parentCardID: string | null;
  attributes: { [key: string]: string | number | boolean | null };
}
