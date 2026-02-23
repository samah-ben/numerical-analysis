import { IterationData } from '../types';

interface IterationTableProps {
  data: IterationData[];
}

export default function IterationTable({ data }: IterationTableProps) {
  if (!data || data.length === 0) return null;

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto mt-6 bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider"
              >
                {col === 'iteration' ? 'التكرار' : col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
            >
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center font-mono"
                >
                  {typeof row[col] === 'number'
                    ? row[col].toLocaleString('en-US', {
                        maximumFractionDigits: 10,
                        minimumFractionDigits: 2,
                      })
                    : row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
