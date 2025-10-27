import { Context, Effect, Layer } from 'effect';

import { ordersRepository } from './ordersRepository';
import { productsRepository } from './productsRepository';
import { usersRepository } from './usersRepository';

export class RepositoryServiceTag extends Context.Tag('RepositoryService')<
  RepositoryServiceTag,
  RepositoryService
>() {}

export class EffectRepositoryError {
  readonly _tag = 'EffectRepositoryError';
  constructor(
    public readonly message: string,
    public readonly cause?: unknown,
  ) {}
}

export interface RepositoryService {
  readonly orders: {
    readonly getOneById: (
      id: string,
    ) => Effect.Effect<
      Awaited<ReturnType<typeof ordersRepository.getOneById>>,
      EffectRepositoryError
    >;
    readonly getOneByIdempotencyKey: (
      key: string,
    ) => Effect.Effect<
      Awaited<ReturnType<typeof ordersRepository.getOneByIdempotencyKey>>,
      EffectRepositoryError
    >;
  };
  readonly users: {
    readonly getOneById: (
      id: string,
    ) => Effect.Effect<
      Awaited<ReturnType<typeof usersRepository.getOneById>>,
      EffectRepositoryError
    >;
  };
  readonly products: {
    readonly getOneById: (
      id: string,
    ) => Effect.Effect<
      Awaited<ReturnType<typeof productsRepository.getOneById>>,
      EffectRepositoryError
    >;
  };
}
export const repositoryEffectAdaptor = <A>(
  promise: () => Promise<A>,
): Effect.Effect<A, EffectRepositoryError> =>
  Effect.tryPromise({
    try: promise,
    catch: (error) => {
      return new EffectRepositoryError(
        error instanceof Error
          ? error.message
          : 'Repository method threw an error',
        error,
      );
    },
  });

export const RepositoryServiceLive: Layer.Layer<RepositoryServiceTag> =
  Layer.succeed(
    RepositoryServiceTag,
    RepositoryServiceTag.of({
      orders: {
        getOneById: (id) =>
          repositoryEffectAdaptor(() => ordersRepository.getOneById(id)),
        getOneByIdempotencyKey: (key) =>
          repositoryEffectAdaptor(() =>
            ordersRepository.getOneByIdempotencyKey(key),
          ),
      },
      users: {
        getOneById: (id) =>
          repositoryEffectAdaptor(() => usersRepository.getOneById(id)),
      },
      products: {
        getOneById: (id) =>
          repositoryEffectAdaptor(() => productsRepository.getOneById(id)),
      },
    }),
  );
