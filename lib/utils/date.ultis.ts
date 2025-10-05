import { DATE_FORMATS } from "../constants";

export const formatDate = (
  date: Date | string,
  format: string = DATE_FORMATS.FULL_DATE,
): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const day = dateObj.getDate().toString().padStart(2, "0");
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");
  const seconds = dateObj.getSeconds().toString().padStart(2, "0");

  return format
    .replace("yyyy", year.toString())
    .replace("MM", month)
    .replace("dd", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};
