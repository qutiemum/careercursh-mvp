import React from 'react';

export default function App() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      lineHeight: '1.6'
    }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
          CareerCrush MVP
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          Strategic Career Intelligence Platform
        </p>
      </header>

      <main>
        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2563eb' }}>🎯 Core Value Proposition</h2>
          <p>
            Instead of generic resume optimization, CareerCrush delivers <strong>Strategic Career Intelligence</strong> that positions candidates as insiders who understand the company's business challenges and strategic priorities.
          </p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2563eb' }}>📊 Example Transformation</h2>
          <div style={{ 
            backgroundColor: '#f8fafc', 
            padding: '1.5rem', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p><strong>From Generic:</strong> "Healthcare consultant with project management experience"</p>
            <p><strong>To Strategic:</strong> "The strategic operations leader who has already solved NPHS's exact challenge: scaling AI-driven healthcare technology across distributed teams while maintaining operational excellence"</p>
          </div>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2 style={{ color: '#2563eb' }}>💰 Business Model</h2>
          <ul>
            <li><strong>Target Market:</strong> Senior professionals ($100K+ salary) applying to strategic roles</li>
            <li><strong>Price Point:</strong> $149-249 per strategic analysis</li>
            <li><strong>Delivery:</strong> 2-3 day turnaround for premium strategic intelligence</li>
            <li><strong>Scale:</strong> 50-100 analyses per month (boutique, high-value)</li>
          </ul>
        </section>

        <footer style={{ 
          textAlign: 'center', 
          marginTop: '3rem', 
          padding: '2rem',
          backgroundColor: '#1f2937',
          color: 'white',
          borderRadius: '8px'
        }}>
          <p>Ready to transform your career positioning?</p>
          <p style={{ fontSize: '0.9rem', opacity: '0.8' }}>
            This is a strategic consulting service with tech enablement, not a traditional tech startup.
          </p>
        </footer>
      </main>
    </div>
  );
}


