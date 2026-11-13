export function renderPostMarkdown(value) {
  const escape = text => text.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const safeUrl = text => {
    try {
      const url = new URL(text);
      return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
    } catch { return null; }
  };
  const link = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
  const formatting = {
    "***": ["strong", "em"], "___": ["u", "em"], "**": ["strong"], "__": ["u"],
    "~~": ["s"], "*": ["em"], "_": ["em"],
  };
  const markers = [...Object.keys(formatting), "||"];

  function inline(text, depth = 0, allowLinks = true, allowSpoilers = true) {
    if (depth > 12) return escape(text);
    let output = "";
    for (let index = 0; index < text.length;) {
      const rest = text.slice(index);
      const escaped = rest.match(/^\\([\\`*_~|>#[\]()!+-])/);
      if (escaped) {
        output += escape(escaped[1]);
        index += escaped[0].length;
        continue;
      }
      const code = rest.match(/^(`{1,2})([^\n]*?)\1(?!`)/);
      if (code && code[2]) {
        output += `<code>${escape(code[2])}</code>`;
        index += code[0].length;
        continue;
      }
      if (allowLinks && rest[0] === "[") {
        const labelEnd = rest.indexOf("](");
        if (labelEnd > 0) {
          let end = labelEnd + 2;
          let parentheses = 1;
          for (; end < rest.length && parentheses; end += 1) {
            if (rest[end] === "(") parentheses += 1;
            if (rest[end] === ")") parentheses -= 1;
          }
          if (!parentheses) {
            const raw = rest.slice(labelEnd + 2, end - 1).replace(/^<(.+)>$/, "$1");
            const url = safeUrl(raw);
            const label = inline(rest.slice(1, labelEnd), depth + 1, false, allowSpoilers);
            output += url ? link(url, label) : label;
            index += end;
            continue;
          }
        }
      }
      const automatic = allowLinks && rest.match(/^(?:<(https?:\/\/[^\s<>]+)>|(https?:\/\/[^\s<>]+))/i);
      if (automatic) {
        let label = automatic[1] || automatic[2].replace(/[.,!?;:]+$/, "");
        if (!automatic[1]) {
          while (label.endsWith(")") && (label.match(/\)/g) || []).length > (label.match(/\(/g) || []).length) label = label.slice(0, -1);
          while (label.endsWith("]") && (label.match(/\]/g) || []).length > (label.match(/\[/g) || []).length) label = label.slice(0, -1);
        }
        const url = safeUrl(label);
        output += url ? link(url, escape(label)) : escape(label);
        index += automatic[1] ? automatic[0].length : label.length;
        continue;
      }
      const marker = markers.find(item => rest.startsWith(item));
      if (marker && (marker !== "||" || allowSpoilers)) {
        let end = rest.indexOf(marker, marker.length);
        while (end !== -1 && rest[end - 1] === "\\") end = rest.indexOf(marker, end + marker.length);
        const content = rest.slice(marker.length, end);
        const wordUnderscore = marker === "_" && /\w/.test(text[index - 1] || "") && /\w/.test(rest[1] || "");
        if (end > marker.length && !/^\s|\s$/.test(content) && !wordUnderscore) {
          const formatted = inline(content, depth + 1, allowLinks && marker !== "||", allowSpoilers && marker !== "||");
          output += marker === "||"
            ? `<button type="button" class="md-spoiler" data-post-spoiler aria-expanded="false" aria-label="Reveal spoiler">${formatted}</button>`
            : formatting[marker].map(tag => `<${tag}>`).join("") + formatted + formatting[marker].toReversed().map(tag => `</${tag}>`).join("");
          index += end + marker.length;
          continue;
        }
      }
      output += text[index] === "\n" ? "<br>" : escape(text[index]);
      index += 1;
    }
    return output;
  }

  const listItem = line => line.match(/^( *)([-*]|\d+\.) +(.+)$/);
  const startsBlock = line => /^(?:`{3}|#{1,3} |\-# |> ?)/.test(line) || listItem(line);
  function blocks(lines, depth = 0) {
    if (depth > 12) return `<p>${inline(lines.join("\n"))}</p>`;
    const output = [];
    for (let index = 0; index < lines.length;) {
      const line = lines[index];
      if (!line.trim()) { index += 1; continue; }
      const fence = line.match(/^(`{3,})(?:[\w+-]*)\s*$/);
      if (fence) {
        const code = [];
        index += 1;
        while (index < lines.length && !lines[index].startsWith(fence[1])) code.push(lines[index++]);
        if (index < lines.length) index += 1;
        output.push(`<pre><code>${escape(code.join("\n"))}</code></pre>`);
        continue;
      }
      const heading = line.match(/^(#{1,3}) +(.+)$/);
      if (heading) {
        const level = heading[1].length + 2;
        output.push(`<h${level} class="md-heading">${inline(heading[2])}</h${level}>`);
        index += 1;
        continue;
      }
      if (line.startsWith("-# ")) {
        output.push(`<p class="md-subtext">${inline(line.slice(3))}</p>`);
        index += 1;
        continue;
      }
      if (line.startsWith(">>> ") || line.startsWith("> ") || line === ">") {
        const quote = [];
        const multiline = line.startsWith(">>> ");
        if (multiline) { quote.push(line.slice(4), ...lines.slice(index + 1)); index = lines.length; }
        else {
          while (index < lines.length && /^>(?: |$)/.test(lines[index])) quote.push(lines[index++].replace(/^> ?/, ""));
        }
        output.push(`<blockquote>${blocks(quote, depth + 1)}</blockquote>`);
        continue;
      }
      const firstItem = listItem(line);
      if (firstItem) {
        const indent = firstItem[1].length;
        const ordered = /\d/.test(firstItem[2]);
        const items = [];
        let item;
        while (index < lines.length && (item = listItem(lines[index])) && item[1].length === indent && /\d/.test(item[2]) === ordered) {
          const content = [item[3]];
          index += 1;
          while (index < lines.length && lines[index].startsWith(" ".repeat(indent + 2))) content.push(lines[index++].slice(indent + 2));
          items.push(`<li>${blocks(content, depth + 1)}</li>`);
        }
        const tag = ordered ? "ol" : "ul";
        const start = ordered ? ` start="${Number.parseInt(firstItem[2], 10)}"` : "";
        output.push(`<${tag}${start}>${items.join("")}</${tag}>`);
        continue;
      }
      const paragraph = [line];
      index += 1;
      while (index < lines.length && lines[index].trim() && !startsBlock(lines[index])) paragraph.push(lines[index++]);
      output.push(`<p>${inline(paragraph.join("\n"))}</p>`);
    }
    return output.join("");
  }
  return blocks(String(value ?? "").replace(/\r\n?/g, "\n").split("\n"));
}
