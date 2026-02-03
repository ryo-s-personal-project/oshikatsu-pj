/**
 * バリデーションスキーマ（Zod）
 * バックエンドの Bean Validation と整合するルールを定義
 */

import { z } from 'zod';

/** ログインフォーム用スキーマ（LoginRequest に対応） */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'ユーザー名を入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/** 会員登録フォーム用スキーマ（RegisterRequest に対応：ユーザー名3〜50文字、メール形式、パスワード必須） */
export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'ユーザー名は3文字以上で入力してください')
    .max(50, 'ユーザー名は50文字以内で入力してください'),
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

/** 推しグループ作成・編集用スキーマ（CreateOshiGroupRequest / UpdateOshiGroupRequest に対応） */
export const oshiGroupFormSchema = z.object({
  groupName: z
    .string()
    .min(1, 'グループ名を入力してください'),
  company: z.string().optional(),
  description: z
    .string()
    .max(1000, '説明は1000文字以内で入力してください')
    .optional()
    .or(z.literal('')),
});

export type OshiGroupFormValues = z.infer<typeof oshiGroupFormSchema>;

/**
 * 検索条件：全文一致 / あいまい は排他（どちらか一方のみ true）
 */
export const searchModeSchema = z.object({
  full: z.boolean(),
  fuzzy: z.boolean(),
}).refine(
  (data) => (data.full && !data.fuzzy) || (!data.full && data.fuzzy),
  { message: '全文一致かあいまい検索のどちらかを選択してください' }
);

export type SearchModeValues = z.infer<typeof searchModeSchema>;
