import React from 'react';
import CreateFrame from './frames/create';

export default function Home() {
  return (
    <div>
      <h1>Welcome to Name, Name</h1>
      <CreateFrame roomId="abc123" category="Cars" link="https://name-name.xyz/room/abc123" />
    </div>
  );
} 