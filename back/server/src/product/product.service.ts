import { faker } from '@faker-js/faker';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/schema/schema';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async onModuleInit() {
    await this.mockingProducts();
  }

  async mockingProducts() {
    const isExist = await this.productModel.find().exec();
    if (isExist.length) {
      return;
    }

    const products = [];
    const productTypes = [
      'clothes',
      'socks',
      'pants',
      'skirts',
      't-shirts',
      'shoes',
      'jackets',
      'hats',
      'gloves',
      'scarves',
    ];

    const materials = [
      'cotton',
      'polyester',
      'wool',
      'nylon',
      'silk',
      'leather',
      'denim',
      'linen',
      'spandex',
      'rayon',
    ];

    for (let i = 0; i < 100; i++) {
      const type = faker.helpers.arrayElement(productTypes);

      const name = `${type}${i + 1}`;
      const image = `${type}${i + 1}`;

      const code = faker.string.uuid();

      const selectedMaterials = faker.helpers.arrayElements(materials, {
        min: 1,
        max: 3,
      });
      const materialPercentages = this.generateMaterialPercentages(
        selectedMaterials.length,
      );

      const material: Record<string, number> = {};
      selectedMaterials.forEach((mat, index) => {
        material[mat] = materialPercentages[index];
      });

      const product: Partial<Product> = {
        type,
        name,
        image,
        code,
        material,
      };

      try {
        const createdProduct = await this.productModel.create(product); // Create product
        products.push(createdProduct);
      } catch (error) {
        console.error(`Error creating product ${name}: ${error.message}`);
      }
    }

    console.log('20개의 제품 데이터가 생성되었습니다.');
    return products;
  }

  private generateMaterialPercentages(count: number): number[] {
    const percentages = Array(count).fill(0);
    let total = 100;

    for (let i = 0; i < count - 1; i++) {
      percentages[i] = faker.number.int({
        min: 1,
        max: total - (count - i - 1),
      });
      total -= percentages[i];
    }

    percentages[count - 1] = total;
    return percentages;
  }
}
