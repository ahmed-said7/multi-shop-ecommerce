export class AddToCartDto {
  shopId: string;
  itemId: string;
  quantity: number;
  sizes?: string;
  colors?: string;
}
