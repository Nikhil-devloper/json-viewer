export interface JsonData {
  [key: string]: string | number | boolean | null | JsonData | JsonData[] | string[];
} 