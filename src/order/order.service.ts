import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument } from './schemas/order_schema';
import { User, UserDocument, UserRole } from 'src/user/schemas/user_schema';
import { Shop, ShopDocument } from 'src/shop/schemas/shop_schema';
import { Cart } from 'src/cart/schemas/cart.schema';
import { CouponService } from 'src/coupon/coupon.service';
import { IAuthUser, OrderStatusTypes } from 'src/common/enums';
import { CartService } from 'src/cart/cart.service';
import { Item, ItemDocument } from 'src/item/schemas/item-schema';
import { QueryOrderDto } from './dto/order-query.dto';
import { ApiService } from 'src/common/filter/api.service';
import { Model } from 'mongoose';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    @InjectModel(Shop.name)
    private readonly shopModel: Model<ShopDocument>,
    @InjectModel(Cart.name)
    private readonly cartModel: Model<Cart>,
    private readonly couponService: CouponService,
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
    private cartService:CartService,
    private apiService: ApiService<OrderDocument,QueryOrderDto>
  ) {};
  private orderItems(items:any,price:number,body:CreateOrderDto){
    body.priceTotal=price;
    body.carItems=items.map((item)=>{
      const { color , size , quantity ,itemId:{_id} }=item;
      return { product:_id,color,size,quantity };
    })
  };
  async create(userId: string, createOrderDto: CreateOrderDto) {
      const { shopId, couponName } = createOrderDto;
      const shop = await this.shopModel.findById(shopId);
      if (!shop) {
        throw new NotFoundException("This shop doesn't exist");
      };
      if( couponName ){
        const { items , finalPrice }=await this.couponService.applyCoupon(userId,{shopId,text:couponName});
        this.orderItems(items,finalPrice,createOrderDto);
      }else{
        const { totalPrice , items }=await this.cartService.getCart(userId,shopId);
        this.orderItems(items,totalPrice,createOrderDto);
      };
      const order = await this.orderModel.create({
        ...createOrderDto,
        userId,
        status: OrderStatusTypes.INPROGRESS
      });

      await this.cartModel.deleteMany({ userId, shopId });

      const promises=order.carItems.map((item)=>{
        return this.itemModel.findByIdAndUpdate(
          item.product,{
            $inc: { soldTimes : item.quantity , amount: item.quantity*-1 }
          }
        )
      });

      await Promise.all(promises);

      // Clear the user'suserId: string, shopId: string, couponName: string, applyCoupon: applyCouponme: string, applyCoupon: applyCouponMany({ userId, shopId });

      return { order };
  }

  async findAllShopOrder( query:QueryOrderDto, user:IAuthUser ) {
    
    if( user.role == UserRole.USER ){
      query.userId=user._id;
    }
    
    else if( user.role == UserRole.MERCHANT ){
      query.shopId=user.shopId;
    };

    let {query:result,paginationObj}=await this.apiService.getAllDocs(this.orderModel.find(),query);
    
    result=result
      .populate({ path:"carItems.product",select:"name price images" });
    
    if( user.role != UserRole.USER ){
      result=result.populate({ path:"userId",select:"name email"});
    };
    
    const orders=await result;
    
    if( orders.length == 0  ){
      throw new HttpException("orders not found",400);
    };
    
    return { orders , pagination : paginationObj };
  
  }

  async findOne(id: string,user:IAuthUser) {
    let filter={}
    if( user.role == UserRole.MERCHANT ){
        filter={ shopId:user.shopId };
    }else if( user.role == UserRole.USER ){
        filter={ userId:user._id };
    };
    let order= await this.orderModel.findOne({ _id:id , ... filter })
      .populate({ path:"carItems.product",select:"name price images" });
    if( user.role != UserRole.USER && order ){
      order.populate({ path:"userId",select:"name email"})
    };
    if(!order){
      throw new HttpException("Order not found",400);
    };
    return { order };
  }

  // only admin or merchant
  async remove(id: string) {
      const order = await this.orderModel.findByIdAndDelete(id);
      if( ! order ){
        throw new HttpException("order not found",400);
      };
      return order;
  }
  
  // only admin or merchant
  async confimeDelivery(id: string,user:IAuthUser ) {
    const order=await this.orderModel.findOneAndUpdate({ _id:id  }, {
      status: OrderStatusTypes.DELIVERED,
      },{new:true});
    if(!order){
      throw new HttpException("order not found",400);
    };
    return { order };
  }
  
  // only admin or merchant
  async confimePaid(id: string ,user:IAuthUser) {
    const order=await this.orderModel.findOneAndUpdate({ _id:id }, {
      paid:true,
      },{new:true});
    if(!order){
      throw new HttpException("order not found",400);
    };
    return { order };
  }

}
