import { BaseEntity } from '../../../common/entity/base-entity';

import { AppRole } from './app-role.enum';

import { User } from '../../user/domain/user.entity';

export class Auth extends BaseEntity {
  username: string;
  secret: string;
  role: AppRole;
  user: User;
}
