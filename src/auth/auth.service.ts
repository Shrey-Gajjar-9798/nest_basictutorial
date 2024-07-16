import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDTO } from "src/dto";
import * as argon from "argon2"
import { PrismaService } from "src/prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";

@Injectable({})
export class AuthService {
  
  constructor(private prisma:PrismaService, private jwt:JwtService ){}

  async signup(dto: AuthDTO){

    try {
      //generate the password hash
      const hash = await argon.hash(dto.password)
      
      //store the user in db
      const user = await this.prisma.user.create({
        data: {
          email:dto.email,
          hash,
        }
      })
      return this.signToken(user.id,user.email);
    } catch (error) {
      if(error instanceof PrismaClientKnownRequestError){
        if(error.code === 'P2002') {
          throw new ForbiddenException("Credential taken")
        }
      }
      throw error;
    }

  }

  async signin(dto: AuthDTO){

    //check the user exist or not 
    const user = await this.prisma.user.findUnique({
      where:{
        email:dto.email,
      }
    })

    if(!user){
      throw new ForbiddenException("User not found!")
    }
    //match user password
    const pwmatches = await argon.verify(user.hash, dto.password)
    if(!pwmatches){
      throw new ForbiddenException("INvalid Credential !");
    }

    //return user
    return this.signToken(user.id,user.email);
  }

  async signToken(userId:number,email:string):Promise<{ access_token: string}>{
    const payload = {
      sub:userId,
      email
    }

    const token = await this.jwt.signAsync(payload, {
      expiresIn:"15m",
      secret:"somesecret"
    })

    return {
      access_token: token,
    };
  }
}