import jwt from 'jsonwebtoken'

export const decodeUser = (token: string | undefined, secret: string): User | undefined => {
    if (!token) return undefined;
    let user = undefined;
    jwt.verify(token, secret, (err, result) => {
      if (!err && result) user = result as User;
    });
    return user;
  };
  
  export interface User {
    id: string
    roles: Role[]
    rateLimit: number
  }
  
  export enum Role {
    ADMIN = 'ADMIN',
    PREMIUM = 'PREMIUM',
    BASIC = 'BASIC',
    TRIAL = 'TRIAL',
  }