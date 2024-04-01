import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';
import { catchError, throwError } from 'rxjs';
import { Auth, ErrorObject } from '../models/auth';
import { Router } from '@angular/router';

/**
 * Intercepta as requisições HTTP para adicionar cabeçalhos de autenticação.
 * @param req O objeto HttpRequest a ser interceptado.
 * @param next O próximo objeto HttpHandler na cadeia de interceptadores.
 * @returns Um objeto Observable de HttpRequest.
 */
export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);

  const token: string | undefined = storageService.auth?.accessToken;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
    });
  }

  return next(req);
};

/**
 * Intercepta os erros HTTP para tratamento e redirecionamento adequados.
 * @param req O objeto HttpRequest a ser interceptado.
 * @param next O próximo objeto HttpHandler na cadeia de interceptadores.
 * @returns Um objeto Observable de HttpRequest.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {

      const authError: Auth = error;
      const erro: ErrorObject = authError.error?.errors;
      const mensagens: any[] = [];

      for (const key in erro) {
        if (erro.hasOwnProperty(key)) {
          const messages: string[] = erro[key];
          mensagens.push(messages.toString());
        }
      }

      let errorMessage: string = mensagens.join('\n');
      if (!erro) {

        // trata o erro para retornar uma mensagem mais apropriada, com base na resposta de erro da solicitação HTTP.
        const errorMessages: { [key: number]: string } = {
          400: 'A solicitação enviada é inválida.',
          401: 'Você deve se autenticar para acessar este recurso.',
          403: 'O acesso a este recurso é proibido.',
          404: 'O recurso solicitado não pode ser encontrado.',
          500: 'O servidor encontrou um erro inesperado.',
        };

        errorMessage = errorMessages[error.status] || `Não foi possível processar a solicitação.\n Tente novamente mais tarde.`;

        if (error.status === 401) {
          storageService.logout().finally();
        }

      }

      return throwError(() => new Error(errorMessage));
    }),
  );
};
