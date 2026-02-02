function SkeletonCard() {
  return (
    <div className="bg-gradient-to-br from-gray-800/70 to-gray-900/70 border border-gray-700 rounded-lg p-4 animate-pulse">
      <div className="w-full h-48 bg-gray-700 rounded-lg mb-3"></div>
      <div className="h-4 bg-gray-700 rounded mb-2"></div>
      <div className="h-3 bg-gray-700 rounded w-3/4 mb-3"></div>
      <div className="flex gap-3">
        <div className="flex-1 h-8 bg-gray-700 rounded"></div>
        <div className="flex-1 h-8 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

export default SkeletonCard;