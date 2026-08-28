import { useState } from 'react';
import './App.css';

function App() {
  return (
    <div className="app-container">
      {/* 1. 헤더 (제목) 영역 */}
      <header>
        <h1>🧘‍♀️ Mindful Do</h1>
        <p>할 일과 내 감정을 함께 기록해보세요.</p>
      </header>

      <main>
        {/* 2. 할 일 입력 영역 (Create 준비) */}
        <section className="input-section">
          <input 
            type="text" 
            placeholder="어떤 일을 해야 하나요?" 
          />
          <button>추가하기</button>
        </section>

        {/* 3. 할 일 목록 영역 (Read 준비) */}
        <section className="list-section">
          <h2>오늘의 할 일</h2>
          <ul>
            {/* 나중에 데이터베이스에서 가져온 데이터로 바뀔 부분입니다 */}
            <li>할 일 예시 1 (감정: 3)</li>
            <li>할 일 예시 2 (감정: 5)</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;
