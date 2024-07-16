import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service"
import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private prisma : PrismaService){
    super({
      jwtFromRequest:
      ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:'somesecret'
    })
    console.log("The prisma we imported : ",this.prisma)
  }
  
  async validate(payload:{sub:number,email:string}){
      
    console.log("payload sub:",payload.sub);

    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      }
    })

    delete user.hash;
    // return userinfo;

    return user
  }

}