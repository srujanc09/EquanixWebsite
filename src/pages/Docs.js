import React from "react";

export default function Docs() {
  return (
    <div className="docs-inner-content">
      <div className="docs-container">
        <h1>Documentation</h1>
        <div className="docs-section">
          <h2>Getting Started</h2>
          <p>Welcome to Equanix documentation. Here you'll find everything you need to get started with our platform.</p>
          
          <h3>Installation</h3>
          <pre><code>npm install equanix-sdk</code></pre>
          
          <h3>Quick Start</h3>
          <p>Initialize Equanix in your project:</p>
          <pre><code>{`
import { Equanix } from 'equanix-sdk';

const client = new Equanix({
  apiKey: 'your-api-key',
  environment: 'production'
});
          `}</code></pre>
          
          <h2>API Reference</h2>
          <p>Comprehensive API documentation for all available endpoints and methods.</p>
          
          <h2>Examples</h2>
          <p>Code examples and tutorials to help you implement Equanix features.</p>
          
          <h2>Support</h2>
          <p>Need help? Contact our support team or check out our community forums.</p>
        </div>
      </div>
    </div>
  );
}
