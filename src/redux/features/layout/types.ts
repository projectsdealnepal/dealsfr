type ValuesArray = [number, number, number] | [number, number, number, number];

export interface LayoutItem {
  id: number;
  name: string;
  array: ValuesArray;
}

export interface LayoutCreatePayload {
  name: string;
  array: ValuesArray;
}

