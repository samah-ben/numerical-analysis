import { evaluateFunction, numericalDerivative } from './mathUtils';
import { MethodResult, IterationData } from '../types';

export function bisectionMethod(
  expr: string,
  a: number,
  b: number,
  tolerance: number,
  maxIterations: number
): MethodResult {
  const iterations: IterationData[] = [];

  try {
    let fa = evaluateFunction(expr, a);
    let fb = evaluateFunction(expr, b);

    if (fa * fb > 0) {
      return {
        converged: false,
        error: 'f(a) و f(b) يجب أن يكون لهما إشارات مختلفة'
      };
    }

    let iter = 0;
    let c = a;

    while (iter < maxIterations) {
      c = (a + b) / 2;
      const fc = evaluateFunction(expr, c);
      const width = Math.abs(b - a);

      iterations.push({
        iteration: iter + 1,
        a: parseFloat(a.toFixed(10)),
        b: parseFloat(b.toFixed(10)),
        c: parseFloat(c.toFixed(10)),
        'f(c)': parseFloat(fc.toFixed(10)),
        '|b-a|': parseFloat(width.toFixed(10))
      });

      if (Math.abs(fc) < 1e-12 || width / 2 < tolerance) {
        return {
          result: c,
          iterations,
          converged: true
        };
      }

      if (fa * fc < 0) {
        b = c;
        fb = fc;
      } else {
        a = c;
        fa = fc;
      }

      iter++;
    }

    return {
      result: c,
      iterations,
      converged: false,
      error: 'تم الوصول للحد الأقصى من التكرارات'
    };
  } catch (error) {
    return {
      converged: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
}

export function newtonMethod(
  expr: string,
  x0: number,
  tolerance: number,
  maxIterations: number
): MethodResult {
  const iterations: IterationData[] = [];

  try {
    let x = x0;

    for (let i = 0; i < maxIterations; i++) {
      const fx = evaluateFunction(expr, x);
      const fpx = numericalDerivative(expr, x);

      iterations.push({
        iteration: i + 1,
        x_i: parseFloat(x.toFixed(10)),
        'f(x_i)': parseFloat(fx.toFixed(10)),
        "f'(x_i)": parseFloat(fpx.toFixed(10))
      });

      if (Math.abs(fpx) < 1e-14) {
        return {
          iterations,
          converged: false,
          error: 'المشتق قريب من الصفر - الطريقة فشلت'
        };
      }

      const xNext = x - fx / fpx;

      if (Math.abs(xNext - x) < tolerance || Math.abs(evaluateFunction(expr, xNext)) < tolerance) {
        return {
          result: xNext,
          iterations,
          converged: true
        };
      }

      x = xNext;
    }

    return {
      result: x,
      iterations,
      converged: false,
      error: 'تم الوصول للحد الأقصى من التكرارات'
    };
  } catch (error) {
    return {
      converged: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
}
