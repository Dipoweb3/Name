import React from 'react';
import { FrameLayout } from '../components/FrameLayout';

export default function CreateFrame({ roomId, category, link }: { roomId: string; category: string; link: string }) {
  return (
    <FrameLayout>
      <div className="space-y-6">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Room Created Successfully!</strong>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Room Details</h2>
          <p className="text-gray-600 mb-2">Category: <span className="font-medium">{category}</span></p>
          <p className="text-gray-600">Room ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{roomId}</span></p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Share Room</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 p-2 border rounded bg-white"
            />
            <button
              onClick={() => navigator.clipboard.writeText(link)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        <button
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          onClick={() => window.location.href = link}
        >
          Join Room
        </button>
      </div>
    </FrameLayout>
  );
} 