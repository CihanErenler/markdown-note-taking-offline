const PaneSkeleton = () => (
  <div aria-hidden="true" className="h-full animate-pulse space-y-3 bg-surface p-6">
    <div className="h-4 w-2/3 rounded bg-line" />
    <div className="h-4 w-full rounded bg-line" />
    <div className="h-4 w-5/6 rounded bg-line" />
    <div className="h-4 w-1/2 rounded bg-line" />
  </div>
);

export default PaneSkeleton;
