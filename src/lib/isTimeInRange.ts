export function isTimeInRange(startTime, endTime, checkTime) {
  // Convert times to Date objects
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  const check = new Date(`1970-01-01T${checkTime}:00`);

  // Check if the checkTime is between startTime and endTime
  return check >= start && check <= end;
}
