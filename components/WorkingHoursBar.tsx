export default function WorkingHoursBar({ text }: { text?: string }) {
  if (!text || text.trim().length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "#EAD5CD",
        color: "#000000",
        fontSize: "13px",
        fontWeight: 600,
        padding: "8px 0",
        fontFamily: "Tajawal, sans-serif",
        lineHeight: 1.5,
        overflow: "hidden",
        whiteSpace: "nowrap",
        direction: "ltr",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "inline-block",
          whiteSpace: "nowrap",
          paddingLeft: "100%",
          animation: "marquee-ar 28s linear infinite",
        }}
      >
        <span style={{ direction: "rtl", unicodeBidi: "embed" }}>{text}</span>
      </div>

      <style>{`
        @keyframes marquee-ar {
          from { transform: translateX(0); }
          to   { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
