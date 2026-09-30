import { useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase/config';
import './App.css';

function App() {
  const [searchName, setSearchName] = useState('');
  const [result, setResult] = useState(null);   // { studentId, name, className, gender }
  const [status, setStatus] = useState('idle'); // idle | loading | found | notfound | error
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSearch = async () => {
    const trimmed = searchName.trim();
    if (!trimmed) {
      triggerShake();
      return;
    }

    setStatus('loading');
    setResult(null);

    try {
      const q = query(
        collection(db, 'students'),
        where('name', '==', trimmed)
      );
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setStatus('notfound');
      } else {
        const data = snapshot.docs[0].data();
        setResult(data);
        setStatus('found');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleReset = () => {
    setSearchName('');
    setResult(null);
    setStatus('idle');
  };

  return (
    <div className="page">
      {/* 배경 파티클 */}
      <div className="bg-orbs">
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />
      </div>

      <div className="container">
        {/* 헤더 */}
        <div className="header">
          <div className="badge">2026 신입생</div>
          <h1 className="title">소프트웨어융합과 학번 조회 시스템</h1>
          <p className="subtitle">성명을 입력하면 학번을 확인할 수 있습니다</p>
        </div>

        {/* 검색 카드 */}
        <div className={`card ${shake ? 'shake' : ''}`}>
          <div className="search-area">
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                className="search-input"
                placeholder="성명을 입력하세요"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status === 'loading'}
                autoFocus
              />
              {searchName && (
                <button className="clear-btn" onClick={handleReset} title="초기화">
                  ✕
                </button>
              )}
            </div>

            <button
              className="search-btn"
              onClick={handleSearch}
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <span className="spinner" />
              ) : (
                '학번 조회'
              )}
            </button>
          </div>

          {/* 결과 영역 */}
          {status === 'found' && result && (
            <div className="result result--found">
              <div className="result-label">조회 결과</div>
              <div className="result-id">{result.studentId}</div>
              <div className="result-meta">
                <span className="meta-chip">{result.name}</span>
                {result.className && (
                  <span className="meta-chip">{result.className}</span>
                )}
                {result.gender && (
                  <span className="meta-chip">{result.gender === '남' ? '🙋‍♂️ 남' : '🙋‍♀️ 여'}</span>
                )}
              </div>
            </div>
          )}

          {status === 'notfound' && (
            <div className="result result--notfound">
              <div className="result-icon">🔍</div>
              <p>등록된 학생 정보를 찾을 수 없습니다.</p>
              <p className="hint">성명을 정확히 입력해 주세요.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="result result--error">
              <div className="result-icon">⚠️</div>
              <p>조회 중 오류가 발생했습니다.</p>
              <p className="hint">잠시 후 다시 시도해 주세요.</p>
            </div>
          )}
        </div>

        <p className="footer-note">학번 조회에 문제가 있으면 053-650-9250 문의하세요.</p>
      </div>
    </div>
  );
}

export default App;
