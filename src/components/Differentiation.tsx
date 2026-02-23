import { useState } from 'react';
import { forwardDifference, backwardDifference, centralDifference } from '../utils/differentiation';
import { MethodResult } from '../types';
import { evaluateFunction } from '../utils/mathUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DifferentiationProps {
  expression: string;
}

export default function Differentiation({ expression }: DifferentiationProps) {
  const [method, setMethod] = useState<'forward' | 'backward' | 'central'>('central');
  const [x0, setX0] = useState('1');
  const [h, setH] = useState('0.001');
  const [result, setResult] = useState<MethodResult | null>(null);

  const handleSolve = () => {
    if (!expression) {
      alert('الرجاء إدخال دالة أولاً');
      return;
    }

    let res: MethodResult;
    const x0Val = parseFloat(x0);
    const hVal = parseFloat(h);

    if (method === 'forward') {
      res = forwardDifference(expression, x0Val, hVal);
    } else if (method === 'backward') {
      res = backwardDifference(expression, x0Val, hVal);
    } else {
      res = centralDifference(expression, x0Val, hVal);
    }

    setResult(res);
  };

  const generatePlotData = () => {
    if (!expression) return [];

    try {
      const x0Val = parseFloat(x0);
      const range = 2;
      const points = 100;
      const step = (2 * range) / points;

      const data = [];
      for (let i = 0; i <= points; i++) {
        const x = x0Val - range + i * step;
        try {
          const y = evaluateFunction(expression, x);
          data.push({
            x: parseFloat(x.toFixed(4)),
            'f(x)': parseFloat(y.toFixed(4)),
            x0: x === x0Val ? y : null
          });
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800">الاشتقاق العددي</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">اختر الطريقة</label>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setMethod('forward')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'forward'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              الفرق الأمامي (Forward)
            </button>
            <button
              onClick={() => setMethod('backward')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'backward'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              الفرق الخلفي (Backward)
            </button>
            <button
              onClick={() => setMethod('central')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'central'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              الفرق المركزي (Central)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">x₀ (النقطة)</label>
            <input
              type="number"
              step="any"
              value={x0}
              onChange={(e) => setX0(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">h (الخطوة)</label>
            <input
              type="number"
              step="any"
              value={h}
              onChange={(e) => setH(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSolve}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
        >
          حساب المشتق
        </button>
      </div>

      {plotData.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">رسم الدالة</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={plotData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" label={{ value: 'x', position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: 'f(x)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="f(x)" stroke="#2563eb" strokeWidth={2} dot={false} />
            </LineChart>
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
                f'({x0}) ≈ {typeof result.result === 'number' ? result.result.toFixed(10) : 'N/A'}
              </p>
              <p className="mt-2 text-sm text-gray-600">
                باستخدام طريقة {
                  method === 'forward' ? 'الفرق الأمامي' :
                  method === 'backward' ? 'الفرق الخلفي' :
                  'الفرق المركزي'
                } مع h = {h}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
