export const HASH_PROVIDER = 'HASH_PROVIDER';

export interface IHashProvider {
  hash(payload: string): Promise<string>;
  verifyHash(payload: string, hash: string): Promise<boolean>;
}
