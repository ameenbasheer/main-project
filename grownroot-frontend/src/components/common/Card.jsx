export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={`glass-card p-5 ${hover ? 'stat-card' : ''} ${className}`}>
      {children}
    </div>
  );
}
