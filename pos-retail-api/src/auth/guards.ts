import { Injectable, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// Guard JWT - cek apakah request punya token valid
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// Decorator untuk menandai role yang diizinkan
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Guard Role - cek apakah user punya role yang sesuai
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required) return true;
    const { user } = context.switchToHttp().getRequest();
    return required.includes(user?.role);
  }
}
