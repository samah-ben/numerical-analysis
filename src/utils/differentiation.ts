import { evaluateFunction } from './mathUtils';
import { MethodResult } from '../types';

export function forwardDifference(expr: string, x0: number, h: number): MethodResult {
  try {
    const result = (evaluateFunction(expr, x0 + h) - evaluateFunction(expr, x0)) / h;
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

export function backwardDifference(expr: string, x0: number, h: number): MethodResult {
  try {
    const result = (evaluateFunction(expr, x0) - evaluateFunction(expr, x0 - h)) / h;
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

export function centralDifference(expr: string, x0: number, h: number): MethodResult {
  try {
    const result = (evaluateFunction(expr, x0 + h) - evaluateFunction(expr, x0 - h)) / (2 * h);
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
