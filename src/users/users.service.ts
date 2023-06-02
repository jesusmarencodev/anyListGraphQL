import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { NotFoundException } from '@nestjs/common';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(signupInput: SignupInput): Promise<User> {
    try {
      return await this.usersRepository.save({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10),
      });
    } catch (error) {
      this.handlerDBErrors(error);
    }
  }

  async findAll(
    roles: ValidRoles[],
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<User[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.usersRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset);

    if (search) {
      queryBuilder.andWhere('LOWER(full_name) like :full_name', {
        full_name: `%${search.toLowerCase()}%`,
      });
    }

    if (!roles.length) return queryBuilder.getMany();

    return queryBuilder
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not fount`);
    }
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneByOrFail({ id });
      return user;
    } catch (error) {
      throw new NotFoundException(`${id} not fount`);
    }
  }

  async updateUser(
    id: string,
    updateUserInput: UpdateUserInput,
    updatedBy: User,
  ): Promise<User> {
    try {
      const user = await this.usersRepository.preload({
        id,
        ...updateUserInput,
        lastUpdateBy: updatedBy,
      });

      return await this.usersRepository.save(user);
    } catch (error) {
      this.handlerDBErrors(error);
    }
  }

  async blockUser(id: string, user: User): Promise<User> {
    const userToBlock = await this.findById(id);
    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = user;

    return await this.usersRepository.save(userToBlock);
  }

  private handlerDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}
