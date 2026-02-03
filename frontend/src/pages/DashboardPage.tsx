/**
 * ダッシュボード画面
 * ログイン後のホーム。推しグループ・推しメンバーへの導線を表示する
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './DashboardPage.css';


export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <header className="dashboard-page__header">
        <h1>ダッシュボード</h1>
        {user && (
          <p className="dashboard-page__welcome">
            こんにちは、<strong>{user.username}</strong> さん
          </p>
        )}
      </header>

      <section className="dashboard-page__section">
        <h2>メニュー</h2>
        <div className="dashboard-page__cards">
          <Link to="/oshi-groups" className="dashboard-page__card card-panel">
            <span className="dashboard-page__card-icon" aria-hidden>👥</span>
            <h3>推しグループ</h3>
            <p>推しのグループ（ユニット・芸能事務所など）を登録・管理します</p>
          </Link>
          <Link to="/oshi-members" className="dashboard-page__card card-panel">
            <span className="dashboard-page__card-icon" aria-hidden>⭐</span>
            <h3>推しメンバー</h3>
            <p>推しメンバーを登録・管理します（準備中）</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
