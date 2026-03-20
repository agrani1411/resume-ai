"use client";

interface ATSScoreCardProps {
  originalScore: number;
  optimizedScore: number;
}

export function ATSScoreCard({ originalScore, optimizedScore }: ATSScoreCardProps) {
  const improvement = optimizedScore - originalScore;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">ATS Match Score</h3>

      <div className="flex items-center gap-3 mb-3">
        {/* Before */}
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 mb-1">Before</p>
          <div className={`text-2xl font-bold ${getScoreColor(originalScore)}`}>
            {originalScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div className={`h-1.5 rounded-full ${getScoreBg(originalScore)}`} style={{ width: `${originalScore}%` }} />
          </div>
        </div>

        {/* Arrow */}
        <div className="text-gray-400 text-lg">→</div>

        {/* After */}
        <div className="flex-1 text-center">
          <p className="text-xs text-gray-500 mb-1">After</p>
          <div className={`text-2xl font-bold ${getScoreColor(optimizedScore)}`}>
            {optimizedScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div className={`h-1.5 rounded-full ${getScoreBg(optimizedScore)}`} style={{ width: `${optimizedScore}%` }} />
          </div>
        </div>
      </div>

      {/* Improvement badge */}
      {improvement > 0 && (
        <div className="text-center">
          <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            +{improvement}% improvement
          </span>
        </div>
      )}
    </div>
  );
}
