export class AddToCartDto {
  readonly itemId: string;
  readonly quantity: number;
  readonly sizes?: string;
  readonly colors?: string;
}
