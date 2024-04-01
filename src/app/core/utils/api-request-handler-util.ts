import { catchError, EMPTY, Observable, switchMap } from 'rxjs';
import { SubscriberSink } from './subscriber-sink';

export class ApiRequestHandlerUtil {

  protected subs: SubscriberSink = new SubscriberSink();

  /**
   * Lida com uma solicitação de API representada por um Observable, adicionando a solicitação a uma lista de subscrições.
   *
   * @template T - O tipo de dados que o Observable deve emitir.
   * @param {() => Observable<T>} apiRequest - A função que representa a solicitação da API a ser realizada.
   * @returns {Observable<T>} - Um Observable que emite o resultado da solicitação da API ou um erro, dependendo do resultado da solicitação.
   * @protected
   */
  public handleApiRequest<T>(apiRequest: () => Observable<T>): Observable<T> {
    return new Observable<T>((observer) => {
      this.subs.sink = apiRequest()
        .pipe(
          switchMap(async (result) => {
            observer.next(result);
            observer.complete();
            return EMPTY;
          }),
          catchError(async (error) => {
            observer.error(error);
            return EMPTY;
          }),
        )
        .subscribe();
    });
  }

}
