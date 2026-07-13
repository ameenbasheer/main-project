export default function Card({ children, className = '', hover = false, onClick, ...rest }) {
  // When the card is interactive (has an onClick), make it keyboard-accessible
  // so Enter/Space activate it just like a click.
  const interactiveProps = onClick
    ? {
        onClick,
        tabIndex: rest.tabIndex ?? 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
          rest.onKeyDown?.(e);
        },
      }
    : {};

  return (
    <div
      className={`glass-card p-5 ${hover ? 'stat-card' : ''} ${className}`}
      {...rest}
      {...interactiveProps}
    >
      {children}
    </div>
  );
}
