import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

// User Document
export type UserDocument = User & Document;

@Schema()
export class User {
  @ApiProperty({
    example: 'test1@test.com',
    description: 'The email address of the user',
  })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ example: 'password123', description: 'The user password' })
  @Prop({ required: true })
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @Prop()
  name: string;

  @ApiProperty({
    example: 'Brand X',
    description: 'The brand associated with the user',
  })
  @Prop()
  brand: string;

  @ApiProperty({
    example: '0x1234567890',
    description: 'The account address of the user',
  })
  @Prop()
  address: string;

  @ApiProperty({
    type: [String],
    example: ['location1', 'location2'],
    description: 'Array of location IDs that the user is charged with',
  })
  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Location' })
  charged_locations: MongooseSchema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Brand Document
export type BrandDocument = Brand & Document;

@Schema()
export class Brand {
  @Prop({ required: true })
  name: string;

  @Prop()
  logo_image: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Location' })
  locations: MongooseSchema.Types.ObjectId[];

  @Prop({ type: [String] })
  code_list: string[];
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

// Product Document
export type ProductDocument = Product & Document;

@Schema()
export class Product {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop({ required: true })
  code: string;

  @Prop({ type: Map, of: Number })
  material: Record<string, number>;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Location Document
export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  x_cor: string;

  @Prop()
  y_cor: string;

  @Prop({ type: Map, of: Number })
  item_list: Record<string, number>;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  charged_users: MongooseSchema.Types.ObjectId;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

// Deposit Document
export type DepositDocument = Deposit & Document;

@Schema()
export class Deposit {
  @Prop({ required: true })
  charged_user: string;

  @Prop()
  confirm_user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  source_location: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  dest_location: MongooseSchema.Types.ObjectId;

  @Prop({ type: Map, of: Number })
  items: Record<string, number>;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;

  // 이런 건 원칙적으로는 enum을 적용하는 편이 좋음.
  @Prop()
  status: string;
}

export const DepositSchema = SchemaFactory.createForClass(Deposit);

// Logistics Document
export type LogisticsDocument = Logistics & Document;

@Schema()
export class Logistics {
  @Prop({ required: true })
  charged_user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  source_location: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Location' })
  dest_location: MongooseSchema.Types.ObjectId;

  @Prop({ type: Map, of: Number })
  items: Record<string, number>;

  @Prop()
  transportation_methods: string;

  @Prop()
  distance: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const LogisticsSchema = SchemaFactory.createForClass(Logistics);
