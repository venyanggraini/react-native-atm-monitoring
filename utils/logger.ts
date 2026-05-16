type Level = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

const log = (level: Level, tag: string, message: string, data?: unknown) => {
  if (!__DEV__ && level === 'DEBUG') return;

  const prefix = `[${level}][${tag}]`;
  switch (level) {
    case 'ERROR': console.error(prefix, message, ...(data !== undefined ? [data] : [])); break;
    case 'WARN':  console.warn(prefix, message, ...(data !== undefined ? [data] : [])); break;
    default:      console.log(prefix, message, ...(data !== undefined ? [data] : [])); break;
  }
};

const logger = {
  info:  (tag: string, message: string, data?: unknown) => log('INFO',  tag, message, data),
  warn:  (tag: string, message: string, data?: unknown) => log('WARN',  tag, message, data),
  error: (tag: string, message: string, data?: unknown) => log('ERROR', tag, message, data),
  debug: (tag: string, message: string, data?: unknown) => log('DEBUG', tag, message, data),
};

export default logger;
