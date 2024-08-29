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

export enum DepositStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

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
  @Prop({ type: String, enum: DepositStatus, default: DepositStatus.Pending })
  status: DepositStatus;
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

export type ReportDocument = Report & Document;

@Schema()
export class Report {
  @ApiProperty({
    example: 'Report Title',
  })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    example: 'Report Description',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({
    example: '1234-567890',
  })
  @Prop({ required: true })
  num: string;

  @ApiProperty({
    example: '2024',
  })
  @Prop({ default: '2024' })
  year: string;

  @ApiProperty({
    example: '당사는 지속 가능한 경영을 위해 환경 정책과 이니셔티브를 강화하고 있습니다. 탄소 발자국 감소, 에너지 효율성 향상, 재생 에너지 사용 확대 등을 통해 환경에 미치는 영향을 최소화하고 있습니다.',
  })
  @Prop()
  eco_report: string;

  @ApiProperty({
    example: '당사는 지속 가능한 경영을 위해 사회적 책임을 다하고 있습니다. 고객, 공급망, 지역사회와의 협력을 통해 사회적 가치를 창출하고 있습니다. 또한, 공정한 경영과 윤리적 경영을 위해 노력하고 있습니다.',
  })
  @Prop()
  social_report: string;

  @ApiProperty({
    example: '당사의 운영은 투명성, 책임성, 윤리적 경영을 바탕으로 하고 있습니다. 모든 이해관계자의 이익을 보호하기 위해 견고한 지배구조를 유지하고 있습니다.',
  })
  @Prop()
  gov_report: string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
