import React from 'react';

export function FrameLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Name, Name</h1>
          {children}
        </div>
      </div>
    </div>
  );
} 