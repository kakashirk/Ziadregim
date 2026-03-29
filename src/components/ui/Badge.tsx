import type { ReactNode } from 'react'

type BadgeColor = 'green' | 'orange' | 'red' | 'blue' | 'gray'

const colorClasses: Record<BadgeColor, string> = {
  green: 'bg-green-100 text-green-800',
  orange: 'bg-orange-100 text-orange-800',
  red: 'bg-red-100 text-red-800',
  blue: 'bg-blue-100 text-blue-800',
  gray: 'bg-gray-100 text-gray-700',
}

interface BadgeProps {
  color?: BadgeColor
  children: ReactNode
}

export function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]}`}>
      {children}
    </span>
  )
}
