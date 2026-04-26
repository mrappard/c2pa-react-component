import React from 'react';

export interface KeyValueDisplayerProps {
  label: string;
  value: React.ReactNode;
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: "16px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748b", // slate-500
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    marginBottom: "4px",
  },
  value: {
    fontSize: "16px",
    color: "#1e293b", // slate-800
    lineHeight: "1.5",
  },
};

export default function KeyValueDisplayer({ label, value }: KeyValueDisplayerProps) {
  if (!value) return null;

  // If value is an array, we might want to join it or map it, 
  // but for now let's handle basic string/node display.
  
  return (
    <div style={styles.container}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{value}</div>
    </div>
  );
}
