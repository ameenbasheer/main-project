import useScrollReveal from '../../hooks/useScrollReveal';

export default function Reveal({
  as: Tag = 'div',
  direction = 'up',
  delay = 0,
  className = '',
  children,
  ...rest
}) {
  const [ref, inView] = useScrollReveal();
  const dirClass =
    direction === 'left'  ? 'reveal-left'  :
    direction === 'right' ? 'reveal-right' :
    direction === 'scale' ? 'reveal-scale' :
    direction === 'tilt'  ? 'reveal-tilt'  : '';
  return (
    <Tag
      ref={ref}
      data-delay={delay || undefined}
      className={`reveal ${dirClass} ${inView ? 'in-view' : ''} ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
