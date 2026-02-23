export interface IterationData {
  iteration: number;
  [key: string]: number | string;
}

export interface MethodResult {
  result?: number | number[];
  iterations?: IterationData[];
  converged: boolean;
  error?: string;
}
