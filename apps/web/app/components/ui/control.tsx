export const Control = ({
  label,
  children,
  className,
}: {
  label: React.ReactNode
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div className={className}>
      <div className="mb-1">
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}
