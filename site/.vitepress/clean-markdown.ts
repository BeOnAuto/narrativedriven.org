export function cleanMarkdown(raw: string): string {
	let out = raw;

	// 1. Strip leading frontmatter (--- ... ---) at the very start of the file.
	out = out.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");

	// 2. Remove <script ...>...</script> blocks entirely.
	out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

	// 3. Remove <style ...>...</style> blocks entirely.
	out = out.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

	// 4. Remove HTML comments (supports multi-line).
	out = out.replace(/<!--[\s\S]*?-->/g, "");

	// 5. Remove <div ...> and </div> tags but keep inner content.
	out = out.replace(/<div\b[^>]*>/gi, "");
	out = out.replace(/<\/div>/gi, "");

	// 6. Remove VitePress container fences (::: name ... :::), keep inner content.
	//    Opening fence: line starting with ::: followed by a name.
	//    Closing fence: line with just ::: (and optional trailing space).
	//    Use [ \t]* instead of \s* so newlines aren't consumed across lines.
	out = out.replace(/^:::[ \t]*\w[\w-]*[^\n]*\n/gm, "");
	out = out.replace(/^:::[ \t]*$/gm, "");

	// 7. Collapse runs of 3+ blank lines into 2.
	out = out.replace(/\n{3,}/g, "\n\n");

	// 8. Trim leading whitespace and ensure single trailing newline.
	out = out.replace(/^\s+/, "");
	out = `${out.replace(/\s+$/, "")}\n`;

	return out;
}
