import type { User } from "../../models/users/UserDto";

export interface IUserAPIService {
  getAllUsers(): Promise<User[]>;
  getUserById(id: number): Promise<User>;
  createUser(userData: User): Promise<User>; // Ovo je tvoj create_user
  updateUser(id: number, userData: Partial<User>): Promise<User>;
  deleteUser(id: number): Promise<void>;
}