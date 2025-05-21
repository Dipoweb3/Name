import React from 'react';
import { FrameLayout } from '../components/FrameLayout';

export default function CreateFrame({ roomId, category, link }) {
  return (
    <FrameLayout>
      <h1>Room Created!</h1>
      <p>Category: {category}</p>
      <p>Share this link: <a href={link}>{link}</a></p>
      {/* Button to join or start game */}
    </FrameLayout>
  );
} 