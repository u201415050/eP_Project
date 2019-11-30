package com.epaisapos.util;

public enum CardTransactionState {
    PROCESSING("Processing"),
    SWIPE_CARD("Swipe or insert the card"),
    ENTER_PIN("Enter pin");

    private String state;

    CardTransactionState(String state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return state;
    }
}
