export const STATUS_COLOR: Record<string, string>= {
  NORMAL: '#22c55e',
  OK: '#22c55e',
  ONLINE: '#22c55e',
  
  WARNING: '#facc15',
  LOW: '#facc15',
  NEAR_FULL: '#facc15',
  OFFLINE: '#facc15',
  
  FULL: '#ef4444',
  ERROR: '#ef4444',
  EMPTY: '#ef4444',
  DISCONNECTED: '#ef4444',
};

export const getStatusColor = (status: string) => {
    return STATUS_COLOR[status] || '#ffffff';
};