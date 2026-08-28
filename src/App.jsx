import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';

function App() {
  // 1. 상태 관리
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("medium");

  const [emotion, setEmotion] = useState(3);
  const [diaryContent, setDiaryContent] = useState("");

  // 2. 데이터 불러오기
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error("데이터 가져오기 에러:", error);
    else setTodos(data);
  };

  // 3. 할 일 추가
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: newTodo, priority: priority, status: 'pending' }])
      .select();

    if (error) {
      console.error("데이터 추가 에러:", error);
    } else if (data) {
      setTodos([data[0], ...todos]);
      setNewTodo("");
      setPriority("medium");
    }
  };

  // 4. 할 일 완료 토글
  const handleToggleTodo = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';

    const { error } = await supabase
      .from('todos')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      console.error("상태 업데이트 에러:", error);
    } else {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, status: newStatus } : todo
      ));
    }
  };

  // 5. 할 일 삭제
  const handleDeleteTodo = async (id) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("삭제 에러:", error);
    } else {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  // 6. 일기 저장
  const handleSaveDiary = async () => {
    if (!diaryContent.trim()) {
      alert("일기 내용을 입력해주세요!");
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('diaries')
      .insert([{ date: today, emotion: emotion, content: diaryContent }]);

    if (error) {
      console.error("일기 저장 에러:", error);
      alert("일기 저장에 실패했습니다.");
    } else {
      alert("오늘 하루도 고생 많으셨습니다! 일기가 저장되었습니다. 🌙");
      setDiaryContent("");
      setEmotion(3);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Mindful Do 🧘🏻‍♀️</h1>
        <p>할 일을 완료하고 하루의 끝에 내 감정을 기록해보세요.</p>
      </header>

      <main>
        {/* --- 1. 할 일 입력 영역 --- */}
        <section className="input-section">
          <input
            type="text"
            placeholder="오늘의 할 일을 입력하세요"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">🔴 높음</option>
            <option value="medium">🟡 보통</option>
            <option value="low">🟢 낮음</option>
          </select>
          <button onClick={handleAddTodo}>추가</button>
        </section>

        {/* --- 2. 할 일 목록 영역 --- */}
        <section className="list-section">
          <h2>오늘의 할 일</h2>
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* 👈 왼쪽 묶음: 체크박스 + 할 일 제목 + 중요도 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={todo.status === 'completed'}
                    onChange={() => handleToggleTodo(todo.id, todo.status)}
                  />
                  <span style={{
                    textDecoration: todo.status === 'completed' ? 'line-through' : 'none',
                    color: todo.status === 'completed' ? 'gray' : 'black',
                    marginLeft: '10px',
                    marginRight: '8px' /* 제목과 동그라미 사이 간격 */
                  }}>
                    {todo.title}
                  </span>

                  {/* 💡 중요도 동그라미가 제목 옆으로 왔습니다! */}
                  <span className="todo-priority" style={{ fontSize: '14px' }}>
                    {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                  </span>
                </div>

                {/* 👉 오른쪽 묶음: 오직 삭제 버튼(✕)만 남김 */}
                <div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    style={{
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      padding: '0',
                      color: '#cccccc',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                    title="삭제"
                  >
                    ✕
                  </button>
                </div>

              </li>
            ))}
          </ul>
        </section>

        {/* --- 3. 하루 마감 일기 영역 --- */}
        <section className="diary-section" style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <h2>🌙 하루 마감하기</h2>
          <div style={{ marginBottom: '10px' }}>
            <label>오늘의 감정 점수 (1~5): </label>
            <input
              type="range"
              min="1" max="5"
              value={emotion}
              onChange={(e) => setEmotion(Number(e.target.value))}
            />
            <span> {emotion}점</span>
          </div>
          <textarea
            placeholder="오늘 하루는 어땠나요? 감정과 생각들을 자유롭게 적어보세요."
            value={diaryContent}
            onChange={(e) => setDiaryContent(e.target.value)}
            style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '10px' }}
          />
          <button
            onClick={handleSaveDiary}
            style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}
          >
            일기 저장하고 하루 마치기
          </button>
        </section>
      </main>
    </div>
  );
}

export default App;