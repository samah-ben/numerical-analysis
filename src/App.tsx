import { useState } from 'react';
import { Calculator, TrendingUp, Grid3x3, Sigma, Gauge } from 'lucide-react';
import { validateExpression } from './utils/mathUtils';
import RootFinding from './components/RootFinding';
import LinearSystems from './components/LinearSystems';
import Integration from './components/Integration';
import Differentiation from './components/Differentiation';

type Tab = 'root-finding' | 'linear-systems' | 'integration' | 'differentiation';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('root-finding');
  const [expression, setExpression] = useState('x^3 - 2*x - 5');
  const [expressionError, setExpressionError] = useState('');

  const handleExpressionChange = (value: string) => {
    setExpression(value);
    if (value && !validateExpression(value)) {
      setExpressionError('صيغة الدالة غير صحيحة');
    } else {
      setExpressionError('');
    }
  };

  const tabs = [
    { id: 'root-finding', label: 'إيجاد الجذور', icon: TrendingUp },
    { id: 'linear-systems', label: 'الأنظمة الخطية', icon: Grid3x3 },
    { id: 'integration', label: 'التكامل العددي', icon: Sigma },
    { id: 'differentiation', label: 'الاشتقاق العددي', icon: Gauge },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
              <Calculator className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">التحليل العددي</h1>
              <p className="text-gray-600 mt-1">تطبيق تفاعلي لطرق التحليل العددي</p>
            </div>
          </div>

          {activeTab !== 'linear-systems' && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                أدخل الدالة f(x)
              </label>
              <input
                type="text"
                value={expression}
                onChange={(e) => handleExpressionChange(e.target.value)}
                placeholder="مثال: x^3 - 2*x - 5 أو sin(x) أو exp(-x)"
                className={`w-full px-4 py-3 border rounded-lg text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  expressionError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {expressionError && (
                <p className="mt-2 text-sm text-red-600">{expressionError}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                استخدم: +، -، *، /، ^، sin، cos، tan، exp، log، sqrt، abs
              </p>
            </div>
          )}
        </header>

        <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium whitespace-nowrap transition-all border-b-2 ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 bg-white'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'root-finding' && <RootFinding expression={expression} />}
            {activeTab === 'linear-systems' && <LinearSystems />}
            {activeTab === 'integration' && <Integration expression={expression} />}
            {activeTab === 'differentiation' && <Differentiation expression={expression} />}
          </div>
        </div>

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>تطبيق التحليل العددي - يدعم طرق التنصيف، نيوتن، غاوس، جاكوبي، التكامل والاشتقاق العددي</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
