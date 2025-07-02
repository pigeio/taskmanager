import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const DEFAULT_COLORS = ["#8D51FF", "#00B8DB", "#7BCE00", "#FACC15", "#EF4444"];

const CustomPieChart = React.memo(({ data = [], colors = DEFAULT_COLORS }) => {
  const palette = colors?.length ? colors : DEFAULT_COLORS;
  const hasVisibleData = data.some(d => Number(d.count) > 0);

  if (!hasVisibleData) {
    return (
      <div className="text-center py-10 text-gray-400">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart role="img" aria-label="Task distribution pie chart">
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          innerRadius={90}
          outerRadius={130}
          labelLine={false}
          label={({ payload, percent }) =>
            percent > 0.05
              ? `${payload.status}: ${(percent * 100).toFixed(0)}%`
              : ""
          }
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={palette[i % palette.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip />}
          formatter={(val, name, props) => [val, props.payload.status]}
          contentStyle={{ fontSize: "0.875rem" }}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
});

export default CustomPieChart;



