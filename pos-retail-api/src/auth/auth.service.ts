import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.pengguna.findUnique({
      where: { username: dto.username },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Username atau password salah');
    }

    if (user.status === 'nonaktif') {
      throw new UnauthorizedException('Akun tidak aktif');
    }

    const token = this.jwt.sign({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        nama: user.nama,
        username: user.username,
        role: user.role,
      },
    };
  }

  async getMe(userId: number) {
    return this.prisma.pengguna.findUnique({
      where: { id: userId },
      select: { id: true, nama: true, username: true, role: true, status: true },
    });
  }
}
