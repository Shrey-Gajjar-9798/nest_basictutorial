import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";


export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma:PrismaService){
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey:'somesecret'
    })
    
  }

    async validate(payload:{sub:number,email:string}){
      
      console.log("payload sub:",payload.sub);

      const user = await this.prisma.user.findUnique({
        where:{
          email:payload.email,
        }
      })

      // // delete user.hash;
      // return userinfo;

      return user
    }

}