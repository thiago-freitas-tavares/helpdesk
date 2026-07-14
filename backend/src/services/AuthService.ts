import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken'; // função que gera token JWT
import type { SignOptions } from 'jsonwebtoken'; // para tipar o tempo de expiração do token nesse caso
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/UserRepository';
import { UserRole } from '../enums/UserRole';

// pela regra de negócio, essas propriedades são obrigatórias, mas podem chegar vazias, por isso,  a ? indica que precisamos validar
interface RegisterUserRequest { // tipagem dos dados que o cadastro recebe
  name?: string | undefined;
  email?: string | undefined;
  password?: string | undefined;
}

interface LoginUserRequest {
  email?: string | undefined;
  password?: string | undefined;
}

interface UserResponse { // tipagem dos dados que o cadastro/login devolve (retiramos a senha)
  id: number;
  name: string;
  email: string;
  role: UserRole; // por enquanto todos vem com a role padrão CUSTOMER. As demais serão configuradas por rota protegida.
  createdAt: Date;
  updatedAt: Date;
}

interface LoginUserResponse {
  user: UserResponse;
  token: string;
}

export class AuthService { // responsável pelas regras de autenticação e cadastro
  
  constructor(
    private readonly userRepository: UserRepository = new UserRepository() // declaração e atribuição direto no construtor (parameter property) não acessa o TypeORM diretamente
  ) {}

  public async register({ name, email, password }: RegisterUserRequest): Promise<UserResponse> {
    const trimmedName = name?.trim(); // ? evita erro, caso seja undefined
    const normalizedEmail = email?.trim().toLowerCase();

    if (!trimmedName) {
      throw new AppError('Nome é obrigatório', 400); // 400 - Bad Request
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
      throw new AppError('E-mail já cadastrado', 409); // 409 - Conflict
    }

    const hashedPassword = await hash(password, 10); // o segundo argumento é o salt rounds, que é o custo de processamento do hash

    const user = this.userRepository.create({
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return this.toUserResponse(savedUser);
  }

  public async login({
    email,
    password,
  }: LoginUserRequest): Promise<LoginUserResponse> {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new AppError('E-mail é obrigatório', 400);
    }

    if (!password || password.trim().length === 0) {
      throw new AppError('Senha é obrigatória', 400);
    }

    const user = await this.userRepository.findByEmailWithPassword(normalizedEmail);

    if (!user) {
      throw new AppError('E-mail ou senha inválidos', 401); // 401 - Unauthorized
    }

    const passwordMatches = await compare(password, user.password); // retorna true ou false

    if (!passwordMatches) {
      throw new AppError('E-mail ou senha inválidos', 401);
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new AppError('Configuração de autenticação inválida', 500);
    }

    // se existir JWT_EXPIRES_IN no .env, pega ele, senão usa 1d / SignOptions serve para o TypeScript conferir se estão sendo passados opções válidas para o JWT
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? '1d') as NonNullable<SignOptions['expiresIn']>; // NonNullable, pois o TypeScript estava reclamando que SignOptions['expiresIn'] pode incluir undefined

    const tokenOptions: SignOptions = {
      expiresIn,
    };

    const token = sign( // gera o token com 3 partes - ({payload}, chave secreta, {opções}, callback) / opções - expiresIn, subject, audience, issuer, etc
      {
        sub: String(user.id), // claim subject = dono da token
        role: user.role, // claim role colocado no payload do token, pois será últil para autorização de rotas protegidas
      },
      jwtSecret,
      tokenOptions, // o TypeScript pode ficar confuso se o terceiro argumento é opção ou callback e apontar erro, por isso criamos o tokenOptions
    );

    return {
      user: this.toUserResponse(user), // toUserResponse monta o objeto sem senha
      token, // será salvo pelo frontend no localStorage
    };
  }

  private isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  private toUserResponse(user: { // para evitar repetição, será usado pelo register e login
    id: number;
    name: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
