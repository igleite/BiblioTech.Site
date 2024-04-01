export interface Auth {
  error: {
    title: string;
    status: number;
    errors: ErrorObject;
  };
}

export interface ErrorObject {
  [key: string]: string[];
}


interface UsuarioTokenClaim {
  type: string;
  value: string;
}

interface UsuarioToken {
  id: string;
  email: string;
  claims: UsuarioTokenClaim[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  usuarioToken: UsuarioToken;
}
