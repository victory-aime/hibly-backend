import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/services';
import { UserCreateDto } from './users.dto';
import { CompanyService } from '../../services/company/company.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly companyService: CompanyService,
  ) {}

  async findUser(id?: string, email?: string) {
    if (!id && !email) return { user: null };

    const user = await this.prisma.user.findFirst({
      where: email ? { email } : { id },
      include: {
        companyRole: {
          select: {
            name: true,
            baseRole: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { user };
  }

  async createUser(data: UserCreateDto): Promise<{ message: string }> {
    const { email, company } = data;

    const existingUser = await this.findUser(undefined, email);
    if (existingUser.user) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const existingCompany = await this.companyService.findCompany(company.name);
    if (existingCompany) {
      throw new BadRequestException('Cette entreprise existe déjà');
    }

    await this.prisma.$transaction(async (tx) => {
      const newCompany = await this.companyService.createCompany(company);

      await tx.user.create({
        data: {
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          country: data.country,
          companyId: newCompany.id,
          poste: 'DEVELOPER',
          isActive: true,
          emailVerified: true,
          nationality: 'Française',
        },
      });
    });

    return { message: 'successfully' };
  }
}
