import { TestBed } from '@automock/jest';

import { CryptoService } from '../crypto.service';
import {
  HASH_PROVIDER,
  IHashProvider,
} from '../../interface/hash-provider.interface';

describe('CryptoService Unit Test', () => {
  let cryptoService: CryptoService;
  let hashProvider: jest.Mocked<IHashProvider>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(CryptoService)
      .mock(HASH_PROVIDER)
      .using(hashProvider)
      .compile();

    cryptoService = unit;
    hashProvider = unitRef.get(HASH_PROVIDER);
  });

  describe('hashSecret', () => {
    it('should hash a secret successfully', async () => {
      const secret = 'mySecret';
      const hashedSecret = 'hashedSecret123';

      hashProvider.hash.mockResolvedValue(hashedSecret);

      const result = await cryptoService.hashSecret(secret);

      expect(hashProvider.hash).toHaveBeenCalledWith(secret);
      expect(result).toBe(hashedSecret);
    });

    it('should throw an error when secret is empty', async () => {
      await expect(cryptoService.hashSecret('')).rejects.toThrow(
        'A valid secret is required',
      );
    });

    it('should throw an error when secret is undefined', async () => {
      await expect(cryptoService.hashSecret(undefined)).rejects.toThrow(
        'A valid secret is required',
      );
    });

    it('should throw an error when hashProvider.hash fails', async () => {
      const secret = 'mySecret';
      const error = new Error('Hashing failed');

      hashProvider.hash.mockRejectedValue(error);

      await expect(cryptoService.hashSecret(secret)).rejects.toThrow(
        'Hashing failed',
      );
    });
  });

  describe('verifyHash', () => {
    it('should verify a hash successfully', async () => {
      const secret = 'mySecret';
      const hash = 'hashedSecret123';

      hashProvider.verifyHash.mockResolvedValue(true);

      const result = await cryptoService.verifyHash(secret, hash);

      expect(hashProvider.verifyHash).toHaveBeenCalledWith(secret, hash);
      expect(result).toBe(true);
    });

    it('should return false for an incorrect secret', async () => {
      const secret = 'wrongSecret';
      const hash = 'hashedSecret123';

      hashProvider.verifyHash.mockResolvedValue(false);

      const result = await cryptoService.verifyHash(secret, hash);

      expect(hashProvider.verifyHash).toHaveBeenCalledWith(secret, hash);
      expect(result).toBe(false);
    });

    it('should throw an error when secret is empty', async () => {
      const hash = 'hashedSecret123';
      await expect(cryptoService.verifyHash('', hash)).rejects.toThrow(
        'A valid secret is required',
      );
    });

    it('should throw an error when hash is empty', async () => {
      const secret = 'mySecret';
      await expect(cryptoService.verifyHash(secret, '')).rejects.toThrow(
        'A valid secret is required',
      );
    });

    it('should throw an error when secret is undefined', async () => {
      const hash = 'hashedSecret123';
      await expect(cryptoService.verifyHash(undefined, hash)).rejects.toThrow(
        'A valid secret is required',
      );
    });

    it('should throw an error when hash is undefined', async () => {
      const secret = 'mySecret';
      await expect(cryptoService.verifyHash(secret, undefined)).rejects.toThrow(
        'A valid secret is required',
      );
    });

    it('should throw an error when hashProvider.verifyHash fails', async () => {
      const secret = 'mySecret';
      const hash = 'hashedSecret123';
      const error = new Error('Verification failed');

      hashProvider.verifyHash.mockRejectedValue(error);

      await expect(cryptoService.verifyHash(secret, hash)).rejects.toThrow(
        'Verification failed',
      );
    });
  });
});
