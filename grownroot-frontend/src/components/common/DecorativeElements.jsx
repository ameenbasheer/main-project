export default function DecorativeElements() {
  return (
    <>
      {/* Large circle top-left */}
      <div className="bg-circle bg-circle-lg -top-40 -left-40 opacity-60" />
      {/* Medium circle bottom-right */}
      <div className="bg-circle bg-circle-md -bottom-20 -right-20 opacity-40" />
      {/* Small circle mid-right */}
      <div className="bg-circle bg-circle-sm top-1/3 -right-10 opacity-30" />
      {/* Dots */}
      <div className="bg-dot w-8 h-8 top-32 left-1/3 opacity-50" />
      <div className="bg-dot w-5 h-5 top-48 right-1/4 opacity-30" />
      <div className="bg-dot w-3 h-3 bottom-40 left-1/4 opacity-40" />
    </>
  );
}

export function DecorativeCircle({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-72 h-72',
    xl: 'w-96 h-96',
  };

  return (
    <div
      className={`absolute rounded-full border-2 border-accent/20 pointer-events-none ${sizeMap[size]} ${className}`}
    />
  );
}

export function DecorativeDot({ size = 8, className = '' }) {
  return (
    <div
      className={`absolute rounded-full bg-accent/40 pointer-events-none ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
