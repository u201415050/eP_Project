package com.epaisapos.card_factory;

import com.facebook.react.bridge.Callback;

public interface ICardPayment {
    void startTransaction(Callback callback);

    void refundTransaction(Callback callback);

    void reversal(Callback callback);
}
