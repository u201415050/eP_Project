package com.epaisapos.card_factory;

import com.epaisapos.card_factory.mosambee.MosambeeCardPayment;
import com.epaisapos.card_factory.mrl.MRLCardPayment;
import com.epaisapos.card_factory.mswipe.MSwipeCardPayment;
import com.epaisapos.util.ProcessorType;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;


public class CardFactory {
    public static ICardPayment getTransaction(ReadableMap requestData, ReactContext context) {
        if (requestData.getInt("processorId") == ProcessorType.MRL.getProcessorId()) {
            return new MRLCardPayment(requestData, context);
        } else if (requestData.getInt("processorId") == ProcessorType.MOSAMBEE.getProcessorId()) {
            return new MosambeeCardPayment(requestData, context);
        }else if (requestData.getInt("processorId") == ProcessorType.MSWIPE.getProcessorId()) {
            return new MSwipeCardPayment(requestData, context);
        }
        return null;
    }
}
