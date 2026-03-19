export function LoadingSpinner({ message = "Generating your resume..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}
