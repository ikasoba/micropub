export type GetValidatorType<V extends (x: any) => x is any> = V extends (
  x: any
) => x is infer T
  ? T
  : any;

export const is = <O, V extends (x: O) => x is any>(
  x: O,
  validator: V
): x is O & GetValidatorType<V> => validator(x);
