
import { injectable } from 'tsyringe';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

@injectable()
export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    // Mock implementation
    if (email === 'test@test.com' && password === 'password') {
      return { id: '1', name: 'Test User', email: 'test@test.com' };
    }
    throw new Error('Invalid credentials');
  }

  async signup(name: string, email: string, password: string): Promise<User> {
    // Mock implementation
    return { id: '2', name, email };
  }
}
