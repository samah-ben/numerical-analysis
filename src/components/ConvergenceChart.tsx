import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IterationData } from '../types';

interface ConvergenceChartProps {
  data: IterationData[];
  errorKey?: string;
  title?: string;
}

export default function ConvergenceChart({ data, errorKey = 'maxDiff', title = 'منحنى التقارب' }: ConvergenceChartProps) {
  if (!data || data.length === 0) return null;

  const hasErrorKey = data.some(item => errorKey in item);

  if (!hasErrorKey) {
    const keys = Object.keys(data[0]).filter(k => k !== 'iteration');
    const numericKeys = keys.filter(k => typeof data[0][k] === 'number');

    if (numericKeys.length === 0) return null;

    return (
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="iteration" label={{ value: 'التكرار', position: 'insideBottom', offset: -5 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            {numericKeys.slice(0, 5).map((key, idx) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={`hsl(${idx * 60}, 70%, 50%)`}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="iteration" label={{ value: 'التكرار', position: 'insideBottom', offset: -5 }} />
          <YAxis scale="log" domain={['auto', 'auto']} label={{ value: 'الخطأ (مقياس لوغاريتمي)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey={errorKey}
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="الخطأ"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
