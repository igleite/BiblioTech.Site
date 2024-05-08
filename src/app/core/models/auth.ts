// {
//   "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
//   "title": "One or more validation errors occurred.",
//   "status": 400,
//   "traceId": "00-a35d54afd600ded1abe877e8a565bccb-69040c6c66286cc0-00",
//   "errors": {
//   "ISBN": [
//     "Este ISBN já existe, não é possivel cadastrar novamente!"
//   ]
// }
// }

export interface Auth {
  error: {
      message: string;
  };
}

export interface AuthErros {
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
