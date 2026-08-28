import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';

function App() {
  // 1. 진짜 데이터를 담을 주머니 (초기값은 빈 배열)
  const [todos, setTodos] = useState([]);

  // 2. Supabase에서 데이터를 가져오는 함수
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos') // 'todos' 테이블에서
      .select('*')   // 모든 데이터를 가져와라
      .order('created_at', { ascending: false }); // 최신순으로 정렬해라

    if (error) {
      console.error("데이터를 가져오는데 실패했습니다:", error);
    } else {
      setTodos(data); // 성공하면 주머니(todos)에 데이터를 담아라!
    }
  };

  // 3. 화면이 처음 켜질 때 딱 한 번! fetchTodos 함수를 실행해라
  useEffect(() => {
    fetchTodos();
  }, []);

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
