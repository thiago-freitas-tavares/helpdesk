import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import { UserRole } from '../enums/UserRole';

// pela regra de negócio, essas propriedades são obrigatórias, mas podem chegar vazias, por isso,  a ? indica que precisamos validar
interface RegisterUserRequest { // tipagem dos dados que o cadastro recebe
  name?: string;
  email?: string;
  password?: string;
}

interface RegisterUserResponse { // tipagem dos dados que o cadastro devolve (retiramos a senha)
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthService { // responsável pelas regras de autenticação e cadastro
  
  constructor(
    private readonly userRepository: UserRepository = new UserRepository() // declaração e atribuição direto no construtor (parameter property) não acessa o TypeORM diretamente
  ) {}

  public async register({ name, email, password }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const trimmedName = name?.trim(); // ? evita erro, caso seja undefined
    const normalizedEmail = email?.trim().toLowerCase();

    if (!trimmedName) {
      throw new AppError('Nome é obrigatório', 400);
    }

    if (!normalizedEmail) {
      throw new AppError('E-mail é obrigatório', 400);
    }

    if (!this.isEmailValid(normalizedEmail)) { // this indica que estamos usando um método da própria classe AuthService.
      throw new AppError('Formato de e-mail inválido', 400);
    }

    if (!password || password.trim().length === 0) { // senha não existe ou contém apenas espaços
      throw new AppError('Senha é obrigatória', 400);
    }

    if (password.length < 6) {
      throw new AppError('A senha deve conter no mínimo 6 caracteres', 400);
    }

    const userAlreadyExists = await this.userRepository.findByEmail(normalizedEmail);

    if (userAlreadyExists) {
      throw new AppError('E-mail já cadastrado', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role, // por enquanto todos vem com a role padrão CUSTOMER. As demais serão configuradas por rota protegida.
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }
  private isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }
}
