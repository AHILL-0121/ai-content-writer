'use client';

export default function SkeletonCard() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="skeleton h-6 w-3/4 mb-3 rounded"></div>
      <div className="skeleton h-4 w-full mb-2 rounded"></div>
      <div className="skeleton h-4 w-5/6 mb-4 rounded"></div>
      <div className="flex justify-between items-center">
        <div className="skeleton h-3 w-20 rounded"></div>
        <div className="skeleton h-3 w-16 rounded"></div>
      </div>
    </div>
  );
}
