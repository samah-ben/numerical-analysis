import { useState } from 'react';
import { gaussElimination, jacobiMethod, gaussSeidelMethod } from '../utils/linearSystems';
import { MethodResult } from '../types';
import IterationTable from './IterationTable';
import ConvergenceChart from './ConvergenceChart';

export default function LinearSystems() {
  const [method, setMethod] = useState<'gauss' | 'jacobi' | 'gauss-seidel'>('gauss');
  const [n, setN] = useState('3');
  const [matrixA, setMatrixA] = useState<string[][]>([
    ['4', '-1', '0'],
    ['-1', '4', '-1'],
    ['0', '-1', '4']
  ]);
  const [vectorB, setVectorB] = useState<string[]>(['15', '10', '10']);
  const [tolerance, setTolerance] = useState('0.0001');
  const [maxIter, setMaxIter] = useState('50');
  const [result, setResult] = useState<MethodResult | null>(null);

  const handleNChange = (newN: string) => {
    const num = parseInt(newN) || 3;
    setN(newN);

    const newMatrix = Array(num).fill(0).map((_, i) =>
      Array(num).fill(0).map((_, j) =>
        i < matrixA.length && j < matrixA[0].length ? matrixA[i][j] : (i === j ? '1' : '0')
      )
    );

    const newVector = Array(num).fill(0).map((_, i) =>
      i < vectorB.length ? vectorB[i] : '0'
    );

    setMatrixA(newMatrix);
    setVectorB(newVector);
  };

  const handleMatrixChange = (i: number, j: number, value: string) => {
    const newMatrix = [...matrixA];
    newMatrix[i][j] = value;
    setMatrixA(newMatrix);
  };

  const handleVectorChange = (i: number, value: string) => {
    const newVector = [...vectorB];
    newVector[i] = value;
    setVectorB(newVector);
  };

  const handleSolve = () => {
    const A = matrixA.map(row => row.map(val => parseFloat(val) || 0));
    const b = vectorB.map(val => parseFloat(val) || 0);

    let res: MethodResult;
    if (method === 'gauss') {
      res = gaussElimination(A, b);
    } else if (method === 'jacobi') {
      res = jacobiMethod(A, b, parseFloat(tolerance), parseInt(maxIter));
    } else {
      res = gaussSeidelMethod(A, b, parseFloat(tolerance), parseInt(maxIter));
    }

    setResult(res);
  };

  const dimension = parseInt(n) || 3;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">حل الأنظمة الخطية (Ax = b)</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">اختر الطريقة</label>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setMethod('gauss')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'gauss'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              حذف غاوس (Gauss)
            </button>
            <button
              onClick={() => setMethod('jacobi')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'jacobi'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              جاكوبي (Jacobi)
            </button>
            <button
              onClick={() => setMethod('gauss-seidel')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                method === 'gauss-seidel'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              غاوس-سيدل (Gauss-Seidel)
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">البعد n</label>
          <input
            type="number"
            min="2"
            max="6"
            value={n}
            onChange={(e) => handleNChange(e.target.value)}
            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">المصفوفة A</label>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {Array(dimension).fill(0).map((_, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  {Array(dimension).fill(0).map((_, j) => (
                    <input
                      key={`${i}-${j}`}
                      type="number"
                      step="any"
                      value={matrixA[i]?.[j] || '0'}
                      onChange={(e) => handleMatrixChange(i, j, e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">المتجه b</label>
          <div className="flex gap-2">
            {Array(dimension).fill(0).map((_, i) => (
              <input
                key={i}
                type="number"
                step="any"
                value={vectorB[i] || '0'}
                onChange={(e) => handleVectorChange(i, e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>
        </div>

        {method !== 'gauss' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
        )}

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
                <h3 className="text-lg font-semibold mb-3 text-gray-800">الحل</h3>
                {Array.isArray(result.result) && (
                  <div className="space-y-2">
                    {result.result.map((val, idx) => (
                      <p key={idx} className="text-lg font-mono">
                        x<sub>{idx + 1}</sub> = {val.toFixed(8)}
                      </p>
                    ))}
                  </div>
                )}
                {!result.converged && (
                  <p className="mt-3 text-yellow-700">تحذير: لم يتم التقارب الكامل</p>
                )}
              </div>

              {result.iterations && result.iterations.length > 0 && (
                <>
                  <IterationTable data={result.iterations} />
                  <ConvergenceChart data={result.iterations} errorKey="maxDiff" title="منحنى التقارب - الفرق الأقصى" />
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
