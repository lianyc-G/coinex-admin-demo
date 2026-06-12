/**
 * Renders body text with %(variable)s patterns highlighted in yellow.
 */
export default function HighlightBody({ text }: { text: string }) {
  if (!text) {
    return <span className="text-gray-400 italic">无内容</span>;
  }

  const parts = text.split(/(%\([^)]+\)s)/g);
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('%(') && part.endsWith(')s')) {
          return (
            <span
              key={i}
              className="bg-[#fff3b0] rounded-sm px-0.5 font-mono text-sm"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
