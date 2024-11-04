export function isTimeInRange(startTime, endTime, checkTime) {
  // Convert times to Date objects
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  const check = new Date(`1970-01-01T${checkTime}`);

  // Check if the checkTime is between startTime and endTime
  return check >= start && check <= end;
}
