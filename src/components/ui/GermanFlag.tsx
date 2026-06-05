export function JapanFlag({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: { width: 24, height: 16 },
    md: { width: 36, height: 24 },
    lg: { width: 48, height: 32 },
  }

  const { width, height } = dims[size]
  const cx = width / 2
  const cy = height / 2
  const r = Math.min(width, height) * 0.28

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="rounded-sm overflow-hidden">
      <rect x="0" y="0" width={width} height={height} fill="#FFFFFF" />
      <circle cx={cx} cy={cy} r={r} fill="#BC002D" />
    </svg>
  )
}

export { JapanFlag as GermanFlag }
