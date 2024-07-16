import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "src/dto";


@Controller('auth')

export class AuthController {
  constructor(private authservice:AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDTO ){
    return this.authservice.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto:AuthDTO){
    return this.authservice.signin(dto);
  }
}