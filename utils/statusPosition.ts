export const STATUS_POSITION = {
    green: ['NORMAL', 'OK', 'ONLINE'],
    yellow: ['WARNING', 'LOW', 'NEAR_FULL', 'OFFLINE'],
    red: ['ERROR', 'EMPTY', 'FULL', 'DISCONNECTED']
};

export const getStatusPosition = (status: string) => {
    if(STATUS_POSITION.green.includes(status)) return 'left';
    if(STATUS_POSITION.yellow.includes(status)) return 'center';
    if(STATUS_POSITION.red.includes(status)) return 'right';
    return 'left';
};