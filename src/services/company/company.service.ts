import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/services';
import { CompanyDto } from './company.dto';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async findCompany(name?: string, id?: string) {
    return this.prisma.company.findFirst({
      where: name ? { name } : { id },
    });
  }

  async createCompany(companyDto: CompanyDto): Promise<{ id: string }> {
    const all_companies = await this.findCompany(companyDto.name);

    if (all_companies) {
      throw new BadRequestException('This company already exists');
    }
    const company = await this.prisma.company.create({
      data: companyDto,
    });
    return { id: company.id };
  }

  async deleteCompany(id: string) {}
}
