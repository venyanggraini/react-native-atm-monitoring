export const fetchATMs = async () => {
    return [
        {
            id: 'ATM001',
            atm_status: 'ONLINE',
            cash: 'NORMAL',
            printer: 'NORMAL',
            cardReader: 'NORMAL',
        },
        {
            id: 'ATM002',
            atm_status: 'OFFLINE',
            cash: 'LOW',
            printer: 'LOW',
            cardReader: 'ERROR',
        },
        {
            id: 'ATM003',
            atm_status: 'ONLINE',
            cash: 'FULL',
            printer: 'EMPTY',
            cardReader: 'WARNING',
        },
        {
            id: 'ATM004',
            atm_status: 'DISCONNECTED',
            cash: 'NEAR_FULL',
            printer: 'LOW',
            cardReader: 'WARNING',
        },
    ];
};