/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';

import type { GraphQLContext } from '../baseSchema';

import type {
  CartItem,
  Order,
  OrderItem,
  Product,
  ProductReview,
  User,
} from './types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDateTime: { input: string; output: string };
  AWSJSON: { input: string; output: string };
};

export type AddToCartInput = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type CartItem = {
  __typename?: 'CartItem';
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  product: Maybe<Product>;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type CartItemResponse = {
  __typename?: 'CartItemResponse';
  data: Maybe<CartItem>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CartItemsResponse = {
  __typename?: 'CartItemsResponse';
  data: Array<CartItem>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CreateOrderInput = {
  idempotencyKey: Scalars['ID']['input'];
  items: Array<OrderItemInput>;
  shippingAddress: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateProductInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  stock?: InputMaybe<Scalars['Int']['input']>;
};

export type CreateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['ID']['input'];
  rating: Scalars['Int']['input'];
};

export type CreateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstName: Scalars['String']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName: Scalars['String']['input'];
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  error: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addToCart: CartItemResponse;
  clearCart: MessageResponse;
  createOrder: OrderResponse;
  createProduct: ProductResponse;
  createReview: ReviewResponse;
  createUser: UserResponse;
  deleteOrder: OrderResponse;
  deleteProduct: ProductResponse;
  deleteReview: MessageResponse;
  deleteUser: UserResponse;
  removeFromCart: MessageResponse;
  updateCartItem: CartItemResponse;
  updateOrder: OrderResponse;
  updateProduct: ProductResponse;
  updateReview: ReviewResponse;
  updateUser: UserResponse;
};

export type MutationAddToCartArgs = {
  input: AddToCartInput;
  userId: Scalars['ID']['input'];
};

export type MutationClearCartArgs = {
  userId: Scalars['ID']['input'];
};

export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};

export type MutationCreateProductArgs = {
  input: CreateProductInput;
};

export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
  userId: Scalars['ID']['input'];
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationDeleteOrderArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteProductArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteReviewArgs = {
  id: Scalars['ID']['input'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
};

export type MutationRemoveFromCartArgs = {
  id: Scalars['ID']['input'];
};

export type MutationUpdateCartItemArgs = {
  id: Scalars['ID']['input'];
  input: UpdateCartItemInput;
};

export type MutationUpdateOrderArgs = {
  id: Scalars['ID']['input'];
  input: UpdateOrderInput;
};

export type MutationUpdateProductArgs = {
  id: Scalars['ID']['input'];
  input: UpdateProductInput;
};

export type MutationUpdateReviewArgs = {
  id: Scalars['ID']['input'];
  input: UpdateReviewInput;
};

export type MutationUpdateUserArgs = {
  id: Scalars['ID']['input'];
  input: UpdateUserInput;
};

export type Order = {
  __typename?: 'Order';
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  idempotencyKey: Scalars['ID']['output'];
  items: Array<OrderItem>;
  shippingAddress: Scalars['String']['output'];
  status: OrderStatus;
  total: Scalars['Float']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  user: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  price: Scalars['Float']['output'];
  product: Maybe<Product>;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  total: Scalars['Float']['output'];
};

export type OrderItemInput = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type OrderResponse = {
  __typename?: 'OrderResponse';
  data: Maybe<Order>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type OrderStatus =
  | 'CANCELLED'
  | 'DELIVERED'
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED';

export type OrdersData = {
  __typename?: 'OrdersData';
  items: Array<Order>;
  nextToken: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type OrdersResponse = {
  __typename?: 'OrdersResponse';
  data: Maybe<OrdersData>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Product = {
  __typename?: 'Product';
  category: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  description: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  stock: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type ProductResponse = {
  __typename?: 'ProductResponse';
  data: Maybe<Product>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ProductReview = {
  __typename?: 'ProductReview';
  comment: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  product: Maybe<Product>;
  productId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  user: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type ProductsData = {
  __typename?: 'ProductsData';
  items: Array<Product>;
  nextToken: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type ProductsResponse = {
  __typename?: 'ProductsResponse';
  data: Maybe<ProductsData>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  cartItem: CartItemResponse;
  cartItems: CartItemsResponse;
  getOrder: OrderResponse;
  getOrdersByUser: OrdersResponse;
  getProduct: ProductResponse;
  getUser: UserResponse;
  listOrders: OrdersResponse;
  listProducts: ProductsResponse;
  listUsers: UsersResponse;
  productReviews: ReviewsResponse;
  review: ReviewResponse;
  userReviews: ReviewsResponse;
};

export type QueryCartItemArgs = {
  id: Scalars['ID']['input'];
};

export type QueryCartItemsArgs = {
  userId: Scalars['ID']['input'];
};

export type QueryGetOrderArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetOrdersByUserArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  nextToken: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type QueryGetProductArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryListOrdersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  nextToken: InputMaybe<Scalars['String']['input']>;
};

export type QueryListProductsArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  nextToken: InputMaybe<Scalars['String']['input']>;
};

export type QueryListUsersArgs = {
  limit: InputMaybe<Scalars['Int']['input']>;
  nextToken: InputMaybe<Scalars['String']['input']>;
};

export type QueryProductReviewsArgs = {
  productId: Scalars['ID']['input'];
};

export type QueryReviewArgs = {
  id: Scalars['ID']['input'];
};

export type QueryUserReviewsArgs = {
  userId: Scalars['ID']['input'];
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  data: Maybe<ProductReview>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ReviewsResponse = {
  __typename?: 'ReviewsResponse';
  data: Array<ProductReview>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  cartItemAdded: Maybe<CartItem>;
  cartItemRemoved: Maybe<Scalars['ID']['output']>;
  cartItemUpdated: Maybe<CartItem>;
  orderCreated: Maybe<Order>;
  orderUpdated: Maybe<Order>;
  productCreated: Maybe<Product>;
  productDeleted: Maybe<Scalars['ID']['output']>;
  productUpdated: Maybe<Product>;
};

export type UpdateCartItemInput = {
  quantity: Scalars['Int']['input'];
};

export type UpdateOrderInput = {
  shippingAddress?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<OrderStatus>;
};

export type UpdateProductInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  stock?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateReviewInput = {
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateUserInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<UserRole>;
};

export type User = {
  __typename?: 'User';
  address: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  phone: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  data: Maybe<User>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'MANAGER';

export type UsersData = {
  __typename?: 'UsersData';
  items: Array<User>;
  nextToken: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  data: Maybe<UsersData>;
  error: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AWSDateTime: ResolverTypeWrapper<Scalars['AWSDateTime']['output']>;
  AWSJSON: ResolverTypeWrapper<Scalars['AWSJSON']['output']>;
  AddToCartInput: AddToCartInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CartItem: ResolverTypeWrapper<CartItem>;
  CartItemResponse: ResolverTypeWrapper<
    Omit<CartItemResponse, 'data'> & {
      data?: Maybe<ResolversTypes['CartItem']>;
    }
  >;
  CartItemsResponse: ResolverTypeWrapper<
    Omit<CartItemsResponse, 'data'> & {
      data: Array<ResolversTypes['CartItem']>;
    }
  >;
  CreateOrderInput: CreateOrderInput;
  CreateProductInput: CreateProductInput;
  CreateReviewInput: CreateReviewInput;
  CreateUserInput: CreateUserInput;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MessageResponse: ResolverTypeWrapper<MessageResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  OrderItem: ResolverTypeWrapper<OrderItem>;
  OrderItemInput: OrderItemInput;
  OrderResponse: ResolverTypeWrapper<
    Omit<OrderResponse, 'data'> & { data?: Maybe<ResolversTypes['Order']> }
  >;
  OrderStatus: OrderStatus;
  OrdersData: ResolverTypeWrapper<
    Omit<OrdersData, 'items'> & { items: Array<ResolversTypes['Order']> }
  >;
  OrdersResponse: ResolverTypeWrapper<
    Omit<OrdersResponse, 'data'> & {
      data?: Maybe<ResolversTypes['OrdersData']>;
    }
  >;
  Product: ResolverTypeWrapper<Product>;
  ProductResponse: ResolverTypeWrapper<
    Omit<ProductResponse, 'data'> & { data?: Maybe<ResolversTypes['Product']> }
  >;
  ProductReview: ResolverTypeWrapper<ProductReview>;
  ProductsData: ResolverTypeWrapper<
    Omit<ProductsData, 'items'> & { items: Array<ResolversTypes['Product']> }
  >;
  ProductsResponse: ResolverTypeWrapper<
    Omit<ProductsResponse, 'data'> & {
      data?: Maybe<ResolversTypes['ProductsData']>;
    }
  >;
  Query: ResolverTypeWrapper<{}>;
  ReviewResponse: ResolverTypeWrapper<
    Omit<ReviewResponse, 'data'> & {
      data?: Maybe<ResolversTypes['ProductReview']>;
    }
  >;
  ReviewsResponse: ResolverTypeWrapper<
    Omit<ReviewsResponse, 'data'> & {
      data: Array<ResolversTypes['ProductReview']>;
    }
  >;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Subscription: ResolverTypeWrapper<{}>;
  UpdateCartItemInput: UpdateCartItemInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateProductInput: UpdateProductInput;
  UpdateReviewInput: UpdateReviewInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserResponse: ResolverTypeWrapper<
    Omit<UserResponse, 'data'> & { data?: Maybe<ResolversTypes['User']> }
  >;
  UserRole: UserRole;
  UsersData: ResolverTypeWrapper<
    Omit<UsersData, 'items'> & { items: Array<ResolversTypes['User']> }
  >;
  UsersResponse: ResolverTypeWrapper<
    Omit<UsersResponse, 'data'> & { data?: Maybe<ResolversTypes['UsersData']> }
  >;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AWSDateTime: Scalars['AWSDateTime']['output'];
  AWSJSON: Scalars['AWSJSON']['output'];
  AddToCartInput: AddToCartInput;
  Boolean: Scalars['Boolean']['output'];
  CartItem: CartItem;
  CartItemResponse: Omit<CartItemResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['CartItem']>;
  };
  CartItemsResponse: Omit<CartItemsResponse, 'data'> & {
    data: Array<ResolversParentTypes['CartItem']>;
  };
  CreateOrderInput: CreateOrderInput;
  CreateProductInput: CreateProductInput;
  CreateReviewInput: CreateReviewInput;
  CreateUserInput: CreateUserInput;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  MessageResponse: MessageResponse;
  Mutation: {};
  Order: Order;
  OrderItem: OrderItem;
  OrderItemInput: OrderItemInput;
  OrderResponse: Omit<OrderResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['Order']>;
  };
  OrdersData: Omit<OrdersData, 'items'> & {
    items: Array<ResolversParentTypes['Order']>;
  };
  OrdersResponse: Omit<OrdersResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['OrdersData']>;
  };
  Product: Product;
  ProductResponse: Omit<ProductResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['Product']>;
  };
  ProductReview: ProductReview;
  ProductsData: Omit<ProductsData, 'items'> & {
    items: Array<ResolversParentTypes['Product']>;
  };
  ProductsResponse: Omit<ProductsResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['ProductsData']>;
  };
  Query: {};
  ReviewResponse: Omit<ReviewResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['ProductReview']>;
  };
  ReviewsResponse: Omit<ReviewsResponse, 'data'> & {
    data: Array<ResolversParentTypes['ProductReview']>;
  };
  String: Scalars['String']['output'];
  Subscription: {};
  UpdateCartItemInput: UpdateCartItemInput;
  UpdateOrderInput: UpdateOrderInput;
  UpdateProductInput: UpdateProductInput;
  UpdateReviewInput: UpdateReviewInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserResponse: Omit<UserResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['User']>;
  };
  UsersData: Omit<UsersData, 'items'> & {
    items: Array<ResolversParentTypes['User']>;
  };
  UsersResponse: Omit<UsersResponse, 'data'> & {
    data?: Maybe<ResolversParentTypes['UsersData']>;
  };
};

export interface AwsDateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['AWSDateTime'], any> {
  name: 'AWSDateTime';
}

export interface AwsjsonScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['AWSJSON'], any> {
  name: 'AWSJSON';
}

export type CartItemResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['CartItem'] = ResolversParentTypes['CartItem'],
> = {
  createdAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartItemResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['CartItemResponse'] = ResolversParentTypes['CartItemResponse'],
> = {
  data?: Resolver<Maybe<ResolversTypes['CartItem']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartItemsResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['CartItemsResponse'] = ResolversParentTypes['CartItemsResponse'],
> = {
  data?: Resolver<Array<ResolversTypes['CartItem']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['MessageResponse'] = ResolversParentTypes['MessageResponse'],
> = {
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation'],
> = {
  addToCart?: Resolver<
    ResolversTypes['CartItemResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationAddToCartArgs, 'input' | 'userId'>
  >;
  clearCart?: Resolver<
    ResolversTypes['MessageResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationClearCartArgs, 'userId'>
  >;
  createOrder?: Resolver<
    ResolversTypes['OrderResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateOrderArgs, 'input'>
  >;
  createProduct?: Resolver<
    ResolversTypes['ProductResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateProductArgs, 'input'>
  >;
  createReview?: Resolver<
    ResolversTypes['ReviewResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateReviewArgs, 'input' | 'userId'>
  >;
  createUser?: Resolver<
    ResolversTypes['UserResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, 'input'>
  >;
  deleteOrder?: Resolver<
    ResolversTypes['OrderResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteOrderArgs, 'id'>
  >;
  deleteProduct?: Resolver<
    ResolversTypes['ProductResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteProductArgs, 'id'>
  >;
  deleteReview?: Resolver<
    ResolversTypes['MessageResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteReviewArgs, 'id'>
  >;
  deleteUser?: Resolver<
    ResolversTypes['UserResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteUserArgs, 'id'>
  >;
  removeFromCart?: Resolver<
    ResolversTypes['MessageResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationRemoveFromCartArgs, 'id'>
  >;
  updateCartItem?: Resolver<
    ResolversTypes['CartItemResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateCartItemArgs, 'id' | 'input'>
  >;
  updateOrder?: Resolver<
    ResolversTypes['OrderResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateOrderArgs, 'id' | 'input'>
  >;
  updateProduct?: Resolver<
    ResolversTypes['ProductResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateProductArgs, 'id' | 'input'>
  >;
  updateReview?: Resolver<
    ResolversTypes['ReviewResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateReviewArgs, 'id' | 'input'>
  >;
  updateUser?: Resolver<
    ResolversTypes['UserResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'id' | 'input'>
  >;
};

export type OrderResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Order'] = ResolversParentTypes['Order'],
> = {
  createdAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idempotencyKey?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>;
  shippingAddress?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderItemResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem'],
> = {
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['OrderResponse'] = ResolversParentTypes['OrderResponse'],
> = {
  data?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrdersDataResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['OrdersData'] = ResolversParentTypes['OrdersData'],
> = {
  items?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType>;
  nextToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrdersResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['OrdersResponse'] = ResolversParentTypes['OrdersResponse'],
> = {
  data?: Resolver<Maybe<ResolversTypes['OrdersData']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Product'] = ResolversParentTypes['Product'],
> = {
  category?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  description?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  stock?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ProductResponse'] = ResolversParentTypes['ProductResponse'],
> = {
  data?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductReviewResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ProductReview'] = ResolversParentTypes['ProductReview'],
> = {
  comment?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  rating?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductsDataResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ProductsData'] = ResolversParentTypes['ProductsData'],
> = {
  items?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  nextToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductsResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ProductsResponse'] = ResolversParentTypes['ProductsResponse'],
> = {
  data?: Resolver<
    Maybe<ResolversTypes['ProductsData']>,
    ParentType,
    ContextType
  >;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Query'] = ResolversParentTypes['Query'],
> = {
  cartItem?: Resolver<
    ResolversTypes['CartItemResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryCartItemArgs, 'id'>
  >;
  cartItems?: Resolver<
    ResolversTypes['CartItemsResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryCartItemsArgs, 'userId'>
  >;
  getOrder?: Resolver<
    ResolversTypes['OrderResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryGetOrderArgs, 'id'>
  >;
  getOrdersByUser?: Resolver<
    ResolversTypes['OrdersResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryGetOrdersByUserArgs, 'userId'>
  >;
  getProduct?: Resolver<
    ResolversTypes['ProductResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryGetProductArgs, 'id'>
  >;
  getUser?: Resolver<
    ResolversTypes['UserResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryGetUserArgs, 'id'>
  >;
  listOrders?: Resolver<
    ResolversTypes['OrdersResponse'],
    ParentType,
    ContextType,
    Partial<QueryListOrdersArgs>
  >;
  listProducts?: Resolver<
    ResolversTypes['ProductsResponse'],
    ParentType,
    ContextType,
    Partial<QueryListProductsArgs>
  >;
  listUsers?: Resolver<
    ResolversTypes['UsersResponse'],
    ParentType,
    ContextType,
    Partial<QueryListUsersArgs>
  >;
  productReviews?: Resolver<
    ResolversTypes['ReviewsResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryProductReviewsArgs, 'productId'>
  >;
  review?: Resolver<
    ResolversTypes['ReviewResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryReviewArgs, 'id'>
  >;
  userReviews?: Resolver<
    ResolversTypes['ReviewsResponse'],
    ParentType,
    ContextType,
    RequireFields<QueryUserReviewsArgs, 'userId'>
  >;
};

export type ReviewResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ReviewResponse'] = ResolversParentTypes['ReviewResponse'],
> = {
  data?: Resolver<
    Maybe<ResolversTypes['ProductReview']>,
    ParentType,
    ContextType
  >;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ReviewsResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['ReviewsResponse'] = ResolversParentTypes['ReviewsResponse'],
> = {
  data?: Resolver<
    Array<ResolversTypes['ProductReview']>,
    ParentType,
    ContextType
  >;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription'],
> = {
  cartItemAdded?: SubscriptionResolver<
    Maybe<ResolversTypes['CartItem']>,
    'cartItemAdded',
    ParentType,
    ContextType
  >;
  cartItemRemoved?: SubscriptionResolver<
    Maybe<ResolversTypes['ID']>,
    'cartItemRemoved',
    ParentType,
    ContextType
  >;
  cartItemUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes['CartItem']>,
    'cartItemUpdated',
    ParentType,
    ContextType
  >;
  orderCreated?: SubscriptionResolver<
    Maybe<ResolversTypes['Order']>,
    'orderCreated',
    ParentType,
    ContextType
  >;
  orderUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes['Order']>,
    'orderUpdated',
    ParentType,
    ContextType
  >;
  productCreated?: SubscriptionResolver<
    Maybe<ResolversTypes['Product']>,
    'productCreated',
    ParentType,
    ContextType
  >;
  productDeleted?: SubscriptionResolver<
    Maybe<ResolversTypes['ID']>,
    'productDeleted',
    ParentType,
    ContextType
  >;
  productUpdated?: SubscriptionResolver<
    Maybe<ResolversTypes['Product']>,
    'productUpdated',
    ParentType,
    ContextType
  >;
};

export type UserResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['User'] = ResolversParentTypes['User'],
> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['UserRole'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['AWSDateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['UserResponse'] = ResolversParentTypes['UserResponse'],
> = {
  data?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersDataResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['UsersData'] = ResolversParentTypes['UsersData'],
> = {
  items?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  nextToken?: Resolver<
    Maybe<ResolversTypes['String']>,
    ParentType,
    ContextType
  >;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersResponseResolvers<
  ContextType = GraphQLContext,
  ParentType extends
    ResolversParentTypes['UsersResponse'] = ResolversParentTypes['UsersResponse'],
> = {
  data?: Resolver<Maybe<ResolversTypes['UsersData']>, ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  AWSDateTime?: GraphQLScalarType;
  AWSJSON?: GraphQLScalarType;
  CartItem?: CartItemResolvers<ContextType>;
  CartItemResponse?: CartItemResponseResolvers<ContextType>;
  CartItemsResponse?: CartItemsResponseResolvers<ContextType>;
  MessageResponse?: MessageResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  OrderResponse?: OrderResponseResolvers<ContextType>;
  OrdersData?: OrdersDataResolvers<ContextType>;
  OrdersResponse?: OrdersResponseResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductResponse?: ProductResponseResolvers<ContextType>;
  ProductReview?: ProductReviewResolvers<ContextType>;
  ProductsData?: ProductsDataResolvers<ContextType>;
  ProductsResponse?: ProductsResponseResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  ReviewResponse?: ReviewResponseResolvers<ContextType>;
  ReviewsResponse?: ReviewsResponseResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserResponse?: UserResponseResolvers<ContextType>;
  UsersData?: UsersDataResolvers<ContextType>;
  UsersResponse?: UsersResponseResolvers<ContextType>;
};
