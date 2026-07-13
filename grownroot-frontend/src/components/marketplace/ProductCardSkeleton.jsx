// Placeholder card shown in the marketplace grid while products load.
// Mirrors ProductCard's layout so the grid doesn't shift when data arrives.
export default function ProductCardSkeleton() {
  return (
    <div className="product-card overflow-hidden flex flex-col animate-pulse">
      <div className="h-40 bg-dark-border/40" />

      <div className="p-4 flex flex-col flex-1">
        <div className="h-4 w-2/3 bg-dark-border/40 rounded mb-2" />
        <div className="h-5 w-1/3 bg-dark-border/40 rounded mb-2" />
        <hr className="border-dark-border my-2" />
        <div className="h-3 w-full bg-dark-border/40 rounded mb-1.5" />
        <div className="h-3 w-4/5 bg-dark-border/40 rounded mb-3" />
        <div className="h-3 w-1/2 bg-dark-border/40 rounded mb-3" />
        <div className="mt-auto h-3 w-1/3 bg-dark-border/40 rounded" />
      </div>
    </div>
  );
}
