import { applyDecorators, UseGuards } from "@nestjs/common";
import { TipoRol } from "../../rol/entities/rol.entity.js";
import { Roles } from "./roles.decorator.js";
import { AuthGuard } from "../guards/auth.guard.js";
import { RolesGuard } from "../guards/roles.guard.js";

export function Auth(roles: TipoRol[]){
    return applyDecorators(
        Roles(roles),
        UseGuards(AuthGuard, RolesGuard)
    )
}