import { MethodResult, IterationData } from '../types';

export function gaussElimination(A: number[][], b: number[]): MethodResult {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  try {
    for (let k = 0; k < n; k++) {
      let pivot = k;
      for (let i = k + 1; i < n; i++) {
        if (Math.abs(augmented[i][k]) > Math.abs(augmented[pivot][k])) {
          pivot = i;
        }
      }

      if (pivot !== k) {
        [augmented[k], augmented[pivot]] = [augmented[pivot], augmented[k]];
      }

      if (Math.abs(augmented[k][k]) < 1e-14) {
        return {
          converged: false,
          error: 'المصفوفة شبه منفردة'
        };
      }

      for (let i = k + 1; i < n; i++) {
        const factor = augmented[i][k] / augmented[k][k];
        for (let j = k; j <= n; j++) {
          augmented[i][j] -= factor * augmented[k][j];
        }
      }
    }

    const x: number[] = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) {
        sum += augmented[i][j] * x[j];
      }
      if (Math.abs(augmented[i][i]) < 1e-14) {
        return {
          converged: false,
          error: 'القسمة على صفر في القطر'
        };
      }
      x[i] = (augmented[i][n] - sum) / augmented[i][i];
    }

    return {
      result: x.map(val => parseFloat(val.toFixed(8))),
      converged: true
    };
  } catch (error) {
    return {
      converged: false,
      error: error instanceof Error ? error.message : 'حدث خطأ غير معروف'
    };
  }
}

export function jacobiMethod(
  A: number[][],
  b: number[],
  tolerance: number,
  maxIterations: number
): MethodResult {
  const n = A.length;
  const iterations: IterationData[] = [];

  for (let i = 0; i < n; i++) {
    if (Math.abs(A[i][i]) < 1e-14) {
      return {
        converged: false,
        error: 'القطر يحتوي على صفر'
      };
    }
  }

  let x = new Array(n).fill(0);

  for (let k = 0; k < maxIterations; k++) {
    const xNew = new Array(n).fill(0);
    let maxDiff = 0;

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
        }
      }
      xNew[i] = (b[i] - sum) / A[i][i];
      maxDiff = Math.max(maxDiff, Math.abs(xNew[i] - x[i]));
    }

    const iterData: IterationData = {
      iteration: k + 1,
      maxDiff: parseFloat(maxDiff.toFixed(8))
    };

    xNew.forEach((val, i) => {
      iterData[`x${i + 1}`] = parseFloat(val.toFixed(6));
    });

    iterations.push(iterData);
    x = xNew;

    if (maxDiff < tolerance) {
      return {
        result: x.map(val => parseFloat(val.toFixed(8))),
        iterations,
        converged: true
      };
    }
  }

  return {
    result: x.map(val => parseFloat(val.toFixed(8))),
    iterations,
    converged: false,
    error: 'تم الوصول للحد الأقصى من التكرارات'
  };
}

export function gaussSeidelMethod(
  A: number[][],
  b: number[],
  tolerance: number,
  maxIterations: number
): MethodResult {
  const n = A.length;
  const iterations: IterationData[] = [];

  for (let i = 0; i < n; i++) {
    if (Math.abs(A[i][i]) < 1e-14) {
      return {
        converged: false,
        error: 'القطر يحتوي على صفر'
      };
    }
  }

  const x = new Array(n).fill(0);

  for (let k = 0; k < maxIterations; k++) {
    let maxDiff = 0;
    const xOld = [...x];

    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let j = 0; j < n; j++) {
        if (j !== i) {
          sum += A[i][j] * x[j];
        }
      }
      const xNewI = (b[i] - sum) / A[i][i];
      maxDiff = Math.max(maxDiff, Math.abs(xNewI - x[i]));
      x[i] = xNewI;
    }

    const iterData: IterationData = {
      iteration: k + 1,
      maxDiff: parseFloat(maxDiff.toFixed(8))
    };

    x.forEach((val, i) => {
      iterData[`x${i + 1}`] = parseFloat(val.toFixed(6));
    });

    iterations.push(iterData);

    if (maxDiff < tolerance) {
      return {
        result: x.map(val => parseFloat(val.toFixed(8))),
        iterations,
        converged: true
      };
    }
  }

  return {
    result: x.map(val => parseFloat(val.toFixed(8))),
    iterations,
    converged: false,
    error: 'تم الوصول للحد الأقصى من التكرارات'
  };
}
