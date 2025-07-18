import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Leave, Objective, Roles } from '@prisma/client';

// ✨ DTO pour une permission
export class PermissionDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

// ✨ DTO pour le rôle de l'utilisateur dans la société
export class CompanyRoleDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  baseRole: Roles;

  @IsArray()
  @ValidateNested({ each: true })
  permissions: PermissionDto[];
}

// ✨ DTO pour la compagnie
export class CompanyDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  logo: string;
}

export class UserDto {
  @IsNotEmpty()
  @IsString()
  id?: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsEnum(Roles)
  role: Roles;

  @IsOptional()
  @IsString()
  companyId: string;

  @IsOptional()
  @IsString()
  teamId: string;

  @IsOptional()
  @IsString()
  positionId: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  leaves: Leave[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  objectifs: Objective[];

  @IsOptional()
  @ValidateNested()
  company: CompanyDto;

  @IsOptional()
  @ValidateNested()
  companyRole: CompanyRoleDto;
}

export class UserCreateDto extends UserDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
