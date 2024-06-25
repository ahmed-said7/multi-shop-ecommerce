export class CreateItemDto {
  name: string;
  price: number;
  amount: number;
  description: string;
  category: string[];
  brand?: string;
  sizes?: string[];
  images?: string[];
  colors?: string[];
  soldTimes?: number;
}
