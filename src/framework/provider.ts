// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-types */
import { ClassProvider, FactoryProvider } from '@nestjs/common';
import { Abstract } from '@nestjs/common/interfaces/abstract.interface';
import { Type } from '@nestjs/common/interfaces/type.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractArgTypes<T extends any[]> = {
  [K in keyof T]: Type<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ConstructorArgs<T> = T extends new (...args: infer P) => any ? P : never;

export type Deps = (string | symbol | Function | Type<unknown> | Abstract<unknown>)[] | undefined;

export function factory<T>(Clazz: T, deps: ExtractArgTypes<ConstructorArgs<T>>): FactoryProvider<T> {
  return {
    provide: Clazz as unknown as Type<T>,
    useFactory: (...args) => new (Clazz as unknown as Type<T>)(...args),
    inject: deps as unknown as Deps,
  };
}

export function clazz<T>(Clazz: Type<T>): ClassProvider<T> {
  return {
    provide: Clazz,
    useClass: Clazz,
  };
}
