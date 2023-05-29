import { Injectable } from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { User } from '../users/entities/user.entity';
import { SignupInput } from './dto/inputs/signup.input';
import { UsersService } from 'src/users/users.service';

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
}
