/**
 * Utility helper to export tabular data to clean CSV
 */
export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  headers?: { key: keyof T | string; label: string }[]
) {
  if (!rows || rows.length === 0) return;

  const separator = ",";
  const keys = headers ? headers.map((h) => String(h.key)) : Object.keys(rows[0]);
  const headerLabels = headers
    ? headers.map((h) => `"${String(h.label).replace(/"/g, '""')}"`)
    : keys.map((k) => `"${k}"`);

  const csvRows = rows.map((row) =>
    keys
      .map((key) => {
        let val = row[key];
        if (val === null || val === undefined) val = "";
        val = String(val).replace(/"/g, '""');
        return `"${val}"`;
      })
      .join(separator)
  );

  const csvContent = [headerLabels.join(separator), ...csvRows].join("\r\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename.endsWith(".csv") ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
