//Archivo de estrategia de autenticacion

//JwtStrategy es una estrategia de autenticacion basada en JWT,Esta construida usando Passport (middleware de autenticacion)

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { envs } from "src/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { UserService } from "../user/user.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        //userService inyecta el servicio de usuarios para realizar consultas a la DB
        super({
            //jwtFromRequest, especifica como extraer el token de la solicitud
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),   //Se usa para extraer el token del header de la solicitud
            ignoreExpiration: false,   //Indica que no se debe ignorar la expiracion del token, si caduco, sera rechazado
            secretOrKey: envs.JWT_SECRET,   //Se para firmar y verificar el token
        });
    }

    
    /**
     * Este metodo se encarga de validar el token
     * @param payload 
     * @returns 
     */
    async validate(payload: JwtPayload) {
        //Buscamos el usuario por email del payload
        const user = await this.userService.findByEmail(payload.email);

        //Si el usuario no existe, devolvemos una excepcion
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        //Devolvemos el usuario
        return user;
    }
}