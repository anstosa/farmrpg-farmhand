export const debounce = (callback: () => void, timeout: number = 300) => {
  let timer: NodeJS.Timeout;
  return (...parameters: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      Reflect.apply(callback, this, parameters);
    }, timeout);
  };
};
