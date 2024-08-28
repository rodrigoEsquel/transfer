import { SetMetadata } from '@nestjs/common';

import { AppRole } from '../../domain/app-role.enum';

export const Roles = (...roles: AppRole[]) => SetMetadata('roles', roles);
