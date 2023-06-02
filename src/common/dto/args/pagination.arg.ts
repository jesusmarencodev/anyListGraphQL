/* eslint-disable prettier/prettier */
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  @IsOptional()
  offset = 0;

  @Field(() => Int, { nullable: true })
  @Min(1)
  @IsOptional()
  limit = 10;
}
