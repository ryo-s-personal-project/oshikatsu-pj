/**
 * API関連の型定義
 * バックエンドのDTOと対応するフロントエンド型
 */

/** ログインリクエスト（AuthController#login と対応） */
export interface LoginRequest {
  username: string;
  password: string;
}

/** 会員登録リクエスト（RegisterRequest と対応） */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/** 認証レスポンス（AuthResponse と対応） */
export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
}

/** 推しグループ作成リクエスト（CreateOshiGroupRequest と対応） */
export interface CreateOshiGroupRequest {
  groupName: string;
  company?: string;
  description?: string;
}

/** 推しグループ更新リクエスト（UpdateOshiGroupRequest と対応） */
export interface UpdateOshiGroupRequest {
  groupId: number;
  groupName: string;
  company?: string;
  description?: string;
}

/** 推しグループレスポンス（OshiGroupResponse と対応） */
export interface OshiGroupResponse {
  id: number;
  userId: number;
  groupName: string;
  company: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * バックエンド GlobalExceptionHandler が返すエラーレスポンス形式
 * - バリデーションエラー: { status, message, errors: Record<string, string> }
 * - その他: { status, message }
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  errors?: Record<string, string>;
}
