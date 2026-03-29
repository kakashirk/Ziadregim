interface ProgressBarProps {
  value: number // 0-100
  className?: string
  colorClass?: string
}

export function ProgressBar({ value, className = '', colorClass }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value))
  const color = colorClass ?? (pct >= 100 ? 'bg-red-500' : pct >= 85 ? 'bg-orange-400' : 'bg-brand-500')
  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

interface CircularProgressProps {
  value: number // 0-100+
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}

export function CircularProgress({ value, size = 140, strokeWidth = 12, label, sublabel }: CircularProgressProps) {
  const r = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * r
  const pct = Math.min(100, Math.max(0, value))
  const offset = circumference - (pct / 100) * circumference
  const color = value >= 100 ? '#ef4444' : value >= 85 ? '#f97316' : '#16a34a'

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {label && <span className="text-xl font-bold text-gray-900">{label}</span>}
        {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
      </div>
    </div>
  )
}
