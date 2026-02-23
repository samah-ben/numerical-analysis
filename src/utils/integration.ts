import { evaluateFunction } from './mathUtils';
import { MethodResult } from '../types';

export function compositeTrapezoidal(
  expr: string,
  a: number,
  b: number,
  n: number
): MethodResult {
  try {
    if (n <= 0) {
      return {
        converged: false,
        error: 'عدد الفواصل يجب أن يكون موجب'
      };
    }

    const h = (b - a) / n;
    let sum = 0.5 * (evaluateFunction(expr, a) + evaluateFunction(expr, b));

    for (let i = 1; i < n; i++) {
      sum += evaluateFunction(expr, a + i * h);
    }

    const result = sum * h;

    return {
      result: parseFloat(result.toFixed(10)),
      converged: true
    };
  } catch (error) {
    return {
      converged: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
}

export function compositeSimpsons(
  expr: string,
  a: number,
  b: number,
  n: number
): MethodResult {
  try {
    if (n <= 0 || n % 2 !== 0) {
      return {
        converged: false,
        error: 'n يجب أن يكون موجب وزوجي لطريقة سمبسون'
      };
    }

    const h = (b - a) / n;
    let sum = evaluateFunction(expr, a) + evaluateFunction(expr, b);

    for (let i = 1; i < n; i++) {
      const xi = a + i * h;
      sum += (i % 2 === 0 ? 2.0 : 4.0) * evaluateFunction(expr, xi);
    }

    const result = (h / 3.0) * sum;

    return {
      result: parseFloat(result.toFixed(10)),
      converged: true
    };
  } catch (error) {
    return {
      converged: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
}
