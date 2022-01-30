export type Role = 'CLIENT' | 'ITEMEDITOR' | 'ADMIN' | 'SUPERADMIN'

export interface User {
  id: string
  username: string
  email: string
  roles: Role[]
  created_at: string
}

// TYPE: User
export type SignupInputs = Pick<User, 'email' | 'username'> & { password: string }