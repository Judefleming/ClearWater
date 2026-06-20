interface Props { fill: string; flip?: boolean; }
export default function WaveDivider({ fill, flip }: Props) {
  return (
    <div style={{ lineHeight: 0, transform: flip ? "scaleY(-1)" : undefined }} aria-hidden>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 56 }}>
        <path d="M0,32 C240,8 480,56 720,32 C960,8 1200,56 1440,32 L1440,56 L0,56 Z" fill={fill} />
      </svg>
    </div>
  );
}
