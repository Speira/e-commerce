/** Base types for GraphQL resolvers */

/** AppSync identity information from Cognito */
export interface AppSyncIdentityCognito {
  sub: string;
  issuer: string;
  username: string;
  claims: Record<string, string>;
  sourceIp: string[];
  defaultAuthStrategy: string;
}

/** AppSync request information */
export interface AppSyncRequestContext {
  headers: Record<string, string>;
  requestId: string;
  apiId: string;
}

/** GraphQL context passed to all resolvers (AppSync) */
export interface GraphQLContext {
  /** Cognito user identity */
  identity?: AppSyncIdentityCognito;
  /** Request metadata */
  request?: AppSyncRequestContext;
  /** Computed fields for convenience */
  userId?: string;
  username?: string;
  isAuthenticated: boolean;
}

/** AppSync Lambda GraphQL event */
export interface GraphQLEvent<TArguments = Record<string, unknown>> {
  arguments: TArguments;
  fieldName: string;
  identity?: AppSyncIdentityCognito;
  source?: unknown;
  request?: AppSyncRequestContext;
  prev?: { result: unknown } | null;
}
