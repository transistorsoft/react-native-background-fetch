
export const timeStr = (date: Date = new Date()) => {
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}