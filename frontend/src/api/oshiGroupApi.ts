/**
 * 推しグループAPI
 * バックエンド OshiGroupController に対応
 */

import { apiRequest } from '../lib/apiClient';
import type {
  CreateOshiGroupRequest,
  OshiGroupResponse,
  UpdateOshiGroupRequest,
} from '../types/api';

/**
 * グループ名で検索（全文一致 or あいまい）
 * GET /api/oshi-groups/list-group?full=&fuzzy=&groupName=
 * @param full - true: 全文一致, false: あいまい（full と fuzzy は排他でどちらか一方のみ true にすること）
 * @param fuzzy - true: あいまい, false: 全文一致
 * @param groupName - 検索するグループ名
 */
export async function listOshiGroupsByGroupName(
  full: boolean,
  fuzzy: boolean,
  groupName: string
): Promise<OshiGroupResponse[]> {
  const params = new URLSearchParams({
    full: String(full),
    fuzzy: String(fuzzy),
    groupName: groupName || '',
  });
  return apiRequest<OshiGroupResponse[]>(
    `/api/oshi-groups/list-group?${params.toString()}`
  );
}

/**
 * 会社名で検索
 * GET /api/oshi-groups/list-company?company=
 */
export async function listOshiGroupsByCompany(
  company: string
): Promise<OshiGroupResponse[]> {
  const params = new URLSearchParams({ company: company || '' });
  return apiRequest<OshiGroupResponse[]>(
    `/api/oshi-groups/list-company?${params.toString()}`
  );
}

/**
 * 推しグループ作成
 * POST /api/oshi-groups/create
 */
export async function createOshiGroup(
  request: CreateOshiGroupRequest
): Promise<OshiGroupResponse> {
  return apiRequest<OshiGroupResponse>('/api/oshi-groups/create', {
    method: 'POST',
    json: request,
  });
}

/**
 * 推しグループ更新
 * POST /api/oshi-groups/update
 */
export async function updateOshiGroup(
  request: UpdateOshiGroupRequest
): Promise<OshiGroupResponse> {
  return apiRequest<OshiGroupResponse>('/api/oshi-groups/update', {
    method: 'POST',
    json: request,
  });
}
