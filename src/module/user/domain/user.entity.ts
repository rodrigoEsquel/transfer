import { BaseEntity } from '../../../common/entity/base-entity';

export class User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
}
