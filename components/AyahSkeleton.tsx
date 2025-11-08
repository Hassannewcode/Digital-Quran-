import React from 'react';

const AyahSkeleton: React.FC = () => {
  return (
    <div className="px-4 md:px-6 py-12 group">
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="h-5 w-10 shimmer-bg rounded-md"></div>
                <div className="w-10 h-10 shimmer-bg rounded-full"></div>
                <div className="w-10 h-10 shimmer-bg rounded-full"></div>
                <div className="w-10 h-10 shimmer-bg rounded-full"></div>
                <div className="w-10 h-10 shimmer-bg rounded-full"></div>
            </div>
            <div className="flex-1 space-y-4">
                <div className="h-8 shimmer-bg rounded w-full"></div>
                <div className="h-8 shimmer-bg rounded w-5/6"></div>
                <div className="h-8 shimmer-bg rounded w-3/4"></div>
                <div className="space-y-2 pt-4">
                    <div className="h-4 shimmer-bg rounded w-full"></div>
                    <div className="h-4 shimmer-bg rounded w-4/5"></div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AyahSkeleton;
