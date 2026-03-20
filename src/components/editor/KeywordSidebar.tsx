"use client";

import { ATSKeyword } from "@/types/resume";
import { ATSScoreCard } from "@/components/editor/ATSScoreCard";

interface KeywordSidebarProps {
  keywords: ATSKeyword[];
  originalScore: number;
  optimizedScore: number;
}

export function KeywordSidebar({ keywords, originalScore, optimizedScore }: KeywordSidebarProps) {
  const matched = keywords.filter((k) => k.matched);
  const missing = keywords.filter((k) => !k.matched);
  const matchRate = keywords.length > 0 ? Math.round((matched.length / keywords.length) * 100) : 0;

  return (
    <div className="h-full border-l border-gray-200 bg-gray-50 overflow-y-auto">
      <ATSScoreCard originalScore={originalScore} optimizedScore={optimizedScore} />
      <div className="p-4">
      <h3 className="font-semibold text-gray-900 mb-1">ATS Keywords</h3>
      <p className="text-sm text-gray-500 mb-4">{matchRate}% match ({matched.length}/{keywords.length})</p>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${matchRate}%` }} />
      </div>

      {matched.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Matched</h4>
          <div className="flex flex-wrap gap-1.5">
            {matched.map((k) => (
              <span key={k.term} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {k.term}
              </span>
            ))}
          </div>
        </div>
      )}

      {missing.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Missing</h4>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((k) => (
              <span key={k.term} className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                {k.term}
              </span>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
