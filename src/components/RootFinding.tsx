import { useState } from 'react';
import { bisectionMethod, newtonMethod } from '../utils/rootFinding';
import { MethodResult } from '../types';
import IterationTable from './IterationTable';
import ConvergenceChart from './ConvergenceChart';

interface RootFindingProps {
  expression: string;
}

export default function RootFinding({ expression }: RootFindingProps) {
  const [method, setMethod] = useState<'bisection' | 'newton'>('bisection');
  const [a, setA] = useState('0');
  const [b, setB] = useState('2');
  const [x0, setX0] = useState('1');
  const [tolerance, setTolerance] = useState('0.0001');
  const [maxIter, setMaxIter] = useState('50');
  const [result, setResult] = useState<MethodResult | null>(null);

  const handleSolve = () => {
    if (!expression) {
      alert('الرجاء إدخال دالة أولاً');
      return;
    }

    if (method === 'bisection') {
      const res = bisectionMethod(
        expression,
        parseFloat(a),
        parseFloat(b),
        parseFloat(tolerance),
        parseInt(maxIter)
      );
      setResult(res);
    } else {
      const res = newtonMethod(
        expression,
        parseFloat(x0),
        parseFloat(tolerance),
        parseInt(maxIter)
      );
      setResult(res);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">إيجاد الجذور</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">اختر الطريقة</label>
          <div className="flex gap-4">
            <button
              onClick={() => setMethod('bisection')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'bisection'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              طريقة التنصيف (Bisection)
            </button>
            <button
              onClick={() => setMethod('newton')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'newton'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              طريقة نيوتن (Newton)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {method === 'bisection' ? (
            <>
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
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">x₀ (القيمة الابتدائية)</label>
              <input
                type="number"
                step="any"
                value={x0}
                onChange={(e) => setX0(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التفاوت (Tolerance)</label>
            <input
              type="number"
              step="any"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">أقصى عدد للتكرارات</label>
            <input
              type="number"
              value={maxIter}
              onChange={(e) => setMaxIter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={handleSolve}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
        >
          حل
        </button>
      </div>

      {result && (
        <div className="space-y-6">
          {result.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {result.error}
            </div>
          ) : (
            <>
              <div className={`p-6 rounded-lg shadow ${result.converged ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">النتيجة</h3>
                <p className="text-2xl font-bold text-gray-900">
                  الجذر ≈ {typeof result.result === 'number' ? result.result.toFixed(10) : 'N/A'}
                </p>
                <p className={`mt-2 ${result.converged ? 'text-green-700' : 'text-yellow-700'}`}>
                  {result.converged ? 'تم التقارب بنجاح' : 'لم يتم التقارب الكامل'}
                </p>
              </div>

              {result.iterations && result.iterations.length > 0 && (
                <>
                  <IterationTable data={result.iterations} />
                  {method === 'bisection' && (
                    <ConvergenceChart data={result.iterations} errorKey="|b-a|" title="منحنى التقارب - عرض الفترة" />
                  )}
                  {method === 'newton' && (
                    <ConvergenceChart data={result.iterations} errorKey="f(x_i)" title="منحنى التقارب - قيمة الدالة" />
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
