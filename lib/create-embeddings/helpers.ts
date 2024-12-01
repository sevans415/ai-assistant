import { JSDOM } from "jsdom";

export function extractParagraphsFromHTMLString(html: string): string[] {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  const paragraphs = Array.from(doc.querySelectorAll("p"));

  // Decode HTML entities and extract text content
  const decodeHtmlEntities = (str: string): string => {
    const textarea = doc.createElement("textarea");
    textarea.innerHTML = str;
    return textarea.value;
  };

  return paragraphs.map(p => decodeHtmlEntities(p.textContent || ""));
}
