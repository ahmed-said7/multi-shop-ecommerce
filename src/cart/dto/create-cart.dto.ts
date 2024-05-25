export class CreateCartDto {
  itemId: string;
  shopId: string;
  /**The User who add the item to his cart */
  userId: string;
}

export class CreateCartItemDto extends CreateCartDto {
  /**The Item Quantity */
  quantity: number;

  sizes: string;

  colors: string;
}
