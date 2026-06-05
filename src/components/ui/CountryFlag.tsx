export function CountryFlag({ code, name, size = 'md' }: { code: string; name?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }

  const flagUrl = `https://flagcdn.com/w40/${code.toLowerCase()}.png`

  return (
    <span className={`inline-flex items-center ${sizeClasses[size]}`} title={name}>
      <img
        src={flagUrl}
        alt={name || code}
        className={size === 'sm' ? 'w-5 h-3.5' : size === 'md' ? 'w-7 h-5' : 'w-10 h-7'}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none'
        }}
      />
    </span>
  )
}
