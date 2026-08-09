const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      {/* Visual Icon */}
      <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700/50 shadow-inner">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-200 mb-2">
        Your workspace is empty
      </h2>
      <p className="text-slate-500 max-w-sm mb-8">
        Organize your projects, track tasks, and collaborate in real-time. Start
        by creating your first board above.
      </p>

      {/* Subtle arrow pointing to the "New Board" button */}
      <div className="flex flex-col items-center animate-bounce text-blue-500/50">
        <span className="text-xs font-bold uppercase tracking-widest mb-2">
          Create one
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </div>
    </div>
  );
};

export default EmptyState;
