import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppService } from './app.service';

import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Store } from './entities/store.entity';
import { Role } from './decorators';

describe('AppService', () => {
  let service: AppService;

  const mockUserRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockBookRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockStoreRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepo,
        },
        {
          provide: getRepositoryToken(Store),
          useValue: mockStoreRepo,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'test',
        password: await bcrypt.hash('password', 10),
        role: Role.USER,
      };

      const mockToken = 'token';

      mockUserRepo.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login({
        name: 'test',
        password: 'password',
      });

      expect(result.jwt).toBe(mockToken);
    });
  });

  describe('getAllStores', () => {
    it('should return all stores', async () => {
      const mockStores = [{ id: 1, name: 'store1', books: [] }];
      mockStoreRepo.find.mockResolvedValue(mockStores);

      const result = await service.getAllStores();
      expect(result).toEqual(mockStores);
    });
  });

  describe('getAllBooks', () => {
    it('should return books by store', async () => {
      const mockStores = [{ id: 1, name: 'store1', books: [] }];
      mockStoreRepo.find.mockResolvedValue(mockStores);

      const result = await service.getAllBooks({ store: 1 });
      expect(result).toEqual(mockStores);
    });

    it('should return all books', async () => {
      const mockBooks = [{ id: 1, name: 'book1', stock: 10 }];
      mockBookRepo.find.mockResolvedValue(mockBooks);

      const result = await service.getAllBooks({});
      expect(result).toEqual(mockBooks);
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const mockUser = {
        id: 1,
        name: 'test',
        password: 'hashedPassword',
        role: Role.USER,
      };

      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.createUser({
        name: 'test',
        password: 'password',
        role: Role.USER,
      });

      expect(result.name).toBe(mockUser.name);
    });
  });

  describe('updateBookQuantity', () => {
    it('should update book quantity successfully', async () => {
      const mockStore = {
        id: 1,
        books: [{ id: '1', stock: 0 }],
      };

      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockBookRepo.save.mockResolvedValue({ id: '1', stock: 10 });

      const result = await service.updateBookQuantity(1, {
        bookId: '1',
        quantity: 10,
      });

      expect(result.stock).toBe(10);
    });
  });

  describe('createStore', () => {
    it('should create store successfully', async () => {
      const mockStore = { id: 1, name: 'store1' };

      mockStoreRepo.findOne.mockResolvedValue(null);
      mockStoreRepo.save.mockResolvedValue(mockStore);

      const result = await service.createStore({ name: 'store1' });

      expect(result.name).toBe(mockStore.name);
    });
  });

  describe('createNewBook', () => {
    it('should create book successfully', async () => {
      const mockStore = { id: 1 };
      const mockBook = { id: '1', name: 'book1', stock: 10 };

      mockStoreRepo.findOne.mockResolvedValue(mockStore);
      mockBookRepo.findOne.mockResolvedValue(null);
      mockBookRepo.save.mockResolvedValue(mockBook);

      const result = await service.createNewBook(1, {
        name: 'book1',
        stock: 10,
      });

      expect(result.name).toBe(mockBook.name);
    });
  });
});
