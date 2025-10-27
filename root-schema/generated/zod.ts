/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod';
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
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDateTime: { input: any; output: any };
  AWSJSON: { input: any; output: any };
};

export type AddToCartInput = {
  productId: Scalars['ID']['input'];
  quantity: Scalars['Int']['input'];
};

export type CartItem = {
  __typename?: 'CartItem';
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  userId: Scalars['ID']['output'];
};

export type CartItemResponse = {
  __typename?: 'CartItemResponse';
  data?: Maybe<CartItem>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type CartItemsResponse = {
  __typename?: 'CartItemsResponse';
  data: Array<CartItem>;
  error?: Maybe<Scalars['String']['output']>;
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
  error?: Maybe<Scalars['String']['output']>;
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
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type OrderItem = {
  __typename?: 'OrderItem';
  price: Scalars['Float']['output'];
  product?: Maybe<Product>;
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
  data?: Maybe<Order>;
  error?: Maybe<Scalars['String']['output']>;
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
  nextToken?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type OrdersResponse = {
  __typename?: 'OrdersResponse';
  data?: Maybe<OrdersData>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Product = {
  __typename?: 'Product';
  category?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  imageUrl?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['Float']['output'];
  stock: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type ProductResponse = {
  __typename?: 'ProductResponse';
  data?: Maybe<Product>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ProductReview = {
  __typename?: 'ProductReview';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
  updatedAt: Scalars['AWSDateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['ID']['output'];
};

export type ProductsData = {
  __typename?: 'ProductsData';
  items: Array<Product>;
  nextToken?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type ProductsResponse = {
  __typename?: 'ProductsResponse';
  data?: Maybe<ProductsData>;
  error?: Maybe<Scalars['String']['output']>;
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
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['ID']['input'];
};

export type QueryGetProductArgs = {
  id: Scalars['ID']['input'];
};

export type QueryGetUserArgs = {
  id: Scalars['ID']['input'];
};

export type QueryListOrdersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type QueryListProductsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};

export type QueryListUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
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
  data?: Maybe<ProductReview>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ReviewsResponse = {
  __typename?: 'ReviewsResponse';
  data: Array<ProductReview>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  cartItemAdded?: Maybe<CartItem>;
  cartItemRemoved?: Maybe<Scalars['ID']['output']>;
  cartItemUpdated?: Maybe<CartItem>;
  orderCreated?: Maybe<Order>;
  orderUpdated?: Maybe<Order>;
  productCreated?: Maybe<Product>;
  productDeleted?: Maybe<Scalars['ID']['output']>;
  productUpdated?: Maybe<Product>;
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
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['AWSDateTime']['output'];
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isActive: Scalars['Boolean']['output'];
  lastName: Scalars['String']['output'];
  phone?: Maybe<Scalars['String']['output']>;
  role: UserRole;
  updatedAt: Scalars['AWSDateTime']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  data?: Maybe<User>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'MANAGER';

export type UsersData = {
  __typename?: 'UsersData';
  items: Array<User>;
  nextToken?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  data?: Maybe<UsersData>;
  error?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const OrderStatusSchema = z.enum([
  'CANCELLED',
  'DELIVERED',
  'PENDING',
  'PROCESSING',
  'SHIPPED',
]);

export const UserRoleSchema = z.enum(['ADMIN', 'CUSTOMER', 'MANAGER']);

export const UpdateReviewInputSchema = z.object({
  comment: z.string().nullish(),
  rating: z.number().nullish(),
});

export const UpdateProductInputSchema = z.object({
  category: z.string().nullish(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  name: z.string().nullish(),
  price: z.number().nullish(),
  stock: z.number().nullish(),
});

export const UpdateCartItemInputSchema = z.object({
  quantity: z.number(),
});

export const UpdateOrderInputSchema = z.object({
  shippingAddress: z.string().nullish(),
  status: OrderStatusSchema.nullish(),
});

export const OrderItemInputSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});

export const UpdateUserInputSchema = z.object({
  address: z.string().nullish(),
  email: z.string().nullish(),
  firstName: z.string().nullish(),
  isActive: z.boolean().nullish(),
  lastName: z.string().nullish(),
  phone: z.string().nullish(),
  role: UserRoleSchema.nullish(),
});

export const CreateUserInputSchema = z.object({
  address: z.string().nullish(),
  email: z.string(),
  firstName: z.string(),
  isActive: z.boolean().nullish(),
  lastName: z.string(),
  phone: z.string().nullish(),
  role: UserRoleSchema.nullish(),
});

export const CreateReviewInputSchema = z.object({
  comment: z.string().nullish(),
  productId: z.string(),
  rating: z.number(),
});

export const CreateProductInputSchema = z.object({
  category: z.string().nullish(),
  description: z.string().nullish(),
  imageUrl: z.string().nullish(),
  name: z.string(),
  price: z.number(),
  stock: z.number().nullish(),
});

export const CreateOrderInputSchema = z.object({
  idempotencyKey: z.string(),
  items: z.array(z.lazy(() => OrderItemInputSchema)),
  shippingAddress: z.string(),
  userId: z.string(),
});

export const AddToCartInputSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
});
