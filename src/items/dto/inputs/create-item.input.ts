import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsPositive, IsOptional } from 'class-validator';

@InputType()
export class CreateItemInput {
  @Field(() => String, { description: 'Product name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  category: string;

  /*  @Field(() => Float)
  @IsNotEmpty()
  @IsPositive()
  quantity: number; */

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
