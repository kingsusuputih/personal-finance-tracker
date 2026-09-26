export function parseBoldSegments(text = "") {
  if (!text || typeof text !== "string") return [];
  const parts = text.split(/(\*\*[^\*\n]+?\*\*)/g);
  const segments = [];
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      segments.push({ text: part.slice(2, -2), bold: true });
    } else {
      segments.push({ text: part, bold: false });
    }
  }
  return segments;
}
