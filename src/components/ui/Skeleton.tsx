export function ScriptSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      {/* Title card */}
      <div className="card p-5">
        <div className="shimmer h-3 w-16 rounded mb-3" />
        <div className="shimmer h-6 w-3/4 rounded mb-2" />
        <div className="shimmer h-4 w-full rounded mb-1" />
        <div className="shimmer h-4 w-2/3 rounded mb-4" />
        <div className="flex gap-2">
          {[60, 80, 70, 90, 65].map((w, i) => (
            <div key={i} className="shimmer h-5 rounded-full" style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Segments */}
      {['hook', 'body', 'body', 'cta'].map((type, i) => (
        <div key={i} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--c-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="shimmer h-5 w-12 rounded-lg" />
            <div className="shimmer h-4 w-8 rounded" />
          </div>
          <div className="shimmer h-4 w-full rounded mb-2" />
          <div className="shimmer h-4 w-4/5 rounded mb-2" />
          <div className="shimmer h-4 w-3/5 rounded" />
        </div>
      ))}
    </div>
  )
}

export function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="card p-4">
      <p className="text-xs font-display font-medium tracking-widest mb-1" style={{ color: 'var(--c-muted)' }}>{label}</p>
      <p className="font-display font-bold text-2xl" style={{ color: 'var(--c-text)' }}>{value}</p>
      {sub && <p className="text-xs mt-0.5" style={{ color: 'var(--c-muted)' }}>{sub}</p>}
    </div>
  )
}
