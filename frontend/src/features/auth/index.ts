export { AuthGuard, GuestGuard } from './components/AuthGuard.tsx'
export { AuthPage } from './components/AuthPage.tsx'
export { Login } from './components/Login.tsx'
export { Register } from './components/Register.tsx'
export { useAuth } from './hooks/index.ts'
export { login, logout, register } from './services/index.ts'
export {
  loginSchema,
  registerSchema,
  type AuthUser,
  type LoginInput,
  type LoginResponse,
  type RegisterInput,
} from './types/index.ts'
