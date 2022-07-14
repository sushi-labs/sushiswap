// @ts-nocheck
import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import { gql } from '@graphql-mesh/utils'

export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  DateTime: any
  /** The `Long` scalar type represents 52-bit integers */
  Long: any
  /** The `Upload` scalar type represents a file upload. */
  Upload: any
  AboutBlocksDynamicZoneInput: any
  ArticleBlocksDynamicZoneInput: any
}

export type Error = {
  code: Scalars['String']
  message?: Maybe<Scalars['String']>
}

export type Pagination = {
  total: Scalars['Int']
  page: Scalars['Int']
  pageSize: Scalars['Int']
  pageCount: Scalars['Int']
}

export type ResponseCollectionMeta = {
  pagination: Pagination
}

export type PublicationState = 'LIVE' | 'PREVIEW'

export type IDFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  not?: InputMaybe<IDFilterInput>
  eq?: InputMaybe<Scalars['ID']>
  ne?: InputMaybe<Scalars['ID']>
  startsWith?: InputMaybe<Scalars['ID']>
  endsWith?: InputMaybe<Scalars['ID']>
  contains?: InputMaybe<Scalars['ID']>
  notContains?: InputMaybe<Scalars['ID']>
  containsi?: InputMaybe<Scalars['ID']>
  notContainsi?: InputMaybe<Scalars['ID']>
  gt?: InputMaybe<Scalars['ID']>
  gte?: InputMaybe<Scalars['ID']>
  lt?: InputMaybe<Scalars['ID']>
  lte?: InputMaybe<Scalars['ID']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type BooleanFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
  not?: InputMaybe<BooleanFilterInput>
  eq?: InputMaybe<Scalars['Boolean']>
  ne?: InputMaybe<Scalars['Boolean']>
  startsWith?: InputMaybe<Scalars['Boolean']>
  endsWith?: InputMaybe<Scalars['Boolean']>
  contains?: InputMaybe<Scalars['Boolean']>
  notContains?: InputMaybe<Scalars['Boolean']>
  containsi?: InputMaybe<Scalars['Boolean']>
  notContainsi?: InputMaybe<Scalars['Boolean']>
  gt?: InputMaybe<Scalars['Boolean']>
  gte?: InputMaybe<Scalars['Boolean']>
  lt?: InputMaybe<Scalars['Boolean']>
  lte?: InputMaybe<Scalars['Boolean']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
}

export type StringFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  not?: InputMaybe<StringFilterInput>
  eq?: InputMaybe<Scalars['String']>
  ne?: InputMaybe<Scalars['String']>
  startsWith?: InputMaybe<Scalars['String']>
  endsWith?: InputMaybe<Scalars['String']>
  contains?: InputMaybe<Scalars['String']>
  notContains?: InputMaybe<Scalars['String']>
  containsi?: InputMaybe<Scalars['String']>
  notContainsi?: InputMaybe<Scalars['String']>
  gt?: InputMaybe<Scalars['String']>
  gte?: InputMaybe<Scalars['String']>
  lt?: InputMaybe<Scalars['String']>
  lte?: InputMaybe<Scalars['String']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type IntFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  not?: InputMaybe<IntFilterInput>
  eq?: InputMaybe<Scalars['Int']>
  ne?: InputMaybe<Scalars['Int']>
  startsWith?: InputMaybe<Scalars['Int']>
  endsWith?: InputMaybe<Scalars['Int']>
  contains?: InputMaybe<Scalars['Int']>
  notContains?: InputMaybe<Scalars['Int']>
  containsi?: InputMaybe<Scalars['Int']>
  notContainsi?: InputMaybe<Scalars['Int']>
  gt?: InputMaybe<Scalars['Int']>
  gte?: InputMaybe<Scalars['Int']>
  lt?: InputMaybe<Scalars['Int']>
  lte?: InputMaybe<Scalars['Int']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
}

export type LongFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
  not?: InputMaybe<LongFilterInput>
  eq?: InputMaybe<Scalars['Long']>
  ne?: InputMaybe<Scalars['Long']>
  startsWith?: InputMaybe<Scalars['Long']>
  endsWith?: InputMaybe<Scalars['Long']>
  contains?: InputMaybe<Scalars['Long']>
  notContains?: InputMaybe<Scalars['Long']>
  containsi?: InputMaybe<Scalars['Long']>
  notContainsi?: InputMaybe<Scalars['Long']>
  gt?: InputMaybe<Scalars['Long']>
  gte?: InputMaybe<Scalars['Long']>
  lt?: InputMaybe<Scalars['Long']>
  lte?: InputMaybe<Scalars['Long']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
}

export type FloatFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
  not?: InputMaybe<FloatFilterInput>
  eq?: InputMaybe<Scalars['Float']>
  ne?: InputMaybe<Scalars['Float']>
  startsWith?: InputMaybe<Scalars['Float']>
  endsWith?: InputMaybe<Scalars['Float']>
  contains?: InputMaybe<Scalars['Float']>
  notContains?: InputMaybe<Scalars['Float']>
  containsi?: InputMaybe<Scalars['Float']>
  notContainsi?: InputMaybe<Scalars['Float']>
  gt?: InputMaybe<Scalars['Float']>
  gte?: InputMaybe<Scalars['Float']>
  lt?: InputMaybe<Scalars['Float']>
  lte?: InputMaybe<Scalars['Float']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
}

export type DateTimeFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  not?: InputMaybe<DateTimeFilterInput>
  eq?: InputMaybe<Scalars['DateTime']>
  ne?: InputMaybe<Scalars['DateTime']>
  startsWith?: InputMaybe<Scalars['DateTime']>
  endsWith?: InputMaybe<Scalars['DateTime']>
  contains?: InputMaybe<Scalars['DateTime']>
  notContains?: InputMaybe<Scalars['DateTime']>
  containsi?: InputMaybe<Scalars['DateTime']>
  notContainsi?: InputMaybe<Scalars['DateTime']>
  gt?: InputMaybe<Scalars['DateTime']>
  gte?: InputMaybe<Scalars['DateTime']>
  lt?: InputMaybe<Scalars['DateTime']>
  lte?: InputMaybe<Scalars['DateTime']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
}

export type JSONFilterInput = {
  and?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
  or?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
  not?: InputMaybe<JSONFilterInput>
  eq?: InputMaybe<Scalars['JSON']>
  ne?: InputMaybe<Scalars['JSON']>
  startsWith?: InputMaybe<Scalars['JSON']>
  endsWith?: InputMaybe<Scalars['JSON']>
  contains?: InputMaybe<Scalars['JSON']>
  notContains?: InputMaybe<Scalars['JSON']>
  containsi?: InputMaybe<Scalars['JSON']>
  notContainsi?: InputMaybe<Scalars['JSON']>
  gt?: InputMaybe<Scalars['JSON']>
  gte?: InputMaybe<Scalars['JSON']>
  lt?: InputMaybe<Scalars['JSON']>
  lte?: InputMaybe<Scalars['JSON']>
  null?: InputMaybe<Scalars['Boolean']>
  notNull?: InputMaybe<Scalars['Boolean']>
  in?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
  notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
  between?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
}

export type ComponentSharedDivider = {
  id: Scalars['ID']
}

export type ComponentSharedMedia = {
  id: Scalars['ID']
  file?: Maybe<UploadFileEntityResponse>
  caption?: Maybe<Scalars['String']>
}

export type ComponentSharedRichText = {
  id: Scalars['ID']
  body?: Maybe<Scalars['String']>
}

export type ComponentSharedSeoInput = {
  id?: InputMaybe<Scalars['ID']>
  metaTitle?: InputMaybe<Scalars['String']>
  metaDescription?: InputMaybe<Scalars['String']>
  shareImage?: InputMaybe<Scalars['ID']>
}

export type ComponentSharedSeo = {
  id: Scalars['ID']
  metaTitle: Scalars['String']
  metaDescription: Scalars['String']
  shareImage?: Maybe<UploadFileEntityResponse>
}

export type ComponentSharedSlider = {
  id: Scalars['ID']
  files?: Maybe<UploadFileRelationResponseCollection>
}

export type ComponentSharedSliderfilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type UploadFileFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  name?: InputMaybe<StringFilterInput>
  alternativeText?: InputMaybe<StringFilterInput>
  caption?: InputMaybe<StringFilterInput>
  width?: InputMaybe<IntFilterInput>
  height?: InputMaybe<IntFilterInput>
  formats?: InputMaybe<JSONFilterInput>
  hash?: InputMaybe<StringFilterInput>
  ext?: InputMaybe<StringFilterInput>
  mime?: InputMaybe<StringFilterInput>
  size?: InputMaybe<FloatFilterInput>
  url?: InputMaybe<StringFilterInput>
  previewUrl?: InputMaybe<StringFilterInput>
  provider?: InputMaybe<StringFilterInput>
  provider_metadata?: InputMaybe<JSONFilterInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>
  not?: InputMaybe<UploadFileFiltersInput>
}

export type UploadFileInput = {
  name?: InputMaybe<Scalars['String']>
  alternativeText?: InputMaybe<Scalars['String']>
  caption?: InputMaybe<Scalars['String']>
  width?: InputMaybe<Scalars['Int']>
  height?: InputMaybe<Scalars['Int']>
  formats?: InputMaybe<Scalars['JSON']>
  hash?: InputMaybe<Scalars['String']>
  ext?: InputMaybe<Scalars['String']>
  mime?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Float']>
  url?: InputMaybe<Scalars['String']>
  previewUrl?: InputMaybe<Scalars['String']>
  provider?: InputMaybe<Scalars['String']>
  provider_metadata?: InputMaybe<Scalars['JSON']>
}

export type UploadFile = {
  name: Scalars['String']
  alternativeText?: Maybe<Scalars['String']>
  caption?: Maybe<Scalars['String']>
  width?: Maybe<Scalars['Int']>
  height?: Maybe<Scalars['Int']>
  formats?: Maybe<Scalars['JSON']>
  hash: Scalars['String']
  ext?: Maybe<Scalars['String']>
  mime: Scalars['String']
  size: Scalars['Float']
  url: Scalars['String']
  previewUrl?: Maybe<Scalars['String']>
  provider: Scalars['String']
  provider_metadata?: Maybe<Scalars['JSON']>
  related?: Maybe<Array<Maybe<GenericMorph>>>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type UploadFileEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<UploadFile>
}

export type UploadFileEntityResponse = {
  data?: Maybe<UploadFileEntity>
}

export type UploadFileEntityResponseCollection = {
  data: Array<UploadFileEntity>
  meta: ResponseCollectionMeta
}

export type UploadFileRelationResponseCollection = {
  data: Array<UploadFileEntity>
}

export type SchedulerSchedulerFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  scheduledDatetime?: InputMaybe<DateTimeFilterInput>
  uid?: InputMaybe<StringFilterInput>
  contentId?: InputMaybe<LongFilterInput>
  scheduleType?: InputMaybe<StringFilterInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<SchedulerSchedulerFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<SchedulerSchedulerFiltersInput>>>
  not?: InputMaybe<SchedulerSchedulerFiltersInput>
}

export type SchedulerSchedulerInput = {
  scheduledDatetime?: InputMaybe<Scalars['DateTime']>
  uid?: InputMaybe<Scalars['String']>
  contentId?: InputMaybe<Scalars['Long']>
  scheduleType?: InputMaybe<Scalars['String']>
}

export type SchedulerScheduler = {
  scheduledDatetime?: Maybe<Scalars['DateTime']>
  uid?: Maybe<Scalars['String']>
  contentId?: Maybe<Scalars['Long']>
  scheduleType?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type SchedulerSchedulerEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<SchedulerScheduler>
}

export type SchedulerSchedulerEntityResponse = {
  data?: Maybe<SchedulerSchedulerEntity>
}

export type SchedulerSchedulerEntityResponseCollection = {
  data: Array<SchedulerSchedulerEntity>
  meta: ResponseCollectionMeta
}

export type I18NLocaleFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  name?: InputMaybe<StringFilterInput>
  code?: InputMaybe<StringFilterInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>
  not?: InputMaybe<I18NLocaleFiltersInput>
}

export type I18NLocale = {
  name?: Maybe<Scalars['String']>
  code?: Maybe<Scalars['String']>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type I18NLocaleEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<I18NLocale>
}

export type I18NLocaleEntityResponse = {
  data?: Maybe<I18NLocaleEntity>
}

export type I18NLocaleEntityResponseCollection = {
  data: Array<I18NLocaleEntity>
  meta: ResponseCollectionMeta
}

export type UsersPermissionsPermissionFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  action?: InputMaybe<StringFilterInput>
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>
  not?: InputMaybe<UsersPermissionsPermissionFiltersInput>
}

export type UsersPermissionsPermission = {
  action: Scalars['String']
  role?: Maybe<UsersPermissionsRoleEntityResponse>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type UsersPermissionsPermissionEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<UsersPermissionsPermission>
}

export type UsersPermissionsPermissionRelationResponseCollection = {
  data: Array<UsersPermissionsPermissionEntity>
}

export type UsersPermissionsRoleFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  name?: InputMaybe<StringFilterInput>
  description?: InputMaybe<StringFilterInput>
  type?: InputMaybe<StringFilterInput>
  permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>
  users?: InputMaybe<UsersPermissionsUserFiltersInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>
  not?: InputMaybe<UsersPermissionsRoleFiltersInput>
}

export type UsersPermissionsRoleInput = {
  name?: InputMaybe<Scalars['String']>
  description?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type UsersPermissionsRole = {
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>
  users?: Maybe<UsersPermissionsUserRelationResponseCollection>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type UsersPermissionsRolepermissionsArgs = {
  filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type UsersPermissionsRoleusersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type UsersPermissionsRoleEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<UsersPermissionsRole>
}

export type UsersPermissionsRoleEntityResponse = {
  data?: Maybe<UsersPermissionsRoleEntity>
}

export type UsersPermissionsRoleEntityResponseCollection = {
  data: Array<UsersPermissionsRoleEntity>
  meta: ResponseCollectionMeta
}

export type UsersPermissionsUserFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  username?: InputMaybe<StringFilterInput>
  email?: InputMaybe<StringFilterInput>
  provider?: InputMaybe<StringFilterInput>
  password?: InputMaybe<StringFilterInput>
  resetPasswordToken?: InputMaybe<StringFilterInput>
  confirmationToken?: InputMaybe<StringFilterInput>
  confirmed?: InputMaybe<BooleanFilterInput>
  blocked?: InputMaybe<BooleanFilterInput>
  role?: InputMaybe<UsersPermissionsRoleFiltersInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>
  not?: InputMaybe<UsersPermissionsUserFiltersInput>
}

export type UsersPermissionsUserInput = {
  username?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  provider?: InputMaybe<Scalars['String']>
  password?: InputMaybe<Scalars['String']>
  resetPasswordToken?: InputMaybe<Scalars['String']>
  confirmationToken?: InputMaybe<Scalars['String']>
  confirmed?: InputMaybe<Scalars['Boolean']>
  blocked?: InputMaybe<Scalars['Boolean']>
  role?: InputMaybe<Scalars['ID']>
}

export type UsersPermissionsUser = {
  username: Scalars['String']
  email: Scalars['String']
  provider?: Maybe<Scalars['String']>
  confirmed?: Maybe<Scalars['Boolean']>
  blocked?: Maybe<Scalars['Boolean']>
  role?: Maybe<UsersPermissionsRoleEntityResponse>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type UsersPermissionsUserEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<UsersPermissionsUser>
}

export type UsersPermissionsUserEntityResponse = {
  data?: Maybe<UsersPermissionsUserEntity>
}

export type UsersPermissionsUserEntityResponseCollection = {
  data: Array<UsersPermissionsUserEntity>
  meta: ResponseCollectionMeta
}

export type UsersPermissionsUserRelationResponseCollection = {
  data: Array<UsersPermissionsUserEntity>
}

export type AboutBlocksDynamicZone = ComponentSharedMedia | ComponentSharedRichText | ComponentSharedSlider | Error

export type AboutInput = {
  title?: InputMaybe<Scalars['String']>
  blocks?: InputMaybe<Array<Scalars['AboutBlocksDynamicZoneInput']>>
}

export type About = {
  title?: Maybe<Scalars['String']>
  blocks?: Maybe<Array<Maybe<AboutBlocksDynamicZone>>>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type AboutEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<About>
}

export type AboutEntityResponse = {
  data?: Maybe<AboutEntity>
}

export type ArticleBlocksDynamicZone =
  | ComponentSharedDivider
  | ComponentSharedMedia
  | ComponentSharedRichText
  | ComponentSharedSlider
  | Error

export type ArticleFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  title?: InputMaybe<StringFilterInput>
  description?: InputMaybe<StringFilterInput>
  slug?: InputMaybe<StringFilterInput>
  authors?: InputMaybe<AuthorFiltersInput>
  categories?: InputMaybe<CategoryFiltersInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  publishedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<ArticleFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<ArticleFiltersInput>>>
  not?: InputMaybe<ArticleFiltersInput>
}

export type ArticleInput = {
  title?: InputMaybe<Scalars['String']>
  description?: InputMaybe<Scalars['String']>
  slug?: InputMaybe<Scalars['String']>
  cover?: InputMaybe<Scalars['ID']>
  authors?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  blocks?: InputMaybe<Array<Scalars['ArticleBlocksDynamicZoneInput']>>
  publishedAt?: InputMaybe<Scalars['DateTime']>
}

export type Article = {
  title: Scalars['String']
  description: Scalars['String']
  slug: Scalars['String']
  cover: UploadFileEntityResponse
  authors?: Maybe<AuthorRelationResponseCollection>
  categories?: Maybe<CategoryRelationResponseCollection>
  blocks?: Maybe<Array<Maybe<ArticleBlocksDynamicZone>>>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
  publishedAt?: Maybe<Scalars['DateTime']>
}

export type ArticleauthorsArgs = {
  filters?: InputMaybe<AuthorFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ArticlecategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type ArticleEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<Article>
}

export type ArticleEntityResponse = {
  data?: Maybe<ArticleEntity>
}

export type ArticleEntityResponseCollection = {
  data: Array<ArticleEntity>
  meta: ResponseCollectionMeta
}

export type ArticleRelationResponseCollection = {
  data: Array<ArticleEntity>
}

export type AuthorFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  name?: InputMaybe<StringFilterInput>
  email?: InputMaybe<StringFilterInput>
  handle?: InputMaybe<StringFilterInput>
  articles?: InputMaybe<ArticleFiltersInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<AuthorFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<AuthorFiltersInput>>>
  not?: InputMaybe<AuthorFiltersInput>
}

export type AuthorInput = {
  name?: InputMaybe<Scalars['String']>
  avatar?: InputMaybe<Scalars['ID']>
  email?: InputMaybe<Scalars['String']>
  handle?: InputMaybe<Scalars['String']>
  articles?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type Author = {
  name: Scalars['String']
  avatar: UploadFileEntityResponse
  email: Scalars['String']
  handle: Scalars['String']
  articles?: Maybe<ArticleRelationResponseCollection>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type AuthorarticlesArgs = {
  filters?: InputMaybe<ArticleFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  publicationState?: InputMaybe<PublicationState>
}

export type AuthorEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<Author>
}

export type AuthorEntityResponse = {
  data?: Maybe<AuthorEntity>
}

export type AuthorEntityResponseCollection = {
  data: Array<AuthorEntity>
  meta: ResponseCollectionMeta
}

export type AuthorRelationResponseCollection = {
  data: Array<AuthorEntity>
}

export type CategoryFiltersInput = {
  id?: InputMaybe<IDFilterInput>
  name?: InputMaybe<StringFilterInput>
  slug?: InputMaybe<StringFilterInput>
  description?: InputMaybe<StringFilterInput>
  articles?: InputMaybe<ArticleFiltersInput>
  createdAt?: InputMaybe<DateTimeFilterInput>
  updatedAt?: InputMaybe<DateTimeFilterInput>
  and?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>
  or?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>
  not?: InputMaybe<CategoryFiltersInput>
}

export type CategoryInput = {
  name?: InputMaybe<Scalars['String']>
  slug?: InputMaybe<Scalars['String']>
  description?: InputMaybe<Scalars['String']>
  articles?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
}

export type Category = {
  name: Scalars['String']
  slug: Scalars['String']
  description: Scalars['String']
  articles?: Maybe<ArticleRelationResponseCollection>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type CategoryarticlesArgs = {
  filters?: InputMaybe<ArticleFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  publicationState?: InputMaybe<PublicationState>
}

export type CategoryEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<Category>
}

export type CategoryEntityResponse = {
  data?: Maybe<CategoryEntity>
}

export type CategoryEntityResponseCollection = {
  data: Array<CategoryEntity>
  meta: ResponseCollectionMeta
}

export type CategoryRelationResponseCollection = {
  data: Array<CategoryEntity>
}

export type GlobalInput = {
  siteName?: InputMaybe<Scalars['String']>
  favicon?: InputMaybe<Scalars['ID']>
  siteDescription?: InputMaybe<Scalars['String']>
  defaultSeo?: InputMaybe<ComponentSharedSeoInput>
}

export type Global = {
  siteName: Scalars['String']
  favicon?: Maybe<UploadFileEntityResponse>
  siteDescription: Scalars['String']
  defaultSeo?: Maybe<ComponentSharedSeo>
  createdAt?: Maybe<Scalars['DateTime']>
  updatedAt?: Maybe<Scalars['DateTime']>
}

export type GlobalEntity = {
  id?: Maybe<Scalars['ID']>
  attributes?: Maybe<Global>
}

export type GlobalEntityResponse = {
  data?: Maybe<GlobalEntity>
}

export type GenericMorph =
  | ComponentSharedDivider
  | ComponentSharedMedia
  | ComponentSharedRichText
  | ComponentSharedSeo
  | ComponentSharedSlider
  | UploadFile
  | SchedulerScheduler
  | I18NLocale
  | UsersPermissionsPermission
  | UsersPermissionsRole
  | UsersPermissionsUser
  | About
  | Article
  | Author
  | Category
  | Global

export type FileInfoInput = {
  name?: InputMaybe<Scalars['String']>
  alternativeText?: InputMaybe<Scalars['String']>
  caption?: InputMaybe<Scalars['String']>
}

export type UsersPermissionsMe = {
  id: Scalars['ID']
  username: Scalars['String']
  email?: Maybe<Scalars['String']>
  confirmed?: Maybe<Scalars['Boolean']>
  blocked?: Maybe<Scalars['Boolean']>
  role?: Maybe<UsersPermissionsMeRole>
}

export type UsersPermissionsMeRole = {
  id: Scalars['ID']
  name: Scalars['String']
  description?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type UsersPermissionsRegisterInput = {
  username: Scalars['String']
  email: Scalars['String']
  password: Scalars['String']
}

export type UsersPermissionsLoginInput = {
  identifier: Scalars['String']
  password: Scalars['String']
  provider?: Scalars['String']
}

export type UsersPermissionsPasswordPayload = {
  ok: Scalars['Boolean']
}

export type UsersPermissionsLoginPayload = {
  jwt?: Maybe<Scalars['String']>
  user: UsersPermissionsMe
}

export type UsersPermissionsCreateRolePayload = {
  ok: Scalars['Boolean']
}

export type UsersPermissionsUpdateRolePayload = {
  ok: Scalars['Boolean']
}

export type UsersPermissionsDeleteRolePayload = {
  ok: Scalars['Boolean']
}

export type PaginationArg = {
  page?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
  start?: InputMaybe<Scalars['Int']>
  limit?: InputMaybe<Scalars['Int']>
}

export type Query = {
  uploadFile?: Maybe<UploadFileEntityResponse>
  uploadFiles?: Maybe<UploadFileEntityResponseCollection>
  schedulerScheduler?: Maybe<SchedulerSchedulerEntityResponseCollection>
  i18NLocale?: Maybe<I18NLocaleEntityResponse>
  i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>
  usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>
  usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>
  usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>
  usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>
  about?: Maybe<AboutEntityResponse>
  article?: Maybe<ArticleEntityResponse>
  articles?: Maybe<ArticleEntityResponseCollection>
  author?: Maybe<AuthorEntityResponse>
  authors?: Maybe<AuthorEntityResponseCollection>
  category?: Maybe<CategoryEntityResponse>
  categories?: Maybe<CategoryEntityResponseCollection>
  global?: Maybe<GlobalEntityResponse>
  me?: Maybe<UsersPermissionsMe>
}

export type QueryuploadFileArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryuploadFilesArgs = {
  filters?: InputMaybe<UploadFileFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type QueryschedulerSchedulerArgs = {
  filters?: InputMaybe<SchedulerSchedulerFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type Queryi18NLocaleArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type Queryi18NLocalesArgs = {
  filters?: InputMaybe<I18NLocaleFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type QueryusersPermissionsRoleArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryusersPermissionsRolesArgs = {
  filters?: InputMaybe<UsersPermissionsRoleFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type QueryusersPermissionsUserArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryusersPermissionsUsersArgs = {
  filters?: InputMaybe<UsersPermissionsUserFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type QueryarticleArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryarticlesArgs = {
  filters?: InputMaybe<ArticleFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  publicationState?: InputMaybe<PublicationState>
}

export type QueryauthorArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QueryauthorsArgs = {
  filters?: InputMaybe<AuthorFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type QuerycategoryArgs = {
  id?: InputMaybe<Scalars['ID']>
}

export type QuerycategoriesArgs = {
  filters?: InputMaybe<CategoryFiltersInput>
  pagination?: InputMaybe<PaginationArg>
  sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
}

export type Mutation = {
  createUploadFile?: Maybe<UploadFileEntityResponse>
  updateUploadFile?: Maybe<UploadFileEntityResponse>
  deleteUploadFile?: Maybe<UploadFileEntityResponse>
  createSchedulerScheduler?: Maybe<SchedulerSchedulerEntityResponse>
  updateSchedulerScheduler?: Maybe<SchedulerSchedulerEntityResponse>
  deleteSchedulerScheduler?: Maybe<SchedulerSchedulerEntityResponse>
  updateAbout?: Maybe<AboutEntityResponse>
  deleteAbout?: Maybe<AboutEntityResponse>
  createArticle?: Maybe<ArticleEntityResponse>
  updateArticle?: Maybe<ArticleEntityResponse>
  deleteArticle?: Maybe<ArticleEntityResponse>
  createAuthor?: Maybe<AuthorEntityResponse>
  updateAuthor?: Maybe<AuthorEntityResponse>
  deleteAuthor?: Maybe<AuthorEntityResponse>
  createCategory?: Maybe<CategoryEntityResponse>
  updateCategory?: Maybe<CategoryEntityResponse>
  deleteCategory?: Maybe<CategoryEntityResponse>
  updateGlobal?: Maybe<GlobalEntityResponse>
  deleteGlobal?: Maybe<GlobalEntityResponse>
  upload: UploadFileEntityResponse
  multipleUpload: Array<Maybe<UploadFileEntityResponse>>
  updateFileInfo: UploadFileEntityResponse
  removeFile?: Maybe<UploadFileEntityResponse>
  /** Create a new role */
  createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>
  /** Update an existing role */
  updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>
  /** Delete an existing role */
  deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>
  /** Create a new user */
  createUsersPermissionsUser: UsersPermissionsUserEntityResponse
  /** Update an existing user */
  updateUsersPermissionsUser: UsersPermissionsUserEntityResponse
  /** Delete an existing user */
  deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse
  login: UsersPermissionsLoginPayload
  /** Register a user */
  register: UsersPermissionsLoginPayload
  /** Request a reset password token */
  forgotPassword?: Maybe<UsersPermissionsPasswordPayload>
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
  resetPassword?: Maybe<UsersPermissionsLoginPayload>
  /** Confirm an email users email address */
  emailConfirmation?: Maybe<UsersPermissionsLoginPayload>
}

export type MutationcreateUploadFileArgs = {
  data: UploadFileInput
}

export type MutationupdateUploadFileArgs = {
  id: Scalars['ID']
  data: UploadFileInput
}

export type MutationdeleteUploadFileArgs = {
  id: Scalars['ID']
}

export type MutationcreateSchedulerSchedulerArgs = {
  data: SchedulerSchedulerInput
}

export type MutationupdateSchedulerSchedulerArgs = {
  id: Scalars['ID']
  data: SchedulerSchedulerInput
}

export type MutationdeleteSchedulerSchedulerArgs = {
  id: Scalars['ID']
}

export type MutationupdateAboutArgs = {
  data: AboutInput
}

export type MutationcreateArticleArgs = {
  data: ArticleInput
}

export type MutationupdateArticleArgs = {
  id: Scalars['ID']
  data: ArticleInput
}

export type MutationdeleteArticleArgs = {
  id: Scalars['ID']
}

export type MutationcreateAuthorArgs = {
  data: AuthorInput
}

export type MutationupdateAuthorArgs = {
  id: Scalars['ID']
  data: AuthorInput
}

export type MutationdeleteAuthorArgs = {
  id: Scalars['ID']
}

export type MutationcreateCategoryArgs = {
  data: CategoryInput
}

export type MutationupdateCategoryArgs = {
  id: Scalars['ID']
  data: CategoryInput
}

export type MutationdeleteCategoryArgs = {
  id: Scalars['ID']
}

export type MutationupdateGlobalArgs = {
  data: GlobalInput
}

export type MutationuploadArgs = {
  refId?: InputMaybe<Scalars['ID']>
  ref?: InputMaybe<Scalars['String']>
  field?: InputMaybe<Scalars['String']>
  info?: InputMaybe<FileInfoInput>
  file: Scalars['Upload']
}

export type MutationmultipleUploadArgs = {
  refId?: InputMaybe<Scalars['ID']>
  ref?: InputMaybe<Scalars['String']>
  field?: InputMaybe<Scalars['String']>
  files: Array<InputMaybe<Scalars['Upload']>>
}

export type MutationupdateFileInfoArgs = {
  id: Scalars['ID']
  info?: InputMaybe<FileInfoInput>
}

export type MutationremoveFileArgs = {
  id: Scalars['ID']
}

export type MutationcreateUsersPermissionsRoleArgs = {
  data: UsersPermissionsRoleInput
}

export type MutationupdateUsersPermissionsRoleArgs = {
  id: Scalars['ID']
  data: UsersPermissionsRoleInput
}

export type MutationdeleteUsersPermissionsRoleArgs = {
  id: Scalars['ID']
}

export type MutationcreateUsersPermissionsUserArgs = {
  data: UsersPermissionsUserInput
}

export type MutationupdateUsersPermissionsUserArgs = {
  id: Scalars['ID']
  data: UsersPermissionsUserInput
}

export type MutationdeleteUsersPermissionsUserArgs = {
  id: Scalars['ID']
}

export type MutationloginArgs = {
  input: UsersPermissionsLoginInput
}

export type MutationregisterArgs = {
  input: UsersPermissionsRegisterInput
}

export type MutationforgotPasswordArgs = {
  email: Scalars['String']
}

export type MutationresetPasswordArgs = {
  password: Scalars['String']
  passwordConfirmation: Scalars['String']
  code: Scalars['String']
}

export type MutationemailConfirmationArgs = {
  confirmation: Scalars['String']
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  JSON: ResolverTypeWrapper<Scalars['JSON']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  Long: ResolverTypeWrapper<Scalars['Long']>
  Upload: ResolverTypeWrapper<Scalars['Upload']>
  Error: ResolverTypeWrapper<Error>
  String: ResolverTypeWrapper<Scalars['String']>
  Pagination: ResolverTypeWrapper<Pagination>
  Int: ResolverTypeWrapper<Scalars['Int']>
  ResponseCollectionMeta: ResolverTypeWrapper<ResponseCollectionMeta>
  PublicationState: PublicationState
  IDFilterInput: IDFilterInput
  ID: ResolverTypeWrapper<Scalars['ID']>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  BooleanFilterInput: BooleanFilterInput
  StringFilterInput: StringFilterInput
  IntFilterInput: IntFilterInput
  LongFilterInput: LongFilterInput
  FloatFilterInput: FloatFilterInput
  Float: ResolverTypeWrapper<Scalars['Float']>
  DateTimeFilterInput: DateTimeFilterInput
  JSONFilterInput: JSONFilterInput
  ComponentSharedDivider: ResolverTypeWrapper<ComponentSharedDivider>
  ComponentSharedMedia: ResolverTypeWrapper<ComponentSharedMedia>
  ComponentSharedRichText: ResolverTypeWrapper<ComponentSharedRichText>
  ComponentSharedSeoInput: ComponentSharedSeoInput
  ComponentSharedSeo: ResolverTypeWrapper<ComponentSharedSeo>
  ComponentSharedSlider: ResolverTypeWrapper<ComponentSharedSlider>
  UploadFileFiltersInput: UploadFileFiltersInput
  UploadFileInput: UploadFileInput
  UploadFile: ResolverTypeWrapper<
    Omit<UploadFile, 'related'> & { related?: Maybe<Array<Maybe<ResolversTypes['GenericMorph']>>> }
  >
  UploadFileEntity: ResolverTypeWrapper<UploadFileEntity>
  UploadFileEntityResponse: ResolverTypeWrapper<UploadFileEntityResponse>
  UploadFileEntityResponseCollection: ResolverTypeWrapper<UploadFileEntityResponseCollection>
  UploadFileRelationResponseCollection: ResolverTypeWrapper<UploadFileRelationResponseCollection>
  SchedulerSchedulerFiltersInput: SchedulerSchedulerFiltersInput
  SchedulerSchedulerInput: SchedulerSchedulerInput
  SchedulerScheduler: ResolverTypeWrapper<SchedulerScheduler>
  SchedulerSchedulerEntity: ResolverTypeWrapper<SchedulerSchedulerEntity>
  SchedulerSchedulerEntityResponse: ResolverTypeWrapper<SchedulerSchedulerEntityResponse>
  SchedulerSchedulerEntityResponseCollection: ResolverTypeWrapper<SchedulerSchedulerEntityResponseCollection>
  I18NLocaleFiltersInput: I18NLocaleFiltersInput
  I18NLocale: ResolverTypeWrapper<I18NLocale>
  I18NLocaleEntity: ResolverTypeWrapper<I18NLocaleEntity>
  I18NLocaleEntityResponse: ResolverTypeWrapper<I18NLocaleEntityResponse>
  I18NLocaleEntityResponseCollection: ResolverTypeWrapper<I18NLocaleEntityResponseCollection>
  UsersPermissionsPermissionFiltersInput: UsersPermissionsPermissionFiltersInput
  UsersPermissionsPermission: ResolverTypeWrapper<UsersPermissionsPermission>
  UsersPermissionsPermissionEntity: ResolverTypeWrapper<UsersPermissionsPermissionEntity>
  UsersPermissionsPermissionRelationResponseCollection: ResolverTypeWrapper<UsersPermissionsPermissionRelationResponseCollection>
  UsersPermissionsRoleFiltersInput: UsersPermissionsRoleFiltersInput
  UsersPermissionsRoleInput: UsersPermissionsRoleInput
  UsersPermissionsRole: ResolverTypeWrapper<UsersPermissionsRole>
  UsersPermissionsRoleEntity: ResolverTypeWrapper<UsersPermissionsRoleEntity>
  UsersPermissionsRoleEntityResponse: ResolverTypeWrapper<UsersPermissionsRoleEntityResponse>
  UsersPermissionsRoleEntityResponseCollection: ResolverTypeWrapper<UsersPermissionsRoleEntityResponseCollection>
  UsersPermissionsUserFiltersInput: UsersPermissionsUserFiltersInput
  UsersPermissionsUserInput: UsersPermissionsUserInput
  UsersPermissionsUser: ResolverTypeWrapper<UsersPermissionsUser>
  UsersPermissionsUserEntity: ResolverTypeWrapper<UsersPermissionsUserEntity>
  UsersPermissionsUserEntityResponse: ResolverTypeWrapper<UsersPermissionsUserEntityResponse>
  UsersPermissionsUserEntityResponseCollection: ResolverTypeWrapper<UsersPermissionsUserEntityResponseCollection>
  UsersPermissionsUserRelationResponseCollection: ResolverTypeWrapper<UsersPermissionsUserRelationResponseCollection>
  AboutBlocksDynamicZone:
    | ResolversTypes['ComponentSharedMedia']
    | ResolversTypes['ComponentSharedRichText']
    | ResolversTypes['ComponentSharedSlider']
    | ResolversTypes['Error']
  AboutBlocksDynamicZoneInput: ResolverTypeWrapper<Scalars['AboutBlocksDynamicZoneInput']>
  AboutInput: AboutInput
  About: ResolverTypeWrapper<
    Omit<About, 'blocks'> & { blocks?: Maybe<Array<Maybe<ResolversTypes['AboutBlocksDynamicZone']>>> }
  >
  AboutEntity: ResolverTypeWrapper<AboutEntity>
  AboutEntityResponse: ResolverTypeWrapper<AboutEntityResponse>
  ArticleBlocksDynamicZone:
    | ResolversTypes['ComponentSharedDivider']
    | ResolversTypes['ComponentSharedMedia']
    | ResolversTypes['ComponentSharedRichText']
    | ResolversTypes['ComponentSharedSlider']
    | ResolversTypes['Error']
  ArticleBlocksDynamicZoneInput: ResolverTypeWrapper<Scalars['ArticleBlocksDynamicZoneInput']>
  ArticleFiltersInput: ArticleFiltersInput
  ArticleInput: ArticleInput
  Article: ResolverTypeWrapper<
    Omit<Article, 'blocks'> & { blocks?: Maybe<Array<Maybe<ResolversTypes['ArticleBlocksDynamicZone']>>> }
  >
  ArticleEntity: ResolverTypeWrapper<ArticleEntity>
  ArticleEntityResponse: ResolverTypeWrapper<ArticleEntityResponse>
  ArticleEntityResponseCollection: ResolverTypeWrapper<ArticleEntityResponseCollection>
  ArticleRelationResponseCollection: ResolverTypeWrapper<ArticleRelationResponseCollection>
  AuthorFiltersInput: AuthorFiltersInput
  AuthorInput: AuthorInput
  Author: ResolverTypeWrapper<Author>
  AuthorEntity: ResolverTypeWrapper<AuthorEntity>
  AuthorEntityResponse: ResolverTypeWrapper<AuthorEntityResponse>
  AuthorEntityResponseCollection: ResolverTypeWrapper<AuthorEntityResponseCollection>
  AuthorRelationResponseCollection: ResolverTypeWrapper<AuthorRelationResponseCollection>
  CategoryFiltersInput: CategoryFiltersInput
  CategoryInput: CategoryInput
  Category: ResolverTypeWrapper<Category>
  CategoryEntity: ResolverTypeWrapper<CategoryEntity>
  CategoryEntityResponse: ResolverTypeWrapper<CategoryEntityResponse>
  CategoryEntityResponseCollection: ResolverTypeWrapper<CategoryEntityResponseCollection>
  CategoryRelationResponseCollection: ResolverTypeWrapper<CategoryRelationResponseCollection>
  GlobalInput: GlobalInput
  Global: ResolverTypeWrapper<Global>
  GlobalEntity: ResolverTypeWrapper<GlobalEntity>
  GlobalEntityResponse: ResolverTypeWrapper<GlobalEntityResponse>
  GenericMorph:
    | ResolversTypes['ComponentSharedDivider']
    | ResolversTypes['ComponentSharedMedia']
    | ResolversTypes['ComponentSharedRichText']
    | ResolversTypes['ComponentSharedSeo']
    | ResolversTypes['ComponentSharedSlider']
    | ResolversTypes['UploadFile']
    | ResolversTypes['SchedulerScheduler']
    | ResolversTypes['I18NLocale']
    | ResolversTypes['UsersPermissionsPermission']
    | ResolversTypes['UsersPermissionsRole']
    | ResolversTypes['UsersPermissionsUser']
    | ResolversTypes['About']
    | ResolversTypes['Article']
    | ResolversTypes['Author']
    | ResolversTypes['Category']
    | ResolversTypes['Global']
  FileInfoInput: FileInfoInput
  UsersPermissionsMe: ResolverTypeWrapper<UsersPermissionsMe>
  UsersPermissionsMeRole: ResolverTypeWrapper<UsersPermissionsMeRole>
  UsersPermissionsRegisterInput: UsersPermissionsRegisterInput
  UsersPermissionsLoginInput: UsersPermissionsLoginInput
  UsersPermissionsPasswordPayload: ResolverTypeWrapper<UsersPermissionsPasswordPayload>
  UsersPermissionsLoginPayload: ResolverTypeWrapper<UsersPermissionsLoginPayload>
  UsersPermissionsCreateRolePayload: ResolverTypeWrapper<UsersPermissionsCreateRolePayload>
  UsersPermissionsUpdateRolePayload: ResolverTypeWrapper<UsersPermissionsUpdateRolePayload>
  UsersPermissionsDeleteRolePayload: ResolverTypeWrapper<UsersPermissionsDeleteRolePayload>
  PaginationArg: PaginationArg
  Query: ResolverTypeWrapper<{}>
  Mutation: ResolverTypeWrapper<{}>
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  JSON: Scalars['JSON']
  DateTime: Scalars['DateTime']
  Long: Scalars['Long']
  Upload: Scalars['Upload']
  Error: Error
  String: Scalars['String']
  Pagination: Pagination
  Int: Scalars['Int']
  ResponseCollectionMeta: ResponseCollectionMeta
  IDFilterInput: IDFilterInput
  ID: Scalars['ID']
  Boolean: Scalars['Boolean']
  BooleanFilterInput: BooleanFilterInput
  StringFilterInput: StringFilterInput
  IntFilterInput: IntFilterInput
  LongFilterInput: LongFilterInput
  FloatFilterInput: FloatFilterInput
  Float: Scalars['Float']
  DateTimeFilterInput: DateTimeFilterInput
  JSONFilterInput: JSONFilterInput
  ComponentSharedDivider: ComponentSharedDivider
  ComponentSharedMedia: ComponentSharedMedia
  ComponentSharedRichText: ComponentSharedRichText
  ComponentSharedSeoInput: ComponentSharedSeoInput
  ComponentSharedSeo: ComponentSharedSeo
  ComponentSharedSlider: ComponentSharedSlider
  UploadFileFiltersInput: UploadFileFiltersInput
  UploadFileInput: UploadFileInput
  UploadFile: Omit<UploadFile, 'related'> & { related?: Maybe<Array<Maybe<ResolversParentTypes['GenericMorph']>>> }
  UploadFileEntity: UploadFileEntity
  UploadFileEntityResponse: UploadFileEntityResponse
  UploadFileEntityResponseCollection: UploadFileEntityResponseCollection
  UploadFileRelationResponseCollection: UploadFileRelationResponseCollection
  SchedulerSchedulerFiltersInput: SchedulerSchedulerFiltersInput
  SchedulerSchedulerInput: SchedulerSchedulerInput
  SchedulerScheduler: SchedulerScheduler
  SchedulerSchedulerEntity: SchedulerSchedulerEntity
  SchedulerSchedulerEntityResponse: SchedulerSchedulerEntityResponse
  SchedulerSchedulerEntityResponseCollection: SchedulerSchedulerEntityResponseCollection
  I18NLocaleFiltersInput: I18NLocaleFiltersInput
  I18NLocale: I18NLocale
  I18NLocaleEntity: I18NLocaleEntity
  I18NLocaleEntityResponse: I18NLocaleEntityResponse
  I18NLocaleEntityResponseCollection: I18NLocaleEntityResponseCollection
  UsersPermissionsPermissionFiltersInput: UsersPermissionsPermissionFiltersInput
  UsersPermissionsPermission: UsersPermissionsPermission
  UsersPermissionsPermissionEntity: UsersPermissionsPermissionEntity
  UsersPermissionsPermissionRelationResponseCollection: UsersPermissionsPermissionRelationResponseCollection
  UsersPermissionsRoleFiltersInput: UsersPermissionsRoleFiltersInput
  UsersPermissionsRoleInput: UsersPermissionsRoleInput
  UsersPermissionsRole: UsersPermissionsRole
  UsersPermissionsRoleEntity: UsersPermissionsRoleEntity
  UsersPermissionsRoleEntityResponse: UsersPermissionsRoleEntityResponse
  UsersPermissionsRoleEntityResponseCollection: UsersPermissionsRoleEntityResponseCollection
  UsersPermissionsUserFiltersInput: UsersPermissionsUserFiltersInput
  UsersPermissionsUserInput: UsersPermissionsUserInput
  UsersPermissionsUser: UsersPermissionsUser
  UsersPermissionsUserEntity: UsersPermissionsUserEntity
  UsersPermissionsUserEntityResponse: UsersPermissionsUserEntityResponse
  UsersPermissionsUserEntityResponseCollection: UsersPermissionsUserEntityResponseCollection
  UsersPermissionsUserRelationResponseCollection: UsersPermissionsUserRelationResponseCollection
  AboutBlocksDynamicZone:
    | ResolversParentTypes['ComponentSharedMedia']
    | ResolversParentTypes['ComponentSharedRichText']
    | ResolversParentTypes['ComponentSharedSlider']
    | ResolversParentTypes['Error']
  AboutBlocksDynamicZoneInput: Scalars['AboutBlocksDynamicZoneInput']
  AboutInput: AboutInput
  About: Omit<About, 'blocks'> & { blocks?: Maybe<Array<Maybe<ResolversParentTypes['AboutBlocksDynamicZone']>>> }
  AboutEntity: AboutEntity
  AboutEntityResponse: AboutEntityResponse
  ArticleBlocksDynamicZone:
    | ResolversParentTypes['ComponentSharedDivider']
    | ResolversParentTypes['ComponentSharedMedia']
    | ResolversParentTypes['ComponentSharedRichText']
    | ResolversParentTypes['ComponentSharedSlider']
    | ResolversParentTypes['Error']
  ArticleBlocksDynamicZoneInput: Scalars['ArticleBlocksDynamicZoneInput']
  ArticleFiltersInput: ArticleFiltersInput
  ArticleInput: ArticleInput
  Article: Omit<Article, 'blocks'> & { blocks?: Maybe<Array<Maybe<ResolversParentTypes['ArticleBlocksDynamicZone']>>> }
  ArticleEntity: ArticleEntity
  ArticleEntityResponse: ArticleEntityResponse
  ArticleEntityResponseCollection: ArticleEntityResponseCollection
  ArticleRelationResponseCollection: ArticleRelationResponseCollection
  AuthorFiltersInput: AuthorFiltersInput
  AuthorInput: AuthorInput
  Author: Author
  AuthorEntity: AuthorEntity
  AuthorEntityResponse: AuthorEntityResponse
  AuthorEntityResponseCollection: AuthorEntityResponseCollection
  AuthorRelationResponseCollection: AuthorRelationResponseCollection
  CategoryFiltersInput: CategoryFiltersInput
  CategoryInput: CategoryInput
  Category: Category
  CategoryEntity: CategoryEntity
  CategoryEntityResponse: CategoryEntityResponse
  CategoryEntityResponseCollection: CategoryEntityResponseCollection
  CategoryRelationResponseCollection: CategoryRelationResponseCollection
  GlobalInput: GlobalInput
  Global: Global
  GlobalEntity: GlobalEntity
  GlobalEntityResponse: GlobalEntityResponse
  GenericMorph:
    | ResolversParentTypes['ComponentSharedDivider']
    | ResolversParentTypes['ComponentSharedMedia']
    | ResolversParentTypes['ComponentSharedRichText']
    | ResolversParentTypes['ComponentSharedSeo']
    | ResolversParentTypes['ComponentSharedSlider']
    | ResolversParentTypes['UploadFile']
    | ResolversParentTypes['SchedulerScheduler']
    | ResolversParentTypes['I18NLocale']
    | ResolversParentTypes['UsersPermissionsPermission']
    | ResolversParentTypes['UsersPermissionsRole']
    | ResolversParentTypes['UsersPermissionsUser']
    | ResolversParentTypes['About']
    | ResolversParentTypes['Article']
    | ResolversParentTypes['Author']
    | ResolversParentTypes['Category']
    | ResolversParentTypes['Global']
  FileInfoInput: FileInfoInput
  UsersPermissionsMe: UsersPermissionsMe
  UsersPermissionsMeRole: UsersPermissionsMeRole
  UsersPermissionsRegisterInput: UsersPermissionsRegisterInput
  UsersPermissionsLoginInput: UsersPermissionsLoginInput
  UsersPermissionsPasswordPayload: UsersPermissionsPasswordPayload
  UsersPermissionsLoginPayload: UsersPermissionsLoginPayload
  UsersPermissionsCreateRolePayload: UsersPermissionsCreateRolePayload
  UsersPermissionsUpdateRolePayload: UsersPermissionsUpdateRolePayload
  UsersPermissionsDeleteRolePayload: UsersPermissionsDeleteRolePayload
  PaginationArg: PaginationArg
  Query: {}
  Mutation: {}
}>

export interface JSONScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JSON'], any> {
  name: 'JSON'
}

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface LongScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Long'], any> {
  name: 'Long'
}

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload'
}

export type ErrorResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Error'] = ResolversParentTypes['Error']
> = ResolversObject<{
  code?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PaginationResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Pagination'] = ResolversParentTypes['Pagination']
> = ResolversObject<{
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  page?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  pageSize?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  pageCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ResponseCollectionMetaResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ResponseCollectionMeta'] = ResolversParentTypes['ResponseCollectionMeta']
> = ResolversObject<{
  pagination?: Resolver<ResolversTypes['Pagination'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ComponentSharedDividerResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ComponentSharedDivider'] = ResolversParentTypes['ComponentSharedDivider']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ComponentSharedMediaResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ComponentSharedMedia'] = ResolversParentTypes['ComponentSharedMedia']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  file?: Resolver<Maybe<ResolversTypes['UploadFileEntityResponse']>, ParentType, ContextType>
  caption?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ComponentSharedRichTextResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ComponentSharedRichText'] = ResolversParentTypes['ComponentSharedRichText']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  body?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ComponentSharedSeoResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ComponentSharedSeo'] = ResolversParentTypes['ComponentSharedSeo']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  metaTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  metaDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  shareImage?: Resolver<Maybe<ResolversTypes['UploadFileEntityResponse']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ComponentSharedSliderResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ComponentSharedSlider'] = ResolversParentTypes['ComponentSharedSlider']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  files?: Resolver<
    Maybe<ResolversTypes['UploadFileRelationResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<ComponentSharedSliderfilesArgs, 'pagination' | 'sort'>
  >
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UploadFileResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UploadFile'] = ResolversParentTypes['UploadFile']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  alternativeText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  caption?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  formats?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  hash?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  ext?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  mime?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  size?: Resolver<ResolversTypes['Float'], ParentType, ContextType>
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  previewUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  provider?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  provider_metadata?: Resolver<Maybe<ResolversTypes['JSON']>, ParentType, ContextType>
  related?: Resolver<Maybe<Array<Maybe<ResolversTypes['GenericMorph']>>>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UploadFileEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UploadFileEntity'] = ResolversParentTypes['UploadFileEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['UploadFile']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UploadFileEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UploadFileEntityResponse'] = ResolversParentTypes['UploadFileEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['UploadFileEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UploadFileEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UploadFileEntityResponseCollection'] = ResolversParentTypes['UploadFileEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['UploadFileEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UploadFileRelationResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UploadFileRelationResponseCollection'] = ResolversParentTypes['UploadFileRelationResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['UploadFileEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SchedulerSchedulerResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['SchedulerScheduler'] = ResolversParentTypes['SchedulerScheduler']
> = ResolversObject<{
  scheduledDatetime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  uid?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  contentId?: Resolver<Maybe<ResolversTypes['Long']>, ParentType, ContextType>
  scheduleType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SchedulerSchedulerEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['SchedulerSchedulerEntity'] = ResolversParentTypes['SchedulerSchedulerEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['SchedulerScheduler']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SchedulerSchedulerEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['SchedulerSchedulerEntityResponse'] = ResolversParentTypes['SchedulerSchedulerEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['SchedulerSchedulerEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type SchedulerSchedulerEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['SchedulerSchedulerEntityResponseCollection'] = ResolversParentTypes['SchedulerSchedulerEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['SchedulerSchedulerEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type I18NLocaleResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['I18NLocale'] = ResolversParentTypes['I18NLocale']
> = ResolversObject<{
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type I18NLocaleEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['I18NLocaleEntity'] = ResolversParentTypes['I18NLocaleEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['I18NLocale']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type I18NLocaleEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['I18NLocaleEntityResponse'] = ResolversParentTypes['I18NLocaleEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['I18NLocaleEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type I18NLocaleEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['I18NLocaleEntityResponseCollection'] = ResolversParentTypes['I18NLocaleEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['I18NLocaleEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsPermissionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsPermission'] = ResolversParentTypes['UsersPermissionsPermission']
> = ResolversObject<{
  action?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  role?: Resolver<Maybe<ResolversTypes['UsersPermissionsRoleEntityResponse']>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsPermissionEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsPermissionEntity'] = ResolversParentTypes['UsersPermissionsPermissionEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['UsersPermissionsPermission']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsPermissionRelationResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsPermissionRelationResponseCollection'] = ResolversParentTypes['UsersPermissionsPermissionRelationResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['UsersPermissionsPermissionEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsRoleResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsRole'] = ResolversParentTypes['UsersPermissionsRole']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  permissions?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsPermissionRelationResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<UsersPermissionsRolepermissionsArgs, 'pagination' | 'sort'>
  >
  users?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsUserRelationResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<UsersPermissionsRoleusersArgs, 'pagination' | 'sort'>
  >
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsRoleEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsRoleEntity'] = ResolversParentTypes['UsersPermissionsRoleEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['UsersPermissionsRole']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsRoleEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsRoleEntityResponse'] = ResolversParentTypes['UsersPermissionsRoleEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['UsersPermissionsRoleEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsRoleEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsRoleEntityResponseCollection'] = ResolversParentTypes['UsersPermissionsRoleEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['UsersPermissionsRoleEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsUserResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsUser'] = ResolversParentTypes['UsersPermissionsUser']
> = ResolversObject<{
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  provider?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  confirmed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  blocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  role?: Resolver<Maybe<ResolversTypes['UsersPermissionsRoleEntityResponse']>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsUserEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsUserEntity'] = ResolversParentTypes['UsersPermissionsUserEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['UsersPermissionsUser']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsUserEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsUserEntityResponse'] = ResolversParentTypes['UsersPermissionsUserEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['UsersPermissionsUserEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsUserEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsUserEntityResponseCollection'] = ResolversParentTypes['UsersPermissionsUserEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['UsersPermissionsUserEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsUserRelationResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsUserRelationResponseCollection'] = ResolversParentTypes['UsersPermissionsUserRelationResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['UsersPermissionsUserEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AboutBlocksDynamicZoneResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AboutBlocksDynamicZone'] = ResolversParentTypes['AboutBlocksDynamicZone']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'ComponentSharedMedia' | 'ComponentSharedRichText' | 'ComponentSharedSlider' | 'Error',
    ParentType,
    ContextType
  >
}>

export interface AboutBlocksDynamicZoneInputScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['AboutBlocksDynamicZoneInput'], any> {
  name: 'AboutBlocksDynamicZoneInput'
}

export type AboutResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['About'] = ResolversParentTypes['About']
> = ResolversObject<{
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  blocks?: Resolver<Maybe<Array<Maybe<ResolversTypes['AboutBlocksDynamicZone']>>>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AboutEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AboutEntity'] = ResolversParentTypes['AboutEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['About']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AboutEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AboutEntityResponse'] = ResolversParentTypes['AboutEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['AboutEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ArticleBlocksDynamicZoneResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ArticleBlocksDynamicZone'] = ResolversParentTypes['ArticleBlocksDynamicZone']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    'ComponentSharedDivider' | 'ComponentSharedMedia' | 'ComponentSharedRichText' | 'ComponentSharedSlider' | 'Error',
    ParentType,
    ContextType
  >
}>

export interface ArticleBlocksDynamicZoneInputScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['ArticleBlocksDynamicZoneInput'], any> {
  name: 'ArticleBlocksDynamicZoneInput'
}

export type ArticleResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Article'] = ResolversParentTypes['Article']
> = ResolversObject<{
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  cover?: Resolver<ResolversTypes['UploadFileEntityResponse'], ParentType, ContextType>
  authors?: Resolver<
    Maybe<ResolversTypes['AuthorRelationResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<ArticleauthorsArgs, 'pagination' | 'sort'>
  >
  categories?: Resolver<
    Maybe<ResolversTypes['CategoryRelationResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<ArticlecategoriesArgs, 'pagination' | 'sort'>
  >
  blocks?: Resolver<Maybe<Array<Maybe<ResolversTypes['ArticleBlocksDynamicZone']>>>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  publishedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ArticleEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ArticleEntity'] = ResolversParentTypes['ArticleEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['Article']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ArticleEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ArticleEntityResponse'] = ResolversParentTypes['ArticleEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['ArticleEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ArticleEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ArticleEntityResponseCollection'] = ResolversParentTypes['ArticleEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['ArticleEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type ArticleRelationResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['ArticleRelationResponseCollection'] = ResolversParentTypes['ArticleRelationResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['ArticleEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Author'] = ResolversParentTypes['Author']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  avatar?: Resolver<ResolversTypes['UploadFileEntityResponse'], ParentType, ContextType>
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  handle?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  articles?: Resolver<
    Maybe<ResolversTypes['ArticleRelationResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<AuthorarticlesArgs, 'pagination' | 'sort' | 'publicationState'>
  >
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AuthorEntity'] = ResolversParentTypes['AuthorEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['Author']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AuthorEntityResponse'] = ResolversParentTypes['AuthorEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['AuthorEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AuthorEntityResponseCollection'] = ResolversParentTypes['AuthorEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['AuthorEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type AuthorRelationResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AuthorRelationResponseCollection'] = ResolversParentTypes['AuthorRelationResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['AuthorEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CategoryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']
> = ResolversObject<{
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  articles?: Resolver<
    Maybe<ResolversTypes['ArticleRelationResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<CategoryarticlesArgs, 'pagination' | 'sort' | 'publicationState'>
  >
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CategoryEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['CategoryEntity'] = ResolversParentTypes['CategoryEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CategoryEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['CategoryEntityResponse'] = ResolversParentTypes['CategoryEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['CategoryEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CategoryEntityResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['CategoryEntityResponseCollection'] = ResolversParentTypes['CategoryEntityResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['CategoryEntity']>, ParentType, ContextType>
  meta?: Resolver<ResolversTypes['ResponseCollectionMeta'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CategoryRelationResponseCollectionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['CategoryRelationResponseCollection'] = ResolversParentTypes['CategoryRelationResponseCollection']
> = ResolversObject<{
  data?: Resolver<Array<ResolversTypes['CategoryEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type GlobalResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Global'] = ResolversParentTypes['Global']
> = ResolversObject<{
  siteName?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  favicon?: Resolver<Maybe<ResolversTypes['UploadFileEntityResponse']>, ParentType, ContextType>
  siteDescription?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  defaultSeo?: Resolver<Maybe<ResolversTypes['ComponentSharedSeo']>, ParentType, ContextType>
  createdAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  updatedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type GlobalEntityResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['GlobalEntity'] = ResolversParentTypes['GlobalEntity']
> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>
  attributes?: Resolver<Maybe<ResolversTypes['Global']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type GlobalEntityResponseResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['GlobalEntityResponse'] = ResolversParentTypes['GlobalEntityResponse']
> = ResolversObject<{
  data?: Resolver<Maybe<ResolversTypes['GlobalEntity']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type GenericMorphResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['GenericMorph'] = ResolversParentTypes['GenericMorph']
> = ResolversObject<{
  __resolveType: TypeResolveFn<
    | 'ComponentSharedDivider'
    | 'ComponentSharedMedia'
    | 'ComponentSharedRichText'
    | 'ComponentSharedSeo'
    | 'ComponentSharedSlider'
    | 'UploadFile'
    | 'SchedulerScheduler'
    | 'I18NLocale'
    | 'UsersPermissionsPermission'
    | 'UsersPermissionsRole'
    | 'UsersPermissionsUser'
    | 'About'
    | 'Article'
    | 'Author'
    | 'Category'
    | 'Global',
    ParentType,
    ContextType
  >
}>

export type UsersPermissionsMeResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsMe'] = ResolversParentTypes['UsersPermissionsMe']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  confirmed?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  blocked?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  role?: Resolver<Maybe<ResolversTypes['UsersPermissionsMeRole']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsMeRoleResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsMeRole'] = ResolversParentTypes['UsersPermissionsMeRole']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsPasswordPayloadResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsPasswordPayload'] = ResolversParentTypes['UsersPermissionsPasswordPayload']
> = ResolversObject<{
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsLoginPayloadResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsLoginPayload'] = ResolversParentTypes['UsersPermissionsLoginPayload']
> = ResolversObject<{
  jwt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  user?: Resolver<ResolversTypes['UsersPermissionsMe'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsCreateRolePayloadResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsCreateRolePayload'] = ResolversParentTypes['UsersPermissionsCreateRolePayload']
> = ResolversObject<{
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsUpdateRolePayloadResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsUpdateRolePayload'] = ResolversParentTypes['UsersPermissionsUpdateRolePayload']
> = ResolversObject<{
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type UsersPermissionsDeleteRolePayloadResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['UsersPermissionsDeleteRolePayload'] = ResolversParentTypes['UsersPermissionsDeleteRolePayload']
> = ResolversObject<{
  ok?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  uploadFile?: Resolver<
    Maybe<ResolversTypes['UploadFileEntityResponse']>,
    ParentType,
    ContextType,
    Partial<QueryuploadFileArgs>
  >
  uploadFiles?: Resolver<
    Maybe<ResolversTypes['UploadFileEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<QueryuploadFilesArgs, 'pagination' | 'sort'>
  >
  schedulerScheduler?: Resolver<
    Maybe<ResolversTypes['SchedulerSchedulerEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<QueryschedulerSchedulerArgs, 'pagination' | 'sort'>
  >
  i18NLocale?: Resolver<
    Maybe<ResolversTypes['I18NLocaleEntityResponse']>,
    ParentType,
    ContextType,
    Partial<Queryi18NLocaleArgs>
  >
  i18NLocales?: Resolver<
    Maybe<ResolversTypes['I18NLocaleEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<Queryi18NLocalesArgs, 'pagination' | 'sort'>
  >
  usersPermissionsRole?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsRoleEntityResponse']>,
    ParentType,
    ContextType,
    Partial<QueryusersPermissionsRoleArgs>
  >
  usersPermissionsRoles?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsRoleEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<QueryusersPermissionsRolesArgs, 'pagination' | 'sort'>
  >
  usersPermissionsUser?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsUserEntityResponse']>,
    ParentType,
    ContextType,
    Partial<QueryusersPermissionsUserArgs>
  >
  usersPermissionsUsers?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsUserEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<QueryusersPermissionsUsersArgs, 'pagination' | 'sort'>
  >
  about?: Resolver<Maybe<ResolversTypes['AboutEntityResponse']>, ParentType, ContextType>
  article?: Resolver<Maybe<ResolversTypes['ArticleEntityResponse']>, ParentType, ContextType, Partial<QueryarticleArgs>>
  articles?: Resolver<
    Maybe<ResolversTypes['ArticleEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<QueryarticlesArgs, 'pagination' | 'sort' | 'publicationState'>
  >
  author?: Resolver<Maybe<ResolversTypes['AuthorEntityResponse']>, ParentType, ContextType, Partial<QueryauthorArgs>>
  authors?: Resolver<
    Maybe<ResolversTypes['AuthorEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<QueryauthorsArgs, 'pagination' | 'sort'>
  >
  category?: Resolver<
    Maybe<ResolversTypes['CategoryEntityResponse']>,
    ParentType,
    ContextType,
    Partial<QuerycategoryArgs>
  >
  categories?: Resolver<
    Maybe<ResolversTypes['CategoryEntityResponseCollection']>,
    ParentType,
    ContextType,
    RequireFields<QuerycategoriesArgs, 'pagination' | 'sort'>
  >
  global?: Resolver<Maybe<ResolversTypes['GlobalEntityResponse']>, ParentType, ContextType>
  me?: Resolver<Maybe<ResolversTypes['UsersPermissionsMe']>, ParentType, ContextType>
}>

export type MutationResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  createUploadFile?: Resolver<
    Maybe<ResolversTypes['UploadFileEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateUploadFileArgs, 'data'>
  >
  updateUploadFile?: Resolver<
    Maybe<ResolversTypes['UploadFileEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateUploadFileArgs, 'id' | 'data'>
  >
  deleteUploadFile?: Resolver<
    Maybe<ResolversTypes['UploadFileEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteUploadFileArgs, 'id'>
  >
  createSchedulerScheduler?: Resolver<
    Maybe<ResolversTypes['SchedulerSchedulerEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateSchedulerSchedulerArgs, 'data'>
  >
  updateSchedulerScheduler?: Resolver<
    Maybe<ResolversTypes['SchedulerSchedulerEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateSchedulerSchedulerArgs, 'id' | 'data'>
  >
  deleteSchedulerScheduler?: Resolver<
    Maybe<ResolversTypes['SchedulerSchedulerEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteSchedulerSchedulerArgs, 'id'>
  >
  updateAbout?: Resolver<
    Maybe<ResolversTypes['AboutEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateAboutArgs, 'data'>
  >
  deleteAbout?: Resolver<Maybe<ResolversTypes['AboutEntityResponse']>, ParentType, ContextType>
  createArticle?: Resolver<
    Maybe<ResolversTypes['ArticleEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateArticleArgs, 'data'>
  >
  updateArticle?: Resolver<
    Maybe<ResolversTypes['ArticleEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateArticleArgs, 'id' | 'data'>
  >
  deleteArticle?: Resolver<
    Maybe<ResolversTypes['ArticleEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteArticleArgs, 'id'>
  >
  createAuthor?: Resolver<
    Maybe<ResolversTypes['AuthorEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateAuthorArgs, 'data'>
  >
  updateAuthor?: Resolver<
    Maybe<ResolversTypes['AuthorEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateAuthorArgs, 'id' | 'data'>
  >
  deleteAuthor?: Resolver<
    Maybe<ResolversTypes['AuthorEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteAuthorArgs, 'id'>
  >
  createCategory?: Resolver<
    Maybe<ResolversTypes['CategoryEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateCategoryArgs, 'data'>
  >
  updateCategory?: Resolver<
    Maybe<ResolversTypes['CategoryEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateCategoryArgs, 'id' | 'data'>
  >
  deleteCategory?: Resolver<
    Maybe<ResolversTypes['CategoryEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteCategoryArgs, 'id'>
  >
  updateGlobal?: Resolver<
    Maybe<ResolversTypes['GlobalEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateGlobalArgs, 'data'>
  >
  deleteGlobal?: Resolver<Maybe<ResolversTypes['GlobalEntityResponse']>, ParentType, ContextType>
  upload?: Resolver<
    ResolversTypes['UploadFileEntityResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationuploadArgs, 'file'>
  >
  multipleUpload?: Resolver<
    Array<Maybe<ResolversTypes['UploadFileEntityResponse']>>,
    ParentType,
    ContextType,
    RequireFields<MutationmultipleUploadArgs, 'files'>
  >
  updateFileInfo?: Resolver<
    ResolversTypes['UploadFileEntityResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationupdateFileInfoArgs, 'id'>
  >
  removeFile?: Resolver<
    Maybe<ResolversTypes['UploadFileEntityResponse']>,
    ParentType,
    ContextType,
    RequireFields<MutationremoveFileArgs, 'id'>
  >
  createUsersPermissionsRole?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsCreateRolePayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationcreateUsersPermissionsRoleArgs, 'data'>
  >
  updateUsersPermissionsRole?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsUpdateRolePayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationupdateUsersPermissionsRoleArgs, 'id' | 'data'>
  >
  deleteUsersPermissionsRole?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsDeleteRolePayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationdeleteUsersPermissionsRoleArgs, 'id'>
  >
  createUsersPermissionsUser?: Resolver<
    ResolversTypes['UsersPermissionsUserEntityResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationcreateUsersPermissionsUserArgs, 'data'>
  >
  updateUsersPermissionsUser?: Resolver<
    ResolversTypes['UsersPermissionsUserEntityResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationupdateUsersPermissionsUserArgs, 'id' | 'data'>
  >
  deleteUsersPermissionsUser?: Resolver<
    ResolversTypes['UsersPermissionsUserEntityResponse'],
    ParentType,
    ContextType,
    RequireFields<MutationdeleteUsersPermissionsUserArgs, 'id'>
  >
  login?: Resolver<
    ResolversTypes['UsersPermissionsLoginPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationloginArgs, 'input'>
  >
  register?: Resolver<
    ResolversTypes['UsersPermissionsLoginPayload'],
    ParentType,
    ContextType,
    RequireFields<MutationregisterArgs, 'input'>
  >
  forgotPassword?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsPasswordPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationforgotPasswordArgs, 'email'>
  >
  resetPassword?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsLoginPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationresetPasswordArgs, 'password' | 'passwordConfirmation' | 'code'>
  >
  emailConfirmation?: Resolver<
    Maybe<ResolversTypes['UsersPermissionsLoginPayload']>,
    ParentType,
    ContextType,
    RequireFields<MutationemailConfirmationArgs, 'confirmation'>
  >
}>

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  JSON?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  Long?: GraphQLScalarType
  Upload?: GraphQLScalarType
  Error?: ErrorResolvers<ContextType>
  Pagination?: PaginationResolvers<ContextType>
  ResponseCollectionMeta?: ResponseCollectionMetaResolvers<ContextType>
  ComponentSharedDivider?: ComponentSharedDividerResolvers<ContextType>
  ComponentSharedMedia?: ComponentSharedMediaResolvers<ContextType>
  ComponentSharedRichText?: ComponentSharedRichTextResolvers<ContextType>
  ComponentSharedSeo?: ComponentSharedSeoResolvers<ContextType>
  ComponentSharedSlider?: ComponentSharedSliderResolvers<ContextType>
  UploadFile?: UploadFileResolvers<ContextType>
  UploadFileEntity?: UploadFileEntityResolvers<ContextType>
  UploadFileEntityResponse?: UploadFileEntityResponseResolvers<ContextType>
  UploadFileEntityResponseCollection?: UploadFileEntityResponseCollectionResolvers<ContextType>
  UploadFileRelationResponseCollection?: UploadFileRelationResponseCollectionResolvers<ContextType>
  SchedulerScheduler?: SchedulerSchedulerResolvers<ContextType>
  SchedulerSchedulerEntity?: SchedulerSchedulerEntityResolvers<ContextType>
  SchedulerSchedulerEntityResponse?: SchedulerSchedulerEntityResponseResolvers<ContextType>
  SchedulerSchedulerEntityResponseCollection?: SchedulerSchedulerEntityResponseCollectionResolvers<ContextType>
  I18NLocale?: I18NLocaleResolvers<ContextType>
  I18NLocaleEntity?: I18NLocaleEntityResolvers<ContextType>
  I18NLocaleEntityResponse?: I18NLocaleEntityResponseResolvers<ContextType>
  I18NLocaleEntityResponseCollection?: I18NLocaleEntityResponseCollectionResolvers<ContextType>
  UsersPermissionsPermission?: UsersPermissionsPermissionResolvers<ContextType>
  UsersPermissionsPermissionEntity?: UsersPermissionsPermissionEntityResolvers<ContextType>
  UsersPermissionsPermissionRelationResponseCollection?: UsersPermissionsPermissionRelationResponseCollectionResolvers<ContextType>
  UsersPermissionsRole?: UsersPermissionsRoleResolvers<ContextType>
  UsersPermissionsRoleEntity?: UsersPermissionsRoleEntityResolvers<ContextType>
  UsersPermissionsRoleEntityResponse?: UsersPermissionsRoleEntityResponseResolvers<ContextType>
  UsersPermissionsRoleEntityResponseCollection?: UsersPermissionsRoleEntityResponseCollectionResolvers<ContextType>
  UsersPermissionsUser?: UsersPermissionsUserResolvers<ContextType>
  UsersPermissionsUserEntity?: UsersPermissionsUserEntityResolvers<ContextType>
  UsersPermissionsUserEntityResponse?: UsersPermissionsUserEntityResponseResolvers<ContextType>
  UsersPermissionsUserEntityResponseCollection?: UsersPermissionsUserEntityResponseCollectionResolvers<ContextType>
  UsersPermissionsUserRelationResponseCollection?: UsersPermissionsUserRelationResponseCollectionResolvers<ContextType>
  AboutBlocksDynamicZone?: AboutBlocksDynamicZoneResolvers<ContextType>
  AboutBlocksDynamicZoneInput?: GraphQLScalarType
  About?: AboutResolvers<ContextType>
  AboutEntity?: AboutEntityResolvers<ContextType>
  AboutEntityResponse?: AboutEntityResponseResolvers<ContextType>
  ArticleBlocksDynamicZone?: ArticleBlocksDynamicZoneResolvers<ContextType>
  ArticleBlocksDynamicZoneInput?: GraphQLScalarType
  Article?: ArticleResolvers<ContextType>
  ArticleEntity?: ArticleEntityResolvers<ContextType>
  ArticleEntityResponse?: ArticleEntityResponseResolvers<ContextType>
  ArticleEntityResponseCollection?: ArticleEntityResponseCollectionResolvers<ContextType>
  ArticleRelationResponseCollection?: ArticleRelationResponseCollectionResolvers<ContextType>
  Author?: AuthorResolvers<ContextType>
  AuthorEntity?: AuthorEntityResolvers<ContextType>
  AuthorEntityResponse?: AuthorEntityResponseResolvers<ContextType>
  AuthorEntityResponseCollection?: AuthorEntityResponseCollectionResolvers<ContextType>
  AuthorRelationResponseCollection?: AuthorRelationResponseCollectionResolvers<ContextType>
  Category?: CategoryResolvers<ContextType>
  CategoryEntity?: CategoryEntityResolvers<ContextType>
  CategoryEntityResponse?: CategoryEntityResponseResolvers<ContextType>
  CategoryEntityResponseCollection?: CategoryEntityResponseCollectionResolvers<ContextType>
  CategoryRelationResponseCollection?: CategoryRelationResponseCollectionResolvers<ContextType>
  Global?: GlobalResolvers<ContextType>
  GlobalEntity?: GlobalEntityResolvers<ContextType>
  GlobalEntityResponse?: GlobalEntityResponseResolvers<ContextType>
  GenericMorph?: GenericMorphResolvers<ContextType>
  UsersPermissionsMe?: UsersPermissionsMeResolvers<ContextType>
  UsersPermissionsMeRole?: UsersPermissionsMeRoleResolvers<ContextType>
  UsersPermissionsPasswordPayload?: UsersPermissionsPasswordPayloadResolvers<ContextType>
  UsersPermissionsLoginPayload?: UsersPermissionsLoginPayloadResolvers<ContextType>
  UsersPermissionsCreateRolePayload?: UsersPermissionsCreateRolePayloadResolvers<ContextType>
  UsersPermissionsUpdateRolePayload?: UsersPermissionsUpdateRolePayloadResolvers<ContextType>
  UsersPermissionsDeleteRolePayload?: UsersPermissionsDeleteRolePayloadResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
}>

import { MeshContext as BaseMeshContext, MeshInstance } from '@graphql-mesh/runtime'

import { InContextSdkMethod } from '@graphql-mesh/types'

export namespace CmsTypes {
  export type Maybe<T> = T | null
  export type InputMaybe<T> = Maybe<T>
  export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
  export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
  export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
  /** All built-in and custom scalars, mapped to their actual values */
  export type Scalars = {
    ID: string
    String: string
    Boolean: boolean
    Int: number
    Float: number
    JSON: any
    DateTime: any
    Long: any
    Upload: any
    AboutBlocksDynamicZoneInput: any
    ArticleBlocksDynamicZoneInput: any
  }

  export type Error = {
    code: Scalars['String']
    message?: Maybe<Scalars['String']>
  }

  export type Pagination = {
    total: Scalars['Int']
    page: Scalars['Int']
    pageSize: Scalars['Int']
    pageCount: Scalars['Int']
  }

  export type ResponseCollectionMeta = {
    pagination: Pagination
  }

  export type PublicationState = 'LIVE' | 'PREVIEW'

  export type IDFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    not?: InputMaybe<IDFilterInput>
    eq?: InputMaybe<Scalars['ID']>
    ne?: InputMaybe<Scalars['ID']>
    startsWith?: InputMaybe<Scalars['ID']>
    endsWith?: InputMaybe<Scalars['ID']>
    contains?: InputMaybe<Scalars['ID']>
    notContains?: InputMaybe<Scalars['ID']>
    containsi?: InputMaybe<Scalars['ID']>
    notContainsi?: InputMaybe<Scalars['ID']>
    gt?: InputMaybe<Scalars['ID']>
    gte?: InputMaybe<Scalars['ID']>
    lt?: InputMaybe<Scalars['ID']>
    lte?: InputMaybe<Scalars['ID']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  }

  export type BooleanFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
    not?: InputMaybe<BooleanFilterInput>
    eq?: InputMaybe<Scalars['Boolean']>
    ne?: InputMaybe<Scalars['Boolean']>
    startsWith?: InputMaybe<Scalars['Boolean']>
    endsWith?: InputMaybe<Scalars['Boolean']>
    contains?: InputMaybe<Scalars['Boolean']>
    notContains?: InputMaybe<Scalars['Boolean']>
    containsi?: InputMaybe<Scalars['Boolean']>
    notContainsi?: InputMaybe<Scalars['Boolean']>
    gt?: InputMaybe<Scalars['Boolean']>
    gte?: InputMaybe<Scalars['Boolean']>
    lt?: InputMaybe<Scalars['Boolean']>
    lte?: InputMaybe<Scalars['Boolean']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['Boolean']>>>
  }

  export type StringFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    not?: InputMaybe<StringFilterInput>
    eq?: InputMaybe<Scalars['String']>
    ne?: InputMaybe<Scalars['String']>
    startsWith?: InputMaybe<Scalars['String']>
    endsWith?: InputMaybe<Scalars['String']>
    contains?: InputMaybe<Scalars['String']>
    notContains?: InputMaybe<Scalars['String']>
    containsi?: InputMaybe<Scalars['String']>
    notContainsi?: InputMaybe<Scalars['String']>
    gt?: InputMaybe<Scalars['String']>
    gte?: InputMaybe<Scalars['String']>
    lt?: InputMaybe<Scalars['String']>
    lte?: InputMaybe<Scalars['String']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type IntFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
    not?: InputMaybe<IntFilterInput>
    eq?: InputMaybe<Scalars['Int']>
    ne?: InputMaybe<Scalars['Int']>
    startsWith?: InputMaybe<Scalars['Int']>
    endsWith?: InputMaybe<Scalars['Int']>
    contains?: InputMaybe<Scalars['Int']>
    notContains?: InputMaybe<Scalars['Int']>
    containsi?: InputMaybe<Scalars['Int']>
    notContainsi?: InputMaybe<Scalars['Int']>
    gt?: InputMaybe<Scalars['Int']>
    gte?: InputMaybe<Scalars['Int']>
    lt?: InputMaybe<Scalars['Int']>
    lte?: InputMaybe<Scalars['Int']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['Int']>>>
  }

  export type LongFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
    not?: InputMaybe<LongFilterInput>
    eq?: InputMaybe<Scalars['Long']>
    ne?: InputMaybe<Scalars['Long']>
    startsWith?: InputMaybe<Scalars['Long']>
    endsWith?: InputMaybe<Scalars['Long']>
    contains?: InputMaybe<Scalars['Long']>
    notContains?: InputMaybe<Scalars['Long']>
    containsi?: InputMaybe<Scalars['Long']>
    notContainsi?: InputMaybe<Scalars['Long']>
    gt?: InputMaybe<Scalars['Long']>
    gte?: InputMaybe<Scalars['Long']>
    lt?: InputMaybe<Scalars['Long']>
    lte?: InputMaybe<Scalars['Long']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['Long']>>>
  }

  export type FloatFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
    not?: InputMaybe<FloatFilterInput>
    eq?: InputMaybe<Scalars['Float']>
    ne?: InputMaybe<Scalars['Float']>
    startsWith?: InputMaybe<Scalars['Float']>
    endsWith?: InputMaybe<Scalars['Float']>
    contains?: InputMaybe<Scalars['Float']>
    notContains?: InputMaybe<Scalars['Float']>
    containsi?: InputMaybe<Scalars['Float']>
    notContainsi?: InputMaybe<Scalars['Float']>
    gt?: InputMaybe<Scalars['Float']>
    gte?: InputMaybe<Scalars['Float']>
    lt?: InputMaybe<Scalars['Float']>
    lte?: InputMaybe<Scalars['Float']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['Float']>>>
  }

  export type DateTimeFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
    not?: InputMaybe<DateTimeFilterInput>
    eq?: InputMaybe<Scalars['DateTime']>
    ne?: InputMaybe<Scalars['DateTime']>
    startsWith?: InputMaybe<Scalars['DateTime']>
    endsWith?: InputMaybe<Scalars['DateTime']>
    contains?: InputMaybe<Scalars['DateTime']>
    notContains?: InputMaybe<Scalars['DateTime']>
    containsi?: InputMaybe<Scalars['DateTime']>
    notContainsi?: InputMaybe<Scalars['DateTime']>
    gt?: InputMaybe<Scalars['DateTime']>
    gte?: InputMaybe<Scalars['DateTime']>
    lt?: InputMaybe<Scalars['DateTime']>
    lte?: InputMaybe<Scalars['DateTime']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['DateTime']>>>
  }

  export type JSONFilterInput = {
    and?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
    or?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
    not?: InputMaybe<JSONFilterInput>
    eq?: InputMaybe<Scalars['JSON']>
    ne?: InputMaybe<Scalars['JSON']>
    startsWith?: InputMaybe<Scalars['JSON']>
    endsWith?: InputMaybe<Scalars['JSON']>
    contains?: InputMaybe<Scalars['JSON']>
    notContains?: InputMaybe<Scalars['JSON']>
    containsi?: InputMaybe<Scalars['JSON']>
    notContainsi?: InputMaybe<Scalars['JSON']>
    gt?: InputMaybe<Scalars['JSON']>
    gte?: InputMaybe<Scalars['JSON']>
    lt?: InputMaybe<Scalars['JSON']>
    lte?: InputMaybe<Scalars['JSON']>
    null?: InputMaybe<Scalars['Boolean']>
    notNull?: InputMaybe<Scalars['Boolean']>
    in?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
    notIn?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
    between?: InputMaybe<Array<InputMaybe<Scalars['JSON']>>>
  }

  export type ComponentSharedDivider = {
    id: Scalars['ID']
  }

  export type ComponentSharedMedia = {
    id: Scalars['ID']
    file?: Maybe<UploadFileEntityResponse>
    caption?: Maybe<Scalars['String']>
  }

  export type ComponentSharedRichText = {
    id: Scalars['ID']
    body?: Maybe<Scalars['String']>
  }

  export type ComponentSharedSeoInput = {
    id?: InputMaybe<Scalars['ID']>
    metaTitle?: InputMaybe<Scalars['String']>
    metaDescription?: InputMaybe<Scalars['String']>
    shareImage?: InputMaybe<Scalars['ID']>
  }

  export type ComponentSharedSeo = {
    id: Scalars['ID']
    metaTitle: Scalars['String']
    metaDescription: Scalars['String']
    shareImage?: Maybe<UploadFileEntityResponse>
  }

  export type ComponentSharedSlider = {
    id: Scalars['ID']
    files?: Maybe<UploadFileRelationResponseCollection>
  }

  export type ComponentSharedSliderfilesArgs = {
    filters?: InputMaybe<UploadFileFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type UploadFileFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    name?: InputMaybe<StringFilterInput>
    alternativeText?: InputMaybe<StringFilterInput>
    caption?: InputMaybe<StringFilterInput>
    width?: InputMaybe<IntFilterInput>
    height?: InputMaybe<IntFilterInput>
    formats?: InputMaybe<JSONFilterInput>
    hash?: InputMaybe<StringFilterInput>
    ext?: InputMaybe<StringFilterInput>
    mime?: InputMaybe<StringFilterInput>
    size?: InputMaybe<FloatFilterInput>
    url?: InputMaybe<StringFilterInput>
    previewUrl?: InputMaybe<StringFilterInput>
    provider?: InputMaybe<StringFilterInput>
    provider_metadata?: InputMaybe<JSONFilterInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<UploadFileFiltersInput>>>
    not?: InputMaybe<UploadFileFiltersInput>
  }

  export type UploadFileInput = {
    name?: InputMaybe<Scalars['String']>
    alternativeText?: InputMaybe<Scalars['String']>
    caption?: InputMaybe<Scalars['String']>
    width?: InputMaybe<Scalars['Int']>
    height?: InputMaybe<Scalars['Int']>
    formats?: InputMaybe<Scalars['JSON']>
    hash?: InputMaybe<Scalars['String']>
    ext?: InputMaybe<Scalars['String']>
    mime?: InputMaybe<Scalars['String']>
    size?: InputMaybe<Scalars['Float']>
    url?: InputMaybe<Scalars['String']>
    previewUrl?: InputMaybe<Scalars['String']>
    provider?: InputMaybe<Scalars['String']>
    provider_metadata?: InputMaybe<Scalars['JSON']>
  }

  export type UploadFile = {
    name: Scalars['String']
    alternativeText?: Maybe<Scalars['String']>
    caption?: Maybe<Scalars['String']>
    width?: Maybe<Scalars['Int']>
    height?: Maybe<Scalars['Int']>
    formats?: Maybe<Scalars['JSON']>
    hash: Scalars['String']
    ext?: Maybe<Scalars['String']>
    mime: Scalars['String']
    size: Scalars['Float']
    url: Scalars['String']
    previewUrl?: Maybe<Scalars['String']>
    provider: Scalars['String']
    provider_metadata?: Maybe<Scalars['JSON']>
    related?: Maybe<Array<Maybe<GenericMorph>>>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type UploadFileEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<UploadFile>
  }

  export type UploadFileEntityResponse = {
    data?: Maybe<UploadFileEntity>
  }

  export type UploadFileEntityResponseCollection = {
    data: Array<UploadFileEntity>
    meta: ResponseCollectionMeta
  }

  export type UploadFileRelationResponseCollection = {
    data: Array<UploadFileEntity>
  }

  export type SchedulerSchedulerFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    scheduledDatetime?: InputMaybe<DateTimeFilterInput>
    uid?: InputMaybe<StringFilterInput>
    contentId?: InputMaybe<LongFilterInput>
    scheduleType?: InputMaybe<StringFilterInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<SchedulerSchedulerFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<SchedulerSchedulerFiltersInput>>>
    not?: InputMaybe<SchedulerSchedulerFiltersInput>
  }

  export type SchedulerSchedulerInput = {
    scheduledDatetime?: InputMaybe<Scalars['DateTime']>
    uid?: InputMaybe<Scalars['String']>
    contentId?: InputMaybe<Scalars['Long']>
    scheduleType?: InputMaybe<Scalars['String']>
  }

  export type SchedulerScheduler = {
    scheduledDatetime?: Maybe<Scalars['DateTime']>
    uid?: Maybe<Scalars['String']>
    contentId?: Maybe<Scalars['Long']>
    scheduleType?: Maybe<Scalars['String']>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type SchedulerSchedulerEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<SchedulerScheduler>
  }

  export type SchedulerSchedulerEntityResponse = {
    data?: Maybe<SchedulerSchedulerEntity>
  }

  export type SchedulerSchedulerEntityResponseCollection = {
    data: Array<SchedulerSchedulerEntity>
    meta: ResponseCollectionMeta
  }

  export type I18NLocaleFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    name?: InputMaybe<StringFilterInput>
    code?: InputMaybe<StringFilterInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<I18NLocaleFiltersInput>>>
    not?: InputMaybe<I18NLocaleFiltersInput>
  }

  export type I18NLocale = {
    name?: Maybe<Scalars['String']>
    code?: Maybe<Scalars['String']>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type I18NLocaleEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<I18NLocale>
  }

  export type I18NLocaleEntityResponse = {
    data?: Maybe<I18NLocaleEntity>
  }

  export type I18NLocaleEntityResponseCollection = {
    data: Array<I18NLocaleEntity>
    meta: ResponseCollectionMeta
  }

  export type UsersPermissionsPermissionFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    action?: InputMaybe<StringFilterInput>
    role?: InputMaybe<UsersPermissionsRoleFiltersInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<UsersPermissionsPermissionFiltersInput>>>
    not?: InputMaybe<UsersPermissionsPermissionFiltersInput>
  }

  export type UsersPermissionsPermission = {
    action: Scalars['String']
    role?: Maybe<UsersPermissionsRoleEntityResponse>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type UsersPermissionsPermissionEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<UsersPermissionsPermission>
  }

  export type UsersPermissionsPermissionRelationResponseCollection = {
    data: Array<UsersPermissionsPermissionEntity>
  }

  export type UsersPermissionsRoleFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    name?: InputMaybe<StringFilterInput>
    description?: InputMaybe<StringFilterInput>
    type?: InputMaybe<StringFilterInput>
    permissions?: InputMaybe<UsersPermissionsPermissionFiltersInput>
    users?: InputMaybe<UsersPermissionsUserFiltersInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<UsersPermissionsRoleFiltersInput>>>
    not?: InputMaybe<UsersPermissionsRoleFiltersInput>
  }

  export type UsersPermissionsRoleInput = {
    name?: InputMaybe<Scalars['String']>
    description?: InputMaybe<Scalars['String']>
    type?: InputMaybe<Scalars['String']>
    permissions?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    users?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  }

  export type UsersPermissionsRole = {
    name: Scalars['String']
    description?: Maybe<Scalars['String']>
    type?: Maybe<Scalars['String']>
    permissions?: Maybe<UsersPermissionsPermissionRelationResponseCollection>
    users?: Maybe<UsersPermissionsUserRelationResponseCollection>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type UsersPermissionsRolepermissionsArgs = {
    filters?: InputMaybe<UsersPermissionsPermissionFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type UsersPermissionsRoleusersArgs = {
    filters?: InputMaybe<UsersPermissionsUserFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type UsersPermissionsRoleEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<UsersPermissionsRole>
  }

  export type UsersPermissionsRoleEntityResponse = {
    data?: Maybe<UsersPermissionsRoleEntity>
  }

  export type UsersPermissionsRoleEntityResponseCollection = {
    data: Array<UsersPermissionsRoleEntity>
    meta: ResponseCollectionMeta
  }

  export type UsersPermissionsUserFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    username?: InputMaybe<StringFilterInput>
    email?: InputMaybe<StringFilterInput>
    provider?: InputMaybe<StringFilterInput>
    password?: InputMaybe<StringFilterInput>
    resetPasswordToken?: InputMaybe<StringFilterInput>
    confirmationToken?: InputMaybe<StringFilterInput>
    confirmed?: InputMaybe<BooleanFilterInput>
    blocked?: InputMaybe<BooleanFilterInput>
    role?: InputMaybe<UsersPermissionsRoleFiltersInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<UsersPermissionsUserFiltersInput>>>
    not?: InputMaybe<UsersPermissionsUserFiltersInput>
  }

  export type UsersPermissionsUserInput = {
    username?: InputMaybe<Scalars['String']>
    email?: InputMaybe<Scalars['String']>
    provider?: InputMaybe<Scalars['String']>
    password?: InputMaybe<Scalars['String']>
    resetPasswordToken?: InputMaybe<Scalars['String']>
    confirmationToken?: InputMaybe<Scalars['String']>
    confirmed?: InputMaybe<Scalars['Boolean']>
    blocked?: InputMaybe<Scalars['Boolean']>
    role?: InputMaybe<Scalars['ID']>
  }

  export type UsersPermissionsUser = {
    username: Scalars['String']
    email: Scalars['String']
    provider?: Maybe<Scalars['String']>
    confirmed?: Maybe<Scalars['Boolean']>
    blocked?: Maybe<Scalars['Boolean']>
    role?: Maybe<UsersPermissionsRoleEntityResponse>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type UsersPermissionsUserEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<UsersPermissionsUser>
  }

  export type UsersPermissionsUserEntityResponse = {
    data?: Maybe<UsersPermissionsUserEntity>
  }

  export type UsersPermissionsUserEntityResponseCollection = {
    data: Array<UsersPermissionsUserEntity>
    meta: ResponseCollectionMeta
  }

  export type UsersPermissionsUserRelationResponseCollection = {
    data: Array<UsersPermissionsUserEntity>
  }

  export type AboutBlocksDynamicZone = ComponentSharedMedia | ComponentSharedRichText | ComponentSharedSlider | Error

  export type AboutInput = {
    title?: InputMaybe<Scalars['String']>
    blocks?: InputMaybe<Array<Scalars['AboutBlocksDynamicZoneInput']>>
  }

  export type About = {
    title?: Maybe<Scalars['String']>
    blocks?: Maybe<Array<Maybe<AboutBlocksDynamicZone>>>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type AboutEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<About>
  }

  export type AboutEntityResponse = {
    data?: Maybe<AboutEntity>
  }

  export type ArticleBlocksDynamicZone =
    | ComponentSharedDivider
    | ComponentSharedMedia
    | ComponentSharedRichText
    | ComponentSharedSlider
    | Error

  export type ArticleFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    title?: InputMaybe<StringFilterInput>
    description?: InputMaybe<StringFilterInput>
    slug?: InputMaybe<StringFilterInput>
    authors?: InputMaybe<AuthorFiltersInput>
    categories?: InputMaybe<CategoryFiltersInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    publishedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<ArticleFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<ArticleFiltersInput>>>
    not?: InputMaybe<ArticleFiltersInput>
  }

  export type ArticleInput = {
    title?: InputMaybe<Scalars['String']>
    description?: InputMaybe<Scalars['String']>
    slug?: InputMaybe<Scalars['String']>
    cover?: InputMaybe<Scalars['ID']>
    authors?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    categories?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
    blocks?: InputMaybe<Array<Scalars['ArticleBlocksDynamicZoneInput']>>
    publishedAt?: InputMaybe<Scalars['DateTime']>
  }

  export type Article = {
    title: Scalars['String']
    description: Scalars['String']
    slug: Scalars['String']
    cover: UploadFileEntityResponse
    authors?: Maybe<AuthorRelationResponseCollection>
    categories?: Maybe<CategoryRelationResponseCollection>
    blocks?: Maybe<Array<Maybe<ArticleBlocksDynamicZone>>>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
    publishedAt?: Maybe<Scalars['DateTime']>
  }

  export type ArticleauthorsArgs = {
    filters?: InputMaybe<AuthorFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type ArticlecategoriesArgs = {
    filters?: InputMaybe<CategoryFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type ArticleEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<Article>
  }

  export type ArticleEntityResponse = {
    data?: Maybe<ArticleEntity>
  }

  export type ArticleEntityResponseCollection = {
    data: Array<ArticleEntity>
    meta: ResponseCollectionMeta
  }

  export type ArticleRelationResponseCollection = {
    data: Array<ArticleEntity>
  }

  export type AuthorFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    name?: InputMaybe<StringFilterInput>
    email?: InputMaybe<StringFilterInput>
    handle?: InputMaybe<StringFilterInput>
    articles?: InputMaybe<ArticleFiltersInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<AuthorFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<AuthorFiltersInput>>>
    not?: InputMaybe<AuthorFiltersInput>
  }

  export type AuthorInput = {
    name?: InputMaybe<Scalars['String']>
    avatar?: InputMaybe<Scalars['ID']>
    email?: InputMaybe<Scalars['String']>
    handle?: InputMaybe<Scalars['String']>
    articles?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  }

  export type Author = {
    name: Scalars['String']
    avatar: UploadFileEntityResponse
    email: Scalars['String']
    handle: Scalars['String']
    articles?: Maybe<ArticleRelationResponseCollection>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type AuthorarticlesArgs = {
    filters?: InputMaybe<ArticleFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    publicationState?: InputMaybe<PublicationState>
  }

  export type AuthorEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<Author>
  }

  export type AuthorEntityResponse = {
    data?: Maybe<AuthorEntity>
  }

  export type AuthorEntityResponseCollection = {
    data: Array<AuthorEntity>
    meta: ResponseCollectionMeta
  }

  export type AuthorRelationResponseCollection = {
    data: Array<AuthorEntity>
  }

  export type CategoryFiltersInput = {
    id?: InputMaybe<IDFilterInput>
    name?: InputMaybe<StringFilterInput>
    slug?: InputMaybe<StringFilterInput>
    description?: InputMaybe<StringFilterInput>
    articles?: InputMaybe<ArticleFiltersInput>
    createdAt?: InputMaybe<DateTimeFilterInput>
    updatedAt?: InputMaybe<DateTimeFilterInput>
    and?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>
    or?: InputMaybe<Array<InputMaybe<CategoryFiltersInput>>>
    not?: InputMaybe<CategoryFiltersInput>
  }

  export type CategoryInput = {
    name?: InputMaybe<Scalars['String']>
    slug?: InputMaybe<Scalars['String']>
    description?: InputMaybe<Scalars['String']>
    articles?: InputMaybe<Array<InputMaybe<Scalars['ID']>>>
  }

  export type Category = {
    name: Scalars['String']
    slug: Scalars['String']
    description: Scalars['String']
    articles?: Maybe<ArticleRelationResponseCollection>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type CategoryarticlesArgs = {
    filters?: InputMaybe<ArticleFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    publicationState?: InputMaybe<PublicationState>
  }

  export type CategoryEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<Category>
  }

  export type CategoryEntityResponse = {
    data?: Maybe<CategoryEntity>
  }

  export type CategoryEntityResponseCollection = {
    data: Array<CategoryEntity>
    meta: ResponseCollectionMeta
  }

  export type CategoryRelationResponseCollection = {
    data: Array<CategoryEntity>
  }

  export type GlobalInput = {
    siteName?: InputMaybe<Scalars['String']>
    favicon?: InputMaybe<Scalars['ID']>
    siteDescription?: InputMaybe<Scalars['String']>
    defaultSeo?: InputMaybe<ComponentSharedSeoInput>
  }

  export type Global = {
    siteName: Scalars['String']
    favicon?: Maybe<UploadFileEntityResponse>
    siteDescription: Scalars['String']
    defaultSeo?: Maybe<ComponentSharedSeo>
    createdAt?: Maybe<Scalars['DateTime']>
    updatedAt?: Maybe<Scalars['DateTime']>
  }

  export type GlobalEntity = {
    id?: Maybe<Scalars['ID']>
    attributes?: Maybe<Global>
  }

  export type GlobalEntityResponse = {
    data?: Maybe<GlobalEntity>
  }

  export type GenericMorph =
    | ComponentSharedDivider
    | ComponentSharedMedia
    | ComponentSharedRichText
    | ComponentSharedSeo
    | ComponentSharedSlider
    | UploadFile
    | SchedulerScheduler
    | I18NLocale
    | UsersPermissionsPermission
    | UsersPermissionsRole
    | UsersPermissionsUser
    | About
    | Article
    | Author
    | Category
    | Global

  export type FileInfoInput = {
    name?: InputMaybe<Scalars['String']>
    alternativeText?: InputMaybe<Scalars['String']>
    caption?: InputMaybe<Scalars['String']>
  }

  export type UsersPermissionsMe = {
    id: Scalars['ID']
    username: Scalars['String']
    email?: Maybe<Scalars['String']>
    confirmed?: Maybe<Scalars['Boolean']>
    blocked?: Maybe<Scalars['Boolean']>
    role?: Maybe<UsersPermissionsMeRole>
  }

  export type UsersPermissionsMeRole = {
    id: Scalars['ID']
    name: Scalars['String']
    description?: Maybe<Scalars['String']>
    type?: Maybe<Scalars['String']>
  }

  export type UsersPermissionsRegisterInput = {
    username: Scalars['String']
    email: Scalars['String']
    password: Scalars['String']
  }

  export type UsersPermissionsLoginInput = {
    identifier: Scalars['String']
    password: Scalars['String']
    provider?: Scalars['String']
  }

  export type UsersPermissionsPasswordPayload = {
    ok: Scalars['Boolean']
  }

  export type UsersPermissionsLoginPayload = {
    jwt?: Maybe<Scalars['String']>
    user: UsersPermissionsMe
  }

  export type UsersPermissionsCreateRolePayload = {
    ok: Scalars['Boolean']
  }

  export type UsersPermissionsUpdateRolePayload = {
    ok: Scalars['Boolean']
  }

  export type UsersPermissionsDeleteRolePayload = {
    ok: Scalars['Boolean']
  }

  export type PaginationArg = {
    page?: InputMaybe<Scalars['Int']>
    pageSize?: InputMaybe<Scalars['Int']>
    start?: InputMaybe<Scalars['Int']>
    limit?: InputMaybe<Scalars['Int']>
  }

  export type Query = {
    uploadFile?: Maybe<UploadFileEntityResponse>
    uploadFiles?: Maybe<UploadFileEntityResponseCollection>
    schedulerScheduler?: Maybe<SchedulerSchedulerEntityResponseCollection>
    i18NLocale?: Maybe<I18NLocaleEntityResponse>
    i18NLocales?: Maybe<I18NLocaleEntityResponseCollection>
    usersPermissionsRole?: Maybe<UsersPermissionsRoleEntityResponse>
    usersPermissionsRoles?: Maybe<UsersPermissionsRoleEntityResponseCollection>
    usersPermissionsUser?: Maybe<UsersPermissionsUserEntityResponse>
    usersPermissionsUsers?: Maybe<UsersPermissionsUserEntityResponseCollection>
    about?: Maybe<AboutEntityResponse>
    article?: Maybe<ArticleEntityResponse>
    articles?: Maybe<ArticleEntityResponseCollection>
    author?: Maybe<AuthorEntityResponse>
    authors?: Maybe<AuthorEntityResponseCollection>
    category?: Maybe<CategoryEntityResponse>
    categories?: Maybe<CategoryEntityResponseCollection>
    global?: Maybe<GlobalEntityResponse>
    me?: Maybe<UsersPermissionsMe>
  }

  export type QueryuploadFileArgs = {
    id?: InputMaybe<Scalars['ID']>
  }

  export type QueryuploadFilesArgs = {
    filters?: InputMaybe<UploadFileFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type QueryschedulerSchedulerArgs = {
    filters?: InputMaybe<SchedulerSchedulerFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type Queryi18NLocaleArgs = {
    id?: InputMaybe<Scalars['ID']>
  }

  export type Queryi18NLocalesArgs = {
    filters?: InputMaybe<I18NLocaleFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type QueryusersPermissionsRoleArgs = {
    id?: InputMaybe<Scalars['ID']>
  }

  export type QueryusersPermissionsRolesArgs = {
    filters?: InputMaybe<UsersPermissionsRoleFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type QueryusersPermissionsUserArgs = {
    id?: InputMaybe<Scalars['ID']>
  }

  export type QueryusersPermissionsUsersArgs = {
    filters?: InputMaybe<UsersPermissionsUserFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type QueryarticleArgs = {
    id?: InputMaybe<Scalars['ID']>
  }

  export type QueryarticlesArgs = {
    filters?: InputMaybe<ArticleFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
    publicationState?: InputMaybe<PublicationState>
  }

  export type QueryauthorArgs = {
    id?: InputMaybe<Scalars['ID']>
  }

  export type QueryauthorsArgs = {
    filters?: InputMaybe<AuthorFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type QuerycategoryArgs = {
    id?: InputMaybe<Scalars['ID']>
  }

  export type QuerycategoriesArgs = {
    filters?: InputMaybe<CategoryFiltersInput>
    pagination?: InputMaybe<PaginationArg>
    sort?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  }

  export type Mutation = {
    createUploadFile?: Maybe<UploadFileEntityResponse>
    updateUploadFile?: Maybe<UploadFileEntityResponse>
    deleteUploadFile?: Maybe<UploadFileEntityResponse>
    createSchedulerScheduler?: Maybe<SchedulerSchedulerEntityResponse>
    updateSchedulerScheduler?: Maybe<SchedulerSchedulerEntityResponse>
    deleteSchedulerScheduler?: Maybe<SchedulerSchedulerEntityResponse>
    updateAbout?: Maybe<AboutEntityResponse>
    deleteAbout?: Maybe<AboutEntityResponse>
    createArticle?: Maybe<ArticleEntityResponse>
    updateArticle?: Maybe<ArticleEntityResponse>
    deleteArticle?: Maybe<ArticleEntityResponse>
    createAuthor?: Maybe<AuthorEntityResponse>
    updateAuthor?: Maybe<AuthorEntityResponse>
    deleteAuthor?: Maybe<AuthorEntityResponse>
    createCategory?: Maybe<CategoryEntityResponse>
    updateCategory?: Maybe<CategoryEntityResponse>
    deleteCategory?: Maybe<CategoryEntityResponse>
    updateGlobal?: Maybe<GlobalEntityResponse>
    deleteGlobal?: Maybe<GlobalEntityResponse>
    upload: UploadFileEntityResponse
    multipleUpload: Array<Maybe<UploadFileEntityResponse>>
    updateFileInfo: UploadFileEntityResponse
    removeFile?: Maybe<UploadFileEntityResponse>
    /** Create a new role */
    createUsersPermissionsRole?: Maybe<UsersPermissionsCreateRolePayload>
    /** Update an existing role */
    updateUsersPermissionsRole?: Maybe<UsersPermissionsUpdateRolePayload>
    /** Delete an existing role */
    deleteUsersPermissionsRole?: Maybe<UsersPermissionsDeleteRolePayload>
    /** Create a new user */
    createUsersPermissionsUser: UsersPermissionsUserEntityResponse
    /** Update an existing user */
    updateUsersPermissionsUser: UsersPermissionsUserEntityResponse
    /** Delete an existing user */
    deleteUsersPermissionsUser: UsersPermissionsUserEntityResponse
    login: UsersPermissionsLoginPayload
    /** Register a user */
    register: UsersPermissionsLoginPayload
    /** Request a reset password token */
    forgotPassword?: Maybe<UsersPermissionsPasswordPayload>
    /** Reset user password. Confirm with a code (resetToken from forgotPassword) */
    resetPassword?: Maybe<UsersPermissionsLoginPayload>
    /** Confirm an email users email address */
    emailConfirmation?: Maybe<UsersPermissionsLoginPayload>
  }

  export type MutationcreateUploadFileArgs = {
    data: UploadFileInput
  }

  export type MutationupdateUploadFileArgs = {
    id: Scalars['ID']
    data: UploadFileInput
  }

  export type MutationdeleteUploadFileArgs = {
    id: Scalars['ID']
  }

  export type MutationcreateSchedulerSchedulerArgs = {
    data: SchedulerSchedulerInput
  }

  export type MutationupdateSchedulerSchedulerArgs = {
    id: Scalars['ID']
    data: SchedulerSchedulerInput
  }

  export type MutationdeleteSchedulerSchedulerArgs = {
    id: Scalars['ID']
  }

  export type MutationupdateAboutArgs = {
    data: AboutInput
  }

  export type MutationcreateArticleArgs = {
    data: ArticleInput
  }

  export type MutationupdateArticleArgs = {
    id: Scalars['ID']
    data: ArticleInput
  }

  export type MutationdeleteArticleArgs = {
    id: Scalars['ID']
  }

  export type MutationcreateAuthorArgs = {
    data: AuthorInput
  }

  export type MutationupdateAuthorArgs = {
    id: Scalars['ID']
    data: AuthorInput
  }

  export type MutationdeleteAuthorArgs = {
    id: Scalars['ID']
  }

  export type MutationcreateCategoryArgs = {
    data: CategoryInput
  }

  export type MutationupdateCategoryArgs = {
    id: Scalars['ID']
    data: CategoryInput
  }

  export type MutationdeleteCategoryArgs = {
    id: Scalars['ID']
  }

  export type MutationupdateGlobalArgs = {
    data: GlobalInput
  }

  export type MutationuploadArgs = {
    refId?: InputMaybe<Scalars['ID']>
    ref?: InputMaybe<Scalars['String']>
    field?: InputMaybe<Scalars['String']>
    info?: InputMaybe<FileInfoInput>
    file: Scalars['Upload']
  }

  export type MutationmultipleUploadArgs = {
    refId?: InputMaybe<Scalars['ID']>
    ref?: InputMaybe<Scalars['String']>
    field?: InputMaybe<Scalars['String']>
    files: Array<InputMaybe<Scalars['Upload']>>
  }

  export type MutationupdateFileInfoArgs = {
    id: Scalars['ID']
    info?: InputMaybe<FileInfoInput>
  }

  export type MutationremoveFileArgs = {
    id: Scalars['ID']
  }

  export type MutationcreateUsersPermissionsRoleArgs = {
    data: UsersPermissionsRoleInput
  }

  export type MutationupdateUsersPermissionsRoleArgs = {
    id: Scalars['ID']
    data: UsersPermissionsRoleInput
  }

  export type MutationdeleteUsersPermissionsRoleArgs = {
    id: Scalars['ID']
  }

  export type MutationcreateUsersPermissionsUserArgs = {
    data: UsersPermissionsUserInput
  }

  export type MutationupdateUsersPermissionsUserArgs = {
    id: Scalars['ID']
    data: UsersPermissionsUserInput
  }

  export type MutationdeleteUsersPermissionsUserArgs = {
    id: Scalars['ID']
  }

  export type MutationloginArgs = {
    input: UsersPermissionsLoginInput
  }

  export type MutationregisterArgs = {
    input: UsersPermissionsRegisterInput
  }

  export type MutationforgotPasswordArgs = {
    email: Scalars['String']
  }

  export type MutationresetPasswordArgs = {
    password: Scalars['String']
    passwordConfirmation: Scalars['String']
    code: Scalars['String']
  }

  export type MutationemailConfirmationArgs = {
    confirmation: Scalars['String']
  }
}
export type QueryCmsSdk = {
  /** null **/
  uploadFile: InContextSdkMethod<CmsTypes.Query['uploadFile'], CmsTypes.QueryuploadFileArgs, MeshContext>
  /** null **/
  uploadFiles: InContextSdkMethod<CmsTypes.Query['uploadFiles'], CmsTypes.QueryuploadFilesArgs, MeshContext>
  /** null **/
  schedulerScheduler: InContextSdkMethod<
    CmsTypes.Query['schedulerScheduler'],
    CmsTypes.QueryschedulerSchedulerArgs,
    MeshContext
  >
  /** null **/
  i18NLocale: InContextSdkMethod<CmsTypes.Query['i18NLocale'], CmsTypes.Queryi18NLocaleArgs, MeshContext>
  /** null **/
  i18NLocales: InContextSdkMethod<CmsTypes.Query['i18NLocales'], CmsTypes.Queryi18NLocalesArgs, MeshContext>
  /** null **/
  usersPermissionsRole: InContextSdkMethod<
    CmsTypes.Query['usersPermissionsRole'],
    CmsTypes.QueryusersPermissionsRoleArgs,
    MeshContext
  >
  /** null **/
  usersPermissionsRoles: InContextSdkMethod<
    CmsTypes.Query['usersPermissionsRoles'],
    CmsTypes.QueryusersPermissionsRolesArgs,
    MeshContext
  >
  /** null **/
  usersPermissionsUser: InContextSdkMethod<
    CmsTypes.Query['usersPermissionsUser'],
    CmsTypes.QueryusersPermissionsUserArgs,
    MeshContext
  >
  /** null **/
  usersPermissionsUsers: InContextSdkMethod<
    CmsTypes.Query['usersPermissionsUsers'],
    CmsTypes.QueryusersPermissionsUsersArgs,
    MeshContext
  >
  /** null **/
  about: InContextSdkMethod<CmsTypes.Query['about'], {}, MeshContext>
  /** null **/
  article: InContextSdkMethod<CmsTypes.Query['article'], CmsTypes.QueryarticleArgs, MeshContext>
  /** null **/
  articles: InContextSdkMethod<CmsTypes.Query['articles'], CmsTypes.QueryarticlesArgs, MeshContext>
  /** null **/
  author: InContextSdkMethod<CmsTypes.Query['author'], CmsTypes.QueryauthorArgs, MeshContext>
  /** null **/
  authors: InContextSdkMethod<CmsTypes.Query['authors'], CmsTypes.QueryauthorsArgs, MeshContext>
  /** null **/
  category: InContextSdkMethod<CmsTypes.Query['category'], CmsTypes.QuerycategoryArgs, MeshContext>
  /** null **/
  categories: InContextSdkMethod<CmsTypes.Query['categories'], CmsTypes.QuerycategoriesArgs, MeshContext>
  /** null **/
  global: InContextSdkMethod<CmsTypes.Query['global'], {}, MeshContext>
  /** null **/
  me: InContextSdkMethod<CmsTypes.Query['me'], {}, MeshContext>
}

export type MutationCmsSdk = {
  /** null **/
  createUploadFile: InContextSdkMethod<
    CmsTypes.Mutation['createUploadFile'],
    CmsTypes.MutationcreateUploadFileArgs,
    MeshContext
  >
  /** null **/
  updateUploadFile: InContextSdkMethod<
    CmsTypes.Mutation['updateUploadFile'],
    CmsTypes.MutationupdateUploadFileArgs,
    MeshContext
  >
  /** null **/
  deleteUploadFile: InContextSdkMethod<
    CmsTypes.Mutation['deleteUploadFile'],
    CmsTypes.MutationdeleteUploadFileArgs,
    MeshContext
  >
  /** null **/
  createSchedulerScheduler: InContextSdkMethod<
    CmsTypes.Mutation['createSchedulerScheduler'],
    CmsTypes.MutationcreateSchedulerSchedulerArgs,
    MeshContext
  >
  /** null **/
  updateSchedulerScheduler: InContextSdkMethod<
    CmsTypes.Mutation['updateSchedulerScheduler'],
    CmsTypes.MutationupdateSchedulerSchedulerArgs,
    MeshContext
  >
  /** null **/
  deleteSchedulerScheduler: InContextSdkMethod<
    CmsTypes.Mutation['deleteSchedulerScheduler'],
    CmsTypes.MutationdeleteSchedulerSchedulerArgs,
    MeshContext
  >
  /** null **/
  updateAbout: InContextSdkMethod<CmsTypes.Mutation['updateAbout'], CmsTypes.MutationupdateAboutArgs, MeshContext>
  /** null **/
  deleteAbout: InContextSdkMethod<CmsTypes.Mutation['deleteAbout'], {}, MeshContext>
  /** null **/
  createArticle: InContextSdkMethod<CmsTypes.Mutation['createArticle'], CmsTypes.MutationcreateArticleArgs, MeshContext>
  /** null **/
  updateArticle: InContextSdkMethod<CmsTypes.Mutation['updateArticle'], CmsTypes.MutationupdateArticleArgs, MeshContext>
  /** null **/
  deleteArticle: InContextSdkMethod<CmsTypes.Mutation['deleteArticle'], CmsTypes.MutationdeleteArticleArgs, MeshContext>
  /** null **/
  createAuthor: InContextSdkMethod<CmsTypes.Mutation['createAuthor'], CmsTypes.MutationcreateAuthorArgs, MeshContext>
  /** null **/
  updateAuthor: InContextSdkMethod<CmsTypes.Mutation['updateAuthor'], CmsTypes.MutationupdateAuthorArgs, MeshContext>
  /** null **/
  deleteAuthor: InContextSdkMethod<CmsTypes.Mutation['deleteAuthor'], CmsTypes.MutationdeleteAuthorArgs, MeshContext>
  /** null **/
  createCategory: InContextSdkMethod<
    CmsTypes.Mutation['createCategory'],
    CmsTypes.MutationcreateCategoryArgs,
    MeshContext
  >
  /** null **/
  updateCategory: InContextSdkMethod<
    CmsTypes.Mutation['updateCategory'],
    CmsTypes.MutationupdateCategoryArgs,
    MeshContext
  >
  /** null **/
  deleteCategory: InContextSdkMethod<
    CmsTypes.Mutation['deleteCategory'],
    CmsTypes.MutationdeleteCategoryArgs,
    MeshContext
  >
  /** null **/
  updateGlobal: InContextSdkMethod<CmsTypes.Mutation['updateGlobal'], CmsTypes.MutationupdateGlobalArgs, MeshContext>
  /** null **/
  deleteGlobal: InContextSdkMethod<CmsTypes.Mutation['deleteGlobal'], {}, MeshContext>
  /** null **/
  upload: InContextSdkMethod<CmsTypes.Mutation['upload'], CmsTypes.MutationuploadArgs, MeshContext>
  /** null **/
  multipleUpload: InContextSdkMethod<
    CmsTypes.Mutation['multipleUpload'],
    CmsTypes.MutationmultipleUploadArgs,
    MeshContext
  >
  /** null **/
  updateFileInfo: InContextSdkMethod<
    CmsTypes.Mutation['updateFileInfo'],
    CmsTypes.MutationupdateFileInfoArgs,
    MeshContext
  >
  /** null **/
  removeFile: InContextSdkMethod<CmsTypes.Mutation['removeFile'], CmsTypes.MutationremoveFileArgs, MeshContext>
  /** Create a new role **/
  createUsersPermissionsRole: InContextSdkMethod<
    CmsTypes.Mutation['createUsersPermissionsRole'],
    CmsTypes.MutationcreateUsersPermissionsRoleArgs,
    MeshContext
  >
  /** Update an existing role **/
  updateUsersPermissionsRole: InContextSdkMethod<
    CmsTypes.Mutation['updateUsersPermissionsRole'],
    CmsTypes.MutationupdateUsersPermissionsRoleArgs,
    MeshContext
  >
  /** Delete an existing role **/
  deleteUsersPermissionsRole: InContextSdkMethod<
    CmsTypes.Mutation['deleteUsersPermissionsRole'],
    CmsTypes.MutationdeleteUsersPermissionsRoleArgs,
    MeshContext
  >
  /** Create a new user **/
  createUsersPermissionsUser: InContextSdkMethod<
    CmsTypes.Mutation['createUsersPermissionsUser'],
    CmsTypes.MutationcreateUsersPermissionsUserArgs,
    MeshContext
  >
  /** Update an existing user **/
  updateUsersPermissionsUser: InContextSdkMethod<
    CmsTypes.Mutation['updateUsersPermissionsUser'],
    CmsTypes.MutationupdateUsersPermissionsUserArgs,
    MeshContext
  >
  /** Delete an existing user **/
  deleteUsersPermissionsUser: InContextSdkMethod<
    CmsTypes.Mutation['deleteUsersPermissionsUser'],
    CmsTypes.MutationdeleteUsersPermissionsUserArgs,
    MeshContext
  >
  /** null **/
  login: InContextSdkMethod<CmsTypes.Mutation['login'], CmsTypes.MutationloginArgs, MeshContext>
  /** Register a user **/
  register: InContextSdkMethod<CmsTypes.Mutation['register'], CmsTypes.MutationregisterArgs, MeshContext>
  /** Request a reset password token **/
  forgotPassword: InContextSdkMethod<
    CmsTypes.Mutation['forgotPassword'],
    CmsTypes.MutationforgotPasswordArgs,
    MeshContext
  >
  /** Reset user password. Confirm with a code (resetToken from forgotPassword) **/
  resetPassword: InContextSdkMethod<CmsTypes.Mutation['resetPassword'], CmsTypes.MutationresetPasswordArgs, MeshContext>
  /** Confirm an email users email address **/
  emailConfirmation: InContextSdkMethod<
    CmsTypes.Mutation['emailConfirmation'],
    CmsTypes.MutationemailConfirmationArgs,
    MeshContext
  >
}

export type SubscriptionCmsSdk = {}

export type CmsContext = {
  ['CMS']: { Query: QueryCmsSdk; Mutation: MutationCmsSdk; Subscription: SubscriptionCmsSdk }
}

export type MeshContext = CmsContext & BaseMeshContext

import { getMesh, ExecuteMeshFn, SubscribeMeshFn } from '@graphql-mesh/runtime'
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store'
import { path as pathModule } from '@graphql-mesh/cross-helpers'

const baseDir = pathModule.join(typeof __dirname === 'string' ? __dirname : '/', '..')

const importFn = (moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId)
    .split('\\')
    .join('/')
    .replace(baseDir + '/', '')
  switch (relativeModuleId) {
    case '.mesh/sources/CMS/introspectionSchema':
      return import('./sources/CMS/introspectionSchema')

    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`))
  }
}

const rootStore = new MeshStore(
  '.mesh',
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: 'ts',
  }),
  {
    readonly: true,
    validate: false,
  }
)

import type { GetMeshOptions } from '@graphql-mesh/runtime'
import type { YamlConfig } from '@graphql-mesh/types'
import { PubSub } from '@graphql-mesh/utils'
import MeshCache from '@graphql-mesh/cache-localforage'
import { DefaultLogger } from '@graphql-mesh/utils'
import GraphqlHandler from '@graphql-mesh/graphql'
import BareMerger from '@graphql-mesh/merger-bare'
import { printWithCache } from '@graphql-mesh/utils'
export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
  const pubsub = new PubSub()
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child('cache'),
    pubsub,
  } as any)
  const sourcesStore = rootStore.child('sources')
  const logger = new DefaultLogger('🕸️  Mesh')
  const sources = []
  const transforms = []
  const additionalEnvelopPlugins = []
  const cmsTransforms = []
  const additionalTypeDefs = [] as any[]
  const cmsHandler = new GraphqlHandler({
    name: 'CMS',
    config: { endpoint: 'https://sushi-strapi-cms.herokuapp.com/graphql' },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child('CMS'),
    logger: logger.child('CMS'),
    importFn,
  })
  sources.push({
    name: 'CMS',
    handler: cmsHandler,
    transforms: cmsTransforms,
  })
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child('bareMerger'),
    store: rootStore.child('bareMerger'),
  })
  const additionalResolvers = [] as any[]

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
        {
          document: ArticleAndMoreArticlesDocument,
          get rawSDL() {
            return printWithCache(ArticleAndMoreArticlesDocument)
          },
          location: 'ArticleAndMoreArticlesDocument.graphql',
        },
        {
          document: GetAllArticlesWithSlugDocument,
          get rawSDL() {
            return printWithCache(GetAllArticlesWithSlugDocument)
          },
          location: 'GetAllArticlesWithSlugDocument.graphql',
        },
        {
          document: GetGlobalPageDocument,
          get rawSDL() {
            return printWithCache(GetGlobalPageDocument)
          },
          location: 'GetGlobalPageDocument.graphql',
        },
        {
          document: GetPreviewPostBySlugDocument,
          get rawSDL() {
            return printWithCache(GetPreviewPostBySlugDocument)
          },
          location: 'GetPreviewPostBySlugDocument.graphql',
        },
        {
          document: GetArticlesDocument,
          get rawSDL() {
            return printWithCache(GetArticlesDocument)
          },
          location: 'GetArticlesDocument.graphql',
        },
        {
          document: GetCategoriesDocument,
          get rawSDL() {
            return printWithCache(GetCategoriesDocument)
          },
          location: 'GetCategoriesDocument.graphql',
        },
      ]
    },
  }
}

let meshInstance$: Promise<MeshInstance<MeshContext>>

export function getBuiltMesh(): Promise<MeshInstance<MeshContext>> {
  if (meshInstance$ == null) {
    meshInstance$ = getMeshOptions()
      .then((meshOptions) => getMesh<MeshContext>(meshOptions))
      .then((mesh) => {
        const id$ = mesh.pubsub.subscribe('destroy', () => {
          meshInstance$ = undefined
          id$.then((id) => mesh.pubsub.unsubscribe(id)).catch((err) => console.error(err))
        })
        return mesh
      })
  }
  return meshInstance$
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args))

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args))
export function getMeshSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltMesh().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext))
  return getSdk<TOperationContext>((...args) => sdkRequester$.then((sdkRequester) => sdkRequester(...args)))
}
export type articleAndMoreArticlesQueryVariables = Exact<{
  filters?: InputMaybe<ArticleFiltersInput>
  filters_ne?: InputMaybe<ArticleFiltersInput>
  publicationState?: InputMaybe<PublicationState>
}>

export type articleAndMoreArticlesQuery = {
  articles?: Maybe<{
    data: Array<{
      attributes?: Maybe<
        Pick<Article, 'title' | 'description' | 'slug' | 'publishedAt'> & {
          categories?: Maybe<{
            data: Array<
              Pick<CategoryEntity, 'id'> & { attributes?: Maybe<Pick<Category, 'description' | 'name' | 'slug'>> }
            >
          }>
          cover: {
            data?: Maybe<{
              attributes?: Maybe<
                Pick<
                  UploadFile,
                  'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                >
              >
            }>
          }
          authors?: Maybe<{
            data: Array<{
              attributes?: Maybe<
                Pick<Author, 'name' | 'email' | 'handle'> & {
                  avatar: {
                    data?: Maybe<{
                      attributes?: Maybe<
                        Pick<
                          UploadFile,
                          'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                        >
                      >
                    }>
                  }
                }
              >
            }>
          }>
          blocks?: Maybe<
            Array<
              Maybe<
                | ({ __typename: 'ComponentSharedDivider' } & Pick<ComponentSharedDivider, 'id'>)
                | ({ __typename: 'ComponentSharedMedia' } & Pick<ComponentSharedMedia, 'caption'> & {
                      file?: Maybe<{
                        data?: Maybe<{
                          attributes?: Maybe<
                            Pick<
                              UploadFile,
                              'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                            >
                          >
                        }>
                      }>
                    })
                | ({ __typename: 'ComponentSharedRichText' } & Pick<ComponentSharedRichText, 'body'>)
                | ({ __typename: 'ComponentSharedSlider' } & {
                    files?: Maybe<{
                      data: Array<{
                        attributes?: Maybe<
                          Pick<
                            UploadFile,
                            'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                          >
                        >
                      }>
                    }>
                  })
                | { __typename: 'Error' }
              >
            >
          >
        }
      >
    }>
  }>
  moreArticles?: Maybe<{
    data: Array<
      Pick<ArticleEntity, 'id'> & {
        attributes?: Maybe<
          Pick<Article, 'title' | 'description' | 'slug' | 'publishedAt'> & {
            categories?: Maybe<{
              data: Array<
                Pick<CategoryEntity, 'id'> & { attributes?: Maybe<Pick<Category, 'description' | 'name' | 'slug'>> }
              >
            }>
            cover: {
              data?: Maybe<
                Pick<UploadFileEntity, 'id'> & {
                  attributes?: Maybe<
                    Pick<
                      UploadFile,
                      'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                    >
                  >
                }
              >
            }
            authors?: Maybe<{
              data: Array<
                Pick<AuthorEntity, 'id'> & {
                  attributes?: Maybe<
                    Pick<Author, 'name' | 'email' | 'handle'> & {
                      avatar: {
                        data?: Maybe<
                          Pick<UploadFileEntity, 'id'> & {
                            attributes?: Maybe<
                              Pick<
                                UploadFile,
                                | 'alternativeText'
                                | 'height'
                                | 'width'
                                | 'caption'
                                | 'name'
                                | 'url'
                                | 'provider_metadata'
                              >
                            >
                          }
                        >
                      }
                    }
                  >
                }
              >
            }>
          }
        >
      }
    >
  }>
}

export type getAllArticlesWithSlugQueryVariables = Exact<{ [key: string]: never }>

export type getAllArticlesWithSlugQuery = {
  articles?: Maybe<{ data: Array<Pick<ArticleEntity, 'id'> & { attributes?: Maybe<Pick<Article, 'slug'>> }> }>
}

export type getGlobalPageQueryVariables = Exact<{ [key: string]: never }>

export type getGlobalPageQuery = {
  global?: Maybe<{
    data?: Maybe<
      Pick<GlobalEntity, 'id'> & {
        attributes?: Maybe<
          Pick<Global, 'siteName' | 'siteDescription'> & {
            favicon?: Maybe<{
              data?: Maybe<
                Pick<UploadFileEntity, 'id'> & {
                  attributes?: Maybe<
                    Pick<
                      UploadFile,
                      'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                    >
                  >
                }
              >
            }>
            defaultSeo?: Maybe<
              Pick<ComponentSharedSeo, 'metaDescription' | 'metaTitle'> & {
                shareImage?: Maybe<{
                  data?: Maybe<
                    Pick<UploadFileEntity, 'id'> & {
                      attributes?: Maybe<
                        Pick<
                          UploadFile,
                          'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                        >
                      >
                    }
                  >
                }>
              }
            >
          }
        >
      }
    >
  }>
}

export type getPreviewPostBySlugQueryVariables = Exact<{
  slug?: InputMaybe<Scalars['String']>
}>

export type getPreviewPostBySlugQuery = {
  articles?: Maybe<{ data: Array<Pick<ArticleEntity, 'id'> & { attributes?: Maybe<Pick<Article, 'slug'>> }> }>
}

export type getArticlesQueryVariables = Exact<{
  filters?: InputMaybe<ArticleFiltersInput>
  pagination?: InputMaybe<PaginationArg>
}>

export type getArticlesQuery = {
  articles?: Maybe<{
    meta: { pagination: Pick<Pagination, 'page' | 'pageCount' | 'pageSize'> }
    data: Array<
      Pick<ArticleEntity, 'id'> & {
        attributes?: Maybe<
          Pick<Article, 'title' | 'description' | 'slug' | 'publishedAt'> & {
            categories?: Maybe<{
              data: Array<
                Pick<CategoryEntity, 'id'> & { attributes?: Maybe<Pick<Category, 'description' | 'name' | 'slug'>> }
              >
            }>
            cover: {
              data?: Maybe<
                Pick<UploadFileEntity, 'id'> & {
                  attributes?: Maybe<
                    Pick<
                      UploadFile,
                      'alternativeText' | 'height' | 'width' | 'caption' | 'name' | 'url' | 'provider_metadata'
                    >
                  >
                }
              >
            }
            authors?: Maybe<{
              data: Array<
                Pick<AuthorEntity, 'id'> & {
                  attributes?: Maybe<
                    Pick<Author, 'name' | 'email' | 'handle'> & {
                      avatar: {
                        data?: Maybe<
                          Pick<UploadFileEntity, 'id'> & {
                            attributes?: Maybe<
                              Pick<
                                UploadFile,
                                | 'alternativeText'
                                | 'height'
                                | 'width'
                                | 'caption'
                                | 'name'
                                | 'url'
                                | 'provider_metadata'
                              >
                            >
                          }
                        >
                      }
                    }
                  >
                }
              >
            }>
            blocks?: Maybe<
              Array<
                Maybe<
                  | ({ __typename: 'ComponentSharedDivider' } & Pick<ComponentSharedDivider, 'id'>)
                  | ({ __typename: 'ComponentSharedMedia' } & Pick<ComponentSharedMedia, 'caption'> & {
                        file?: Maybe<{
                          data?: Maybe<
                            Pick<UploadFileEntity, 'id'> & {
                              attributes?: Maybe<
                                Pick<
                                  UploadFile,
                                  | 'alternativeText'
                                  | 'height'
                                  | 'width'
                                  | 'caption'
                                  | 'name'
                                  | 'url'
                                  | 'provider_metadata'
                                >
                              >
                            }
                          >
                        }>
                      })
                  | ({ __typename: 'ComponentSharedRichText' } & Pick<ComponentSharedRichText, 'body'>)
                  | ({ __typename: 'ComponentSharedSlider' } & {
                      files?: Maybe<{
                        data: Array<
                          Pick<UploadFileEntity, 'id'> & {
                            attributes?: Maybe<
                              Pick<
                                UploadFile,
                                | 'alternativeText'
                                | 'height'
                                | 'width'
                                | 'caption'
                                | 'name'
                                | 'url'
                                | 'provider_metadata'
                              >
                            >
                          }
                        >
                      }>
                    })
                  | { __typename: 'Error' }
                >
              >
            >
          }
        >
      }
    >
  }>
}

export type getCategoriesQueryVariables = Exact<{
  filters?: InputMaybe<CategoryFiltersInput>
}>

export type getCategoriesQuery = {
  categories?: Maybe<{
    data: Array<Pick<CategoryEntity, 'id'> & { attributes?: Maybe<Pick<Category, 'description' | 'name' | 'slug'>> }>
  }>
}

export const articleAndMoreArticlesDocument = gql`
  query articleAndMoreArticles(
    $filters: ArticleFiltersInput
    $filters_ne: ArticleFiltersInput
    $publicationState: PublicationState
  ) {
    articles(filters: $filters, publicationState: $publicationState) {
      data {
        attributes {
          title
          description
          slug
          publishedAt
          categories {
            data {
              id
              attributes {
                description
                name
                slug
              }
            }
          }
          cover {
            data {
              attributes {
                alternativeText
                height
                width
                caption
                name
                url
                provider_metadata
              }
            }
          }
          authors {
            data {
              attributes {
                avatar {
                  data {
                    attributes {
                      alternativeText
                      height
                      width
                      caption
                      name
                      url
                      provider_metadata
                    }
                  }
                }
                name
                email
                handle
              }
            }
          }
          blocks {
            __typename
            ... on ComponentSharedDivider {
              id
            }
            ... on ComponentSharedMedia {
              caption
              file {
                data {
                  attributes {
                    alternativeText
                    height
                    width
                    caption
                    name
                    url
                    provider_metadata
                  }
                }
              }
            }
            ... on ComponentSharedRichText {
              body
            }
            ... on ComponentSharedSlider {
              files {
                data {
                  attributes {
                    alternativeText
                    height
                    width
                    caption
                    name
                    url
                    provider_metadata
                  }
                }
              }
            }
          }
        }
      }
    }
    moreArticles: articles(
      sort: "publishedAt:desc"
      pagination: { limit: 2 }
      filters: $filters_ne
      publicationState: $publicationState
    ) {
      data {
        id
        attributes {
          title
          description
          slug
          publishedAt
          categories {
            data {
              id
              attributes {
                description
                name
                slug
              }
            }
          }
          cover {
            data {
              id
              attributes {
                alternativeText
                height
                width
                caption
                name
                url
                provider_metadata
              }
            }
          }
          authors {
            data {
              id
              attributes {
                avatar {
                  data {
                    id
                    attributes {
                      alternativeText
                      height
                      width
                      caption
                      name
                      url
                      provider_metadata
                    }
                  }
                }
                name
                email
                handle
              }
            }
          }
        }
      }
    }
  }
` as unknown as DocumentNode<articleAndMoreArticlesQuery, articleAndMoreArticlesQueryVariables>
export const getAllArticlesWithSlugDocument = gql`
  query getAllArticlesWithSlug {
    articles {
      data {
        id
        attributes {
          slug
        }
      }
    }
  }
` as unknown as DocumentNode<getAllArticlesWithSlugQuery, getAllArticlesWithSlugQueryVariables>
export const getGlobalPageDocument = gql`
  query getGlobalPage {
    global {
      data {
        id
        attributes {
          siteName
          siteDescription
          favicon {
            data {
              id
              attributes {
                alternativeText
                height
                width
                caption
                name
                url
                provider_metadata
              }
            }
          }
          siteDescription
          defaultSeo {
            metaDescription
            metaTitle
            shareImage {
              data {
                id
                attributes {
                  alternativeText
                  height
                  width
                  caption
                  name
                  url
                  provider_metadata
                }
              }
            }
          }
        }
      }
    }
  }
` as unknown as DocumentNode<getGlobalPageQuery, getGlobalPageQueryVariables>
export const getPreviewPostBySlugDocument = gql`
  query getPreviewPostBySlug($slug: String) {
    articles(filters: { slug: { eq: $slug } }, publicationState: PREVIEW) {
      data {
        id
        attributes {
          slug
        }
      }
    }
  }
` as unknown as DocumentNode<getPreviewPostBySlugQuery, getPreviewPostBySlugQueryVariables>
export const getArticlesDocument = gql`
  query getArticles($filters: ArticleFiltersInput, $pagination: PaginationArg) {
    articles(pagination: $pagination, sort: "publishedAt:desc", filters: $filters) {
      meta {
        pagination {
          page
          pageCount
          pageSize
        }
      }
      data {
        id
        attributes {
          title
          description
          slug
          publishedAt
          categories {
            data {
              id
              attributes {
                description
                name
                slug
              }
            }
          }
          cover {
            data {
              id
              attributes {
                alternativeText
                height
                width
                caption
                name
                url
                provider_metadata
              }
            }
          }
          authors {
            data {
              id
              attributes {
                avatar {
                  data {
                    id
                    attributes {
                      alternativeText
                      height
                      width
                      caption
                      name
                      url
                      provider_metadata
                    }
                  }
                }
                name
                email
                handle
              }
            }
          }
          blocks {
            __typename
            ... on ComponentSharedDivider {
              id
            }
            ... on ComponentSharedMedia {
              caption
              file {
                data {
                  id
                  attributes {
                    alternativeText
                    height
                    width
                    caption
                    name
                    url
                    provider_metadata
                  }
                }
              }
            }
            ... on ComponentSharedRichText {
              body
            }
            ... on ComponentSharedSlider {
              files {
                data {
                  id
                  attributes {
                    alternativeText
                    height
                    width
                    caption
                    name
                    url
                    provider_metadata
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as unknown as DocumentNode<getArticlesQuery, getArticlesQueryVariables>
export const getCategoriesDocument = gql`
  query getCategories($filters: CategoryFiltersInput) {
    categories(filters: $filters) {
      data {
        id
        attributes {
          description
          name
          slug
        }
      }
    }
  }
` as unknown as DocumentNode<getCategoriesQuery, getCategoriesQueryVariables>

export type Requester<C = {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    articleAndMoreArticles(
      variables?: articleAndMoreArticlesQueryVariables,
      options?: C
    ): Promise<articleAndMoreArticlesQuery> {
      return requester<articleAndMoreArticlesQuery, articleAndMoreArticlesQueryVariables>(
        articleAndMoreArticlesDocument,
        variables,
        options
      )
    },
    getAllArticlesWithSlug(
      variables?: getAllArticlesWithSlugQueryVariables,
      options?: C
    ): Promise<getAllArticlesWithSlugQuery> {
      return requester<getAllArticlesWithSlugQuery, getAllArticlesWithSlugQueryVariables>(
        getAllArticlesWithSlugDocument,
        variables,
        options
      )
    },
    getGlobalPage(variables?: getGlobalPageQueryVariables, options?: C): Promise<getGlobalPageQuery> {
      return requester<getGlobalPageQuery, getGlobalPageQueryVariables>(getGlobalPageDocument, variables, options)
    },
    getPreviewPostBySlug(
      variables?: getPreviewPostBySlugQueryVariables,
      options?: C
    ): Promise<getPreviewPostBySlugQuery> {
      return requester<getPreviewPostBySlugQuery, getPreviewPostBySlugQueryVariables>(
        getPreviewPostBySlugDocument,
        variables,
        options
      )
    },
    getArticles(variables?: getArticlesQueryVariables, options?: C): Promise<getArticlesQuery> {
      return requester<getArticlesQuery, getArticlesQueryVariables>(getArticlesDocument, variables, options)
    },
    getCategories(variables?: getCategoriesQueryVariables, options?: C): Promise<getCategoriesQuery> {
      return requester<getCategoriesQuery, getCategoriesQueryVariables>(getCategoriesDocument, variables, options)
    },
  }
}
export type Sdk = ReturnType<typeof getSdk>
