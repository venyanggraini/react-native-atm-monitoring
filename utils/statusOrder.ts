export const STATUS_ORDER: Record<string, string[]> = {
    atm_status: ["ONLINE", "OFFLINE", "DISCONNECTED"],
    cash: ["NORMAL", "LOW", "NEAR_FULL", "FULL", "EMPTY"],
    printer: ["NORMAL", "LOW", "EMPTY", "ERROR"],
    cardReader: ["NORMAL", "WARNING", "ERROR"],
};