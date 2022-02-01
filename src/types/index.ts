export type Role = 'CLIENT' | 'ITEMEDITOR' | 'ADMIN' | 'SUPERADMIN'

export interface User {
  id: string
  username: string
  email: string
  roles: Role[]
  createdAt: string
}

// TYPE: User signup
export type SignupInputs = Pick<User, 'email' | 'username'> & { password: string }

// TYPE: User signin
export type SigninInputs = Omit<SignupInputs, 'username'> 