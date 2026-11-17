// gatsby-ssr.js
import React from 'react';
import ChatWidget from './src/components/ChatWidget';

// Same root wrap on the server so the initial HTML contains the chat widget
// container and client hydration doesn't mismatch.
export const wrapRootElement = ({ element }) => (
  <>
    {element}
    <ChatWidget />
  </>
);
