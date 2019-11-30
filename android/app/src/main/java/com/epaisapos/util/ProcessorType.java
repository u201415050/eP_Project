package com.epaisapos.util;

public enum ProcessorType {

    MRL(1), IDFC(2), MOSAMBEE(4), BIJLIPAY(7), MSWIPE(10);
    private int processorId;

    ProcessorType(int processorId) {
        this.processorId = processorId;
    }

    public int getProcessorId() {
        return processorId;
    }
}
