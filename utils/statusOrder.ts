export const STATUS_ORDER: Record<string, string[]> = {
    atmStatus: ["ONLINE", "OFFLINE", "OUT_OF_SERVICE"],
    cash: ["NORMAL", "LOW", "NEAR_FULL", "FULL", "EMPTY"],
    printer: ["NORMAL", "LOW", "EMPTY", "ERROR"],
    cardReader: ["NORMAL", "WARNING", "ERROR"],
};