import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { TipoRol } from '../../rol/entities/rol.entity.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const roles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if(!roles){
      return true
    }

    const { user } = context.switchToHttp().getRequest()
    return user.roles.some((rol: string) => roles.includes(rol))

  }
}
