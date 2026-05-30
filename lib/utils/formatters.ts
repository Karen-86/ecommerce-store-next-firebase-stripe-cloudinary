export function formatTimestampToDate(timestamp: any) {
  const date = new Date(timestamp.seconds * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

export const formatFirestoreDate = (timestamp: any) => {
  if (!timestamp?._seconds) return "";

  return new Date(timestamp._seconds * 1000).toLocaleDateString(
    "en-GB",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );
};

export const formatWithCommas = (value: string) => {
  const num = value.replace(/,/g, "");
  if (!/^\d+$/.test(num)) return value;
  return Number(num).toLocaleString();
};

export const formatDeliveryRange = (minDays: number, maxDays: number) => {
  const today = new Date();

  const start = new Date(today);
  start.setDate(today.getDate() + minDays);

  const end = new Date(today);
  end.setDate(today.getDate() + maxDays);

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  const startMonth = start.toLocaleString("en-US", { month: "short" });
  const endMonth = end.toLocaleString("en-US", { month: "short" });

  const startDay = start.getDate();
  const endDay = end.getDate();
  const year = end.getFullYear();

  return sameMonth
    ? `${startMonth} ${startDay} - ${endDay}, ${year}`
    : `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
};

export const unformatFromCommas = (value: string) => value.replace(/,/g, "");
