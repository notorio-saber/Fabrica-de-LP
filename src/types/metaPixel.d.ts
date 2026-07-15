declare global {
  type FbqFunction = {
    (...args: unknown[]): void;
    callMethod?: (...args: unknown[]) => void;
    queue: unknown[][];
    loaded: boolean;
    version: string;
  };

  interface Window {
    fbq?: FbqFunction;
    _fbq?: FbqFunction;
  }
}

export {};
