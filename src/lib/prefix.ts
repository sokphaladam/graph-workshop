const str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function prefix(serialNumber: any) {
  let n = new Date().getTime();
  let prefix = serialNumber[0].toUpperCase();

  while (n) {
    const alpha = n % 26;
    prefix += str.charAt(alpha);
    n = (n / 26) | 0;
  }

  return prefix;
}
