import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { SigningInput, SignupInput } from './dto/inputs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    console.log(signupInput);

    const user = await this.usersService.create(signupInput);
    return {
      token: this.getJwtToken(user.id),
      user,
    };
  }

  async login(signingInput: SigningInput): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(signingInput.email);
    if (!bcrypt.compareSync(signingInput.password, user.password)) {
      throw new BadRequestException('Email / password do not match');
    }
    return {
      token: this.getJwtToken(user.id),
      user,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findById(id);
    if (!user.isActive) throw new UnauthorizedException(`user is inactive`);

    delete user.password;
    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJwtToken(user.id);
    return {
      user,
      token,
    };
  }

  getJwtToken(id: string) {
    return this.jwtService.sign({ id });
  }
}
