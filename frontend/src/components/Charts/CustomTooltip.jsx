import React from 'react';

const CustomTooltip = ({ active, payload }) => {
  // guard clauses – bail out if tooltip shouldn't render
  if (!active || !payload || !payload.length || payload[0] == null) {
    return null;
  }

  const { status, count } = payload[0].payload; // safe now

  return (
    <div className="bg-white p-2 border rounded shadow text-sm">
      <p className="font-semibold">{status}</p>
      <p>Count: {count}</p>
    </div>
  );
};

export default CustomTooltip;

