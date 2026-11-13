import { SetMetadata } from "@nestjs/common";
import { TipoRol } from "../../rol/entities/rol.entity.js";

export const ROLES_KEY = "roles"
export const Roles = (roles: TipoRol[]) => SetMetadata(ROLES_KEY, roles)