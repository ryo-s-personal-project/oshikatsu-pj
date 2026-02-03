/**
 * 推しグループ画面
 * グループ名・会社名での検索、新規作成、一覧表示を行う
 */

import { useCallback, useState } from 'react';
import {
  createOshiGroup,
  listOshiGroupsByCompany,
  listOshiGroupsByGroupName,
  updateOshiGroup,
} from '../api/oshiGroupApi';
import { ErrorMessage } from '../components/ErrorMessage';
import { ApiError } from '../lib/apiClient';
import type { OshiGroupResponse } from '../types/api';
import { oshiGroupFormSchema, type OshiGroupFormValues } from '../lib/validation';
import './OshiGroupPage.css';


type SearchType = 'groupName' | 'company';

export function OshiGroupPage() {
  const [searchType, setSearchType] = useState<SearchType>('groupName');
  const [searchFull, setSearchFull] = useState(true);
  const [searchFuzzy, setSearchFuzzy] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<OshiGroupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | ApiError | null>(null);

  /** モーダル: 新規作成 / 編集 */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OshiGroupResponse | null>(null);
  const [formValues, setFormValues] = useState<OshiGroupFormValues>({
    groupName: '',
    company: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /** 検索実行 */
  const runSearch = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      if (searchType === 'company') {
        const list = await listOshiGroupsByCompany(searchQuery);
        setGroups(list);
      } else {
        if (!searchFull && !searchFuzzy) {
          setError('全文一致かあいまい検索のどちらかを選択してください');
          setGroups([]);
          return;
        }
        if (searchFull && searchFuzzy) {
          setError('全文一致とあいまい検索は同時に選択できません');
          setGroups([]);
          return;
        }
        const list = await listOshiGroupsByGroupName(
          searchFull,
          searchFuzzy,
          searchQuery
        );
        setGroups(list);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err);
      } else {
        setError('検索に失敗しました');
      }
      setGroups([]);
    } finally {
      setLoading(false);
    }
  }, [searchType, searchFull, searchFuzzy, searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch();
  };

  const openCreateModal = () => {
    setEditingGroup(null);
    setFormValues({ groupName: '', company: '', description: '' });
    setFormErrors({});
    setSubmitError(null);
    setModalOpen(true);
  };

  const openEditModal = (group: OshiGroupResponse) => {
    setEditingGroup(group);
    setFormValues({
      groupName: group.groupName,
      company: group.company ?? '',
      description: group.description ?? '',
    });
    setFormErrors({});
    setSubmitError(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingGroup(null);
    setSubmitError(null);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitError(null);

    const result = oshiGroupFormSchema.safeParse(formValues);
    if (!result.success) {
      const issues = result.error.flatten();
      const fieldMap: Record<string, string> = {};
      if (issues.fieldErrors) {
        Object.entries(issues.fieldErrors).forEach(([key, messages]) => {
          if (messages && messages[0]) fieldMap[key] = messages[0];
        });
      }
      setFormErrors(fieldMap);
      setSubmitError(issues.formErrors[0] ?? '入力内容を確認してください');
      return;
    }

    setSubmitting(true);
    try {
      if (editingGroup) {
        await updateOshiGroup({
          groupId: editingGroup.id,
          groupName: result.data.groupName,
          company: result.data.company || undefined,
          description: result.data.description || undefined,
        });
      } else {
        await createOshiGroup({
          groupName: result.data.groupName,
          company: result.data.company || undefined,
          description: result.data.description || undefined,
        });
      }
      closeModal();
      runSearch();
    } catch (err) {
      if (err instanceof ApiError) {
        setSubmitError(err);
      } else {
        setSubmitError('保存に失敗しました');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="oshi-group-page">
      <header className="oshi-group-page__header">
        <h1>推しグループ</h1>
        <button type="button" className="btn-primary" onClick={openCreateModal}>
          新規作成
        </button>
      </header>

      <section className="card-panel oshi-group-page__search">
        <h2>検索</h2>
        <form onSubmit={handleSearch} className="oshi-group-page__search-form">
          <div className="oshi-group-page__search-type">
            <label>
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'groupName'}
                onChange={() => setSearchType('groupName')}
              />
              グループ名
            </label>
            <label>
              <input
                type="radio"
                name="searchType"
                checked={searchType === 'company'}
                onChange={() => setSearchType('company')}
              />
              会社名
            </label>
          </div>

          {searchType === 'groupName' && (
            <div className="oshi-group-page__search-mode">
              <label>
                <input
                  type="radio"
                  name="searchMode"
                  checked={searchFull}
                  onChange={() => {
                    setSearchFull(true);
                    setSearchFuzzy(false);
                  }}
                />
                全文一致
              </label>
              <label>
                <input
                  type="radio"
                  name="searchMode"
                  checked={searchFuzzy}
                  onChange={() => {
                    setSearchFuzzy(true);
                    setSearchFull(false);
                  }}
                />
                あいまい検索
              </label>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="search-query">
              {searchType === 'groupName' ? 'グループ名' : '会社名'}
            </label>
            <input
              id="search-query"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchType === 'groupName' ? 'グループ名を入力' : '会社名を入力'}
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '検索中...' : '検索'}
          </button>
        </form>
      </section>

      <ErrorMessage error={error} onDismiss={() => setError(null)} />

      <section className="card-panel oshi-group-page__list">
        <h2>一覧</h2>
        {loading ? (
          <div className="page-loading">
            <div className="spinner" aria-hidden />
          </div>
        ) : groups.length === 0 ? (
          <p className="oshi-group-page__empty">
            {searchQuery.trim() ? '該当するグループはありません' : '検索条件を入力して検索してください'}
          </p>
        ) : (
          <ul className="oshi-group-page__groups">
            {groups.map((g) => (
              <li key={g.id} className="oshi-group-page__group-item">
                <div className="oshi-group-page__group-main">
                  <span className="oshi-group-page__group-name">{g.groupName}</span>
                  {g.company && (
                    <span className="oshi-group-page__group-company">{g.company}</span>
                  )}
                </div>
                {g.description && (
                  <p className="oshi-group-page__group-desc">{g.description}</p>
                )}
                <div className="oshi-group-page__group-meta">
                  更新: {formatDate(g.updatedAt)}
                </div>
                <button
                  type="button"
                  className="btn-secondary oshi-group-page__edit-btn"
                  onClick={() => openEditModal(g)}
                >
                  編集
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {modalOpen && (
        <div className="oshi-group-page__modal-overlay" onClick={closeModal}>
          <div
            className="oshi-group-page__modal card-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <h2 id="modal-title">
              {editingGroup ? '推しグループを編集' : '推しグループを新規作成'}
            </h2>
            <form onSubmit={handleModalSubmit}>
              <ErrorMessage error={submitError} onDismiss={() => setSubmitError(null)} />
              <div className="form-field">
                <label htmlFor="form-groupName">グループ名 *</label>
                <input
                  id="form-groupName"
                  value={formValues.groupName}
                  onChange={(e) => setFormValues((v) => ({ ...v, groupName: e.target.value }))}
                  className={formErrors.groupName ? 'invalid' : ''}
                  placeholder="例: 〇〇組"
                />
                {formErrors.groupName && (
                  <span className="hint" role="alert">{formErrors.groupName}</span>
                )}
              </div>
              <div className="form-field">
                <label htmlFor="form-company">会社名</label>
                <input
                  id="form-company"
                  value={formValues.company ?? ''}
                  onChange={(e) => setFormValues((v) => ({ ...v, company: e.target.value }))}
                  placeholder="例: 〇〇事務所"
                />
              </div>
              <div className="form-field">
                <label htmlFor="form-description">説明（1000文字以内）</label>
                <textarea
                  id="form-description"
                  rows={3}
                  value={formValues.description ?? ''}
                  onChange={(e) => setFormValues((v) => ({ ...v, description: e.target.value }))}
                  className={formErrors.description ? 'invalid' : ''}
                  placeholder="メモや説明"
                />
                {formErrors.description && (
                  <span className="hint" role="alert">{formErrors.description}</span>
                )}
              </div>
              <div className="oshi-group-page__modal-actions">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  キャンセル
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
