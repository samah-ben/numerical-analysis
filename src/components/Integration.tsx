import { useState } from 'react';
import { compositeTrapezoidal, compositeSimpsons } from '../utils/integration';
import { MethodResult } from '../types';
import { evaluateFunction } from '../utils/mathUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface IntegrationProps {
  expression: string;
}

export default function Integration({ expression }: IntegrationProps) {
  const [method, setMethod] = useState<'trapezoidal' | 'simpson'>('trapezoidal');
  const [a, setA] = useState('0');
  const [b, setB] = useState('1');
  const [n, setN] = useState('10');
  const [result, setResult] = useState<MethodResult | null>(null);

  const handleSolve = () => {
    if (!expression) {
      alert('الرجاء إدخال دالة أولاً');
      return;
    }

    let res: MethodResult;
    if (method === 'trapezoidal') {
      res = compositeTrapezoidal(expression, parseFloat(a), parseFloat(b), parseInt(n));
    } else {
      res = compositeSimpsons(expression, parseFloat(a), parseFloat(b), parseInt(n));
    }

    setResult(res);
  };

  const generatePlotData = () => {
    if (!expression) return [];

    try {
      const start = parseFloat(a);
      const end = parseFloat(b);
      const points = 100;
      const step = (end - start) / points;

      const data = [];
      for (let i = 0; i <= points; i++) {
        const x = start + i * step;
        try {
          const y = evaluateFunction(expression, x);
          data.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(4)) });
        } catch {
          continue;
        }
      }
      return data;
    } catch {
      return [];
    }
  };

  const plotData = generatePlotData();

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">التكامل العددي</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">اختر الطريقة</label>
          <div className="flex gap-4">
            <button
              onClick={() => setMethod('trapezoidal')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'trapezoidal'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              شبه المنحرف (Trapezoidal)
            </button>
            <button
              onClick={() => setMethod('simpson')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'simpson'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              سمبسون (Simpson)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">a (الحد الأدنى)</label>
            <input
              type="number"
              step="any"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">b (الحد الأعلى)</label>
            <input
              type="number"
              step="any"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              n (عدد الفواصل) {method === 'simpson' && '(يجب أن يكون زوجي)'}
            </label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSolve}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
        >
          حساب التكامل
        </button>
      </div>

      {plotData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">رسم الدالة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: 'x', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'f(x)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Area type="monotone" dataKey="y" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {result.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {result.error}
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">النتيجة</h3>
              <p className="text-3xl font-bold text-gray-900">
                ∫ f(x) dx ≈ {typeof result.result === 'number' ? result.result.toFixed(10) : 'N/A'}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                على الفترة [{a}, {b}] باستخدام {n} فاصل
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
