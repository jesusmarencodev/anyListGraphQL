import { Injectable, BadRequestException } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { SigningInput, SignupInput } from './dto/inputs';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    console.log(signupInput);

    const user = await this.usersService.create(signupInput);

    return {
      token: 'sajndjkasndj',
      user,
    };
  }

  async login(signingInput: SigningInput): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(signingInput.email);
    if (!bcrypt.compareSync(signingInput.password, user.password)) {
      throw new BadRequestException('Email / password do not match');
    }

    return {
      token: 'sajndjkasndj',
      user,
    };
  }
}
