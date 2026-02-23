import { evaluate, derivative, parse } from 'mathjs';

export function evaluateFunction(expr: string, x: number): number {
  try {
    return evaluate(expr, { x });
  } catch (error) {
    throw new Error('خطأ في تقييم الدالة');
  }
}

export function numericalDerivative(expr: string, x: number, h: number = 1e-6): number {
  try {
    return (evaluateFunction(expr, x + h) - evaluateFunction(expr, x - h)) / (2 * h);
  } catch (error) {
    throw new Error('خطأ في حساب المشتق');
  }
}

export function validateExpression(expr: string): boolean {
  try {
    parse(expr);
    return true;
  } catch {
    return false;
  }
}
