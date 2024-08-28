import { AppRole } from '../../domain/app-role.enum';

import { User } from '../../../user/domain/user.entity';

export class CreateAuthDto {
  username: string;
  password: string;
  role: AppRole;
  user: User;
}
