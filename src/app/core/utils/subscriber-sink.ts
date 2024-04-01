import { Subscription, Unsubscribable } from 'rxjs';

export class SubscriberSink implements Unsubscribable {
  private _internalSink: Subscription[] = [];

  set sink(subscription: Subscription) {
    this._internalSink.push(subscription);
  }

  unsubscribe(): void {
    this._internalSink.forEach(subs => subs.unsubscribe());
    this._internalSink = [];
  }
}
