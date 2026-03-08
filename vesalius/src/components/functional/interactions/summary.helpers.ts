export type SummaryToken =
  | { type: "h3"; text: string }
  | { type: "bullet"; text: string }
  | { type: "p"; text: string }
  | { type: "spacer" };

export function tokenizeSummary(text: string): SummaryToken[] {
  const lines = text.split("\n");
  const out: SummaryToken[] = [];

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (line.trim().length === 0) {
      out.push({ type: "spacer" });
      continue;
    }

    if (line.startsWith("**") && line.includes("**", 2)) {
      const match = line.match(/\*\*(.*?)\*\*/);
      const headerText = match?.[1]?.trim();
      if (headerText) out.push({ type: "h3", text: headerText });
      continue;
    }

    if (line.trimStart().startsWith("- ")) {
      out.push({ type: "bullet", text: line.trimStart().slice(2) });
      continue;
    }

    out.push({ type: "p", text: line });
  }

  return out;
}
