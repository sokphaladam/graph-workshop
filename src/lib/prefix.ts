export function prefix(serialNumber: any) {
  return (parseInt(serialNumber, 36) + 1)
    .toString(36)
    .replace(/i/g, "j")
    .replace(/o/g, "p")
    .replace(/0/g, "1")
    .toUpperCase();
}
