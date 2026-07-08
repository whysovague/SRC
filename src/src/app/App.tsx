import { useState } from "react";

export default function App() {
  return (
    <div style={{ background: '#050D18', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '60px', color: '#0CBFCE', margin: '0 0 20px 0' }}>SRC 2026</h1>
      <h2 style={{ color: '#E87C2A', margin: '0 0 40px 0' }}>King Fahd University of Petroleum & Minerals</h2>
      <input 
        type="text" 
        placeholder="Type something here to test live typing..." 
        style={{ padding: '12px 20px', borderRadius: '8px', border: '1px solid #0CBFCE', width: '300px', outline: 'none' }} 
      />
    </div>
  );
}