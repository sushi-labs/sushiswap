// i.e. 0-255 -> '00'-'ff'
const dec2hex = (dec: number): string => dec.toString(16).padStart(2, '0');

const generateId = (len: number): string => {
  const arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};

const generateRequestId = (): string => {
  if (typeof window !== 'undefined') {
    return generateId(10);
  }

  return new Date().getTime().toString(36);
};

export { generateRequestId };
