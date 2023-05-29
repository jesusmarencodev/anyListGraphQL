import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthResponse } from './types/auth-response.type';
import { SigningInput, SignupInput } from './dto/inputs';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse, { name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'signing' })
  async login(
    @Args('signingInput') signingInput: SigningInput,
  ): Promise<AuthResponse> {
    return this.authService.login(signingInput);
  }

  /*   @Query(  , {name:'revalidate'})
  revalidateToken(

  ):Promise<void>{
    return this.authService.revalidateToken();
  }  */
}
