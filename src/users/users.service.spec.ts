import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';

describe('UsersService', () => {
  let service: UsersService;
  let fakeUsersRepository: Partial<Record<keyof any, any>>;

  beforeEach(async () => {
    // Mock simples dos métodos do TypeORM Repository
    fakeUsersRepository = {
      find: (query: any) => Promise.resolve([]),
      findOne: (query: any) => Promise.resolve(null),
      create: (dto: any) => dto,
      save: (user: any) => Promise.resolve({ id: 1, ...user }),
      remove: (user: any) => Promise.resolve(user),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // Mapeia o token do repositório TypeORM para o mock
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
