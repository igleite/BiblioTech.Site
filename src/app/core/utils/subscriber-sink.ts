import { Subscription, Unsubscribable } from 'rxjs';

/**
 * Uma classe que gerencia uma coleção de inscrições e lida com a desinscrição delas.
 * @implements {Unsubscribable}
 */
export class SubscriberSink implements Unsubscribable {

  /**
   * Um array para armazenar as inscrições internas.
   * @private
   * @type {Subscription[]}
   */
  private _internalSink: Subscription[] = [];

  /**
   * Adiciona uma inscrição ao array interno.
   * @param {Subscription} subscription - A inscrição a ser adicionada.
   */
  set sink(subscription: Subscription) {
    this._internalSink.push(subscription);
  }

  /**
   * Cancela a inscrição de todas as inscrições no array interno e limpa o array.
   * @returns {void}
   */
  unsubscribe(): void {
    this._internalSink.forEach(subs => subs.unsubscribe());
    this._internalSink = [];
  }
}
