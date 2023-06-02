import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs, SearchArgs } from '../common/dto/args';

@Injectable()
export class ListsService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    try {
      const newList = this.listRepository.create({ ...createListInput, user });
      return await this.listRepository.save(newList);
    } catch (error) {
      this.handlerDBErrors(error);
    }
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const queryBuilder = this.listRepository
      .createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, { userId: user.id });

    if (search) {
      queryBuilder.andWhere('LOWER(name) like :name', {
        name: `%${search.toLowerCase()}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOneBy({
      id,
      user: { id: user.id },
    });
    if (!list) throw new NotFoundException(`List ${id} not found`);
    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    await this.findOne(id, user);
    const item = await this.listRepository.preload({
      ...updateListInput,
      user,
    });
    if (!item) throw new NotFoundException(`List ${id} not found`);
    return this.listRepository.save(item);
  }

  async remove(id: string, user: User): Promise<List> {
    const item = await this.findOne(id, user);

    await this.listRepository.remove(item);

    return { ...item, id };
  }

  private handlerDBErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Please check server logs');
  }

  async ListCountByUser(user: User): Promise<number> {
    return this.listRepository.count({
      where: {
        user: {
          id: user.id,
        },
      },
    });
  }
}
