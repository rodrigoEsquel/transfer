import { EntitySchema } from 'typeorm';

import { Auth } from '../../domain/auth.entity';

export const AuthSchema = new EntitySchema<Auth>({
  name: 'Auth',
  target: Auth,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    username: {
      type: String,
      unique: true,
    },
    secret: {
      type: String,
    },
    role: {
      type: String,
    },
    createdAt: {
      type: Date,
      createDate: true,
    },
    updatedAt: {
      type: Date,
      updateDate: true,
    },
    deletedAt: {
      type: Date,
      deleteDate: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'one-to-one',
      joinColumn: true,
    },
  },
});
