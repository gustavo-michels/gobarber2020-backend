import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado.');
    }

    const userEmailAlreadyUsed = await this.usersRepository.findByEmail(email);

    if (userEmailAlreadyUsed && userEmailAlreadyUsed.id !== user_id) {
      throw new AppError('Endereço de e-mail já utilizado por outro usuário.');
    }

    user.name = name;
    user.email = email;

    if (password && !old_password) {
      throw new AppError(
        'Informe a sua senha atual para poder criar sua nova senha.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('A senha atual informada não está correta.');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.cacheProvider.invalidatePrefix('providers-list');
    await this.cacheProvider.invalidatePrefix('provider-appointments');

    return this.usersRepository.update(user);
  }
}

export default UpdateProfileService;
