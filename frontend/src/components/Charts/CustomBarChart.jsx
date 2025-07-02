import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CustomBarChart = ({ data }) => {
  const getBarColor = (priority) => {
    switch (priority) {
      case "Low":
        return "#00BC7D";
      case "Medium":
        return "#FFB703";
      case "High":
        return "#FF1F57";
      default:
        return "#8884d8";
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-sm font-semibold">{payload[0].payload.priority}</p>
          <p className="text-sm">Count: {payload[0].payload.count}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-2 w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="priority" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" radius={[10, 10, 0, 0]} stroke="#e5e7eb" strokeWidth={1}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.priority)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;







