
import { User } from '../entities/User';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  signup(name: string, email: string, password: string): Promise<User>;
}
