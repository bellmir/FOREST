import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Location,
  LocationSchema,
  Product,
  ProductSchema,
} from '../schema/schema';
import { ProductService } from './product.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Location.name,
        schema: LocationSchema,
      },
    ]),
  ],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
