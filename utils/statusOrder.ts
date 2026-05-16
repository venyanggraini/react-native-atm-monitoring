export const STATUS_ORDER: Record<string, string[]> = {
    atmStatus: ["ONLINE", "OFFLINE", "OUT_OF_SERVICE"],
    cashRemainingStatus: ["NORMAL", "LOW", "NEAR_FULL", "FULL", "EMPTY"],
    receiptPrinterStatus: ["NORMAL", "LOW", "EMPTY", "ERROR"],
    cardReaderStatus: ["NORMAL", "WARNING", "ERROR"],
};