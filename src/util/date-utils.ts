export function getAdjustedDate(dateTime: string | Date): string {
  const date = new Date(dateTime);
  date.setHours(date.getHours() - 6); // 새벽 6시 기준

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based month
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`; // "YYYY-MM-DD"
}
