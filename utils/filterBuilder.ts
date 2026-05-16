import { ATMFilter } from '@/types/atm';

export const buildFilter = (atm: string, device: string, stat: string): ATMFilter | undefined => {
    const f: ATMFilter = {};
    if (atm) f.atmId = atm;
    if (device && stat) f[device as keyof ATMFilter] = stat as any;
    return Object.keys(f).length ? f : undefined;
};
