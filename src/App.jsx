import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { supabase } from './supabase';
import './App.css';

// ==========================================
// 1. 홈 화면 컴포넌트 (오늘의 할 일 + 일기 작성)
// ==========================================
function Home() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [emotion, setEmotion] = useState(3);
  const [diaryContent, setDiaryContent] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .gte('created_at', `${today}T00:00:00`)
      .order('created_at', { ascending: false });

    if (error) console.error("데이터 가져오기 에러:", error);
    else setTodos(data);
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return;
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: newTodo, priority: priority, status: 'pending' }])
      .select();

    if (error) console.error("데이터 추가 에러:", error);
    else if (data) {
      setTodos([data[0], ...todos]);
      setNewTodo("");
      setPriority("medium");
    }
  };

  const handleToggleTodo = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    const { error } = await supabase.from('todos').update({ status: newStatus }).eq('id', id);

    if (!error) {
      setTodos(todos.map(todo => todo.id === id ? { ...todo, status: newStatus } : todo));
    }
  };

  const handleDeleteTodo = async (id) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) setTodos(todos.filter(todo => todo.id !== id));
  };

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
      alert("일기 저장에 실패했습니다.");
    } else {
      alert("오늘 하루도 고생 많으셨습니다! 일기가 저장되었습니다. 🌙\n'나의 기록' 탭에서 확인해보세요!");
      setDiaryContent("");
      setEmotion(3);
    }
  };

  return (
    <main style={{ minHeight: '650px', display: 'flex', flexDirection: 'column' }}>
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

      <section className="list-section" style={{ flex: 1 }}>
        <h2>오늘의 할 일</h2>
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={todo.status === 'completed'}
                  onChange={() => handleToggleTodo(todo.id, todo.status)}
                />
                <span style={{ textDecoration: todo.status === 'completed' ? 'line-through' : 'none', color: todo.status === 'completed' ? 'gray' : 'black', marginLeft: '10px', marginRight: '8px' }}>
                  {todo.title}
                </span>
                <span style={{ fontSize: '14px' }}>
                  {todo.priority === 'high' ? '🔴' : todo.priority === 'medium' ? '🟡' : '🟢'}
                </span>
              </div>
              <button onClick={() => handleDeleteTodo(todo.id)} style={{ cursor: 'pointer', background: 'none', border: 'none', padding: '0', color: '#cccccc', fontSize: '16px', fontWeight: 'bold' }}>✕</button>
            </li>
          ))}
        </ul>
      </section>

      <section className="diary-section" style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
        <h2>🌙 하루 마감하기</h2>
        <div style={{ marginBottom: '10px' }}>
          <label>오늘의 점수 (1~5): </label>
          <input type="range" min="1" max="5" value={emotion} onChange={(e) => setEmotion(Number(e.target.value))} />
          <span> {emotion}점</span>
        </div>
        <textarea
          placeholder="오늘 하루는 어땠나요? 감정과 생각들을 자유롭게 적어보세요."
          value={diaryContent}
          onChange={(e) => setDiaryContent(e.target.value)}
          style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '10px', boxSizing: 'border-box' }}
        />
        <button onClick={handleSaveDiary} style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
          일기 저장하고 하루 마치기
        </button>
      </section>
    </main>
  );
}

// ==========================================
// 2. 기록 화면 컴포넌트 (과거 기록 모아보기)
// ==========================================
function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const { data: diariesData } = await supabase.from('diaries').select('*').order('date', { ascending: false });
    const { data: todosData } = await supabase.from('todos').select('*');

    if (diariesData && todosData) {
      const combinedData = diariesData.map(diary => {
        const dayTodos = todosData.filter(todo => todo.created_at.split('T')[0] === diary.date);
        const total = dayTodos.length;
        const completed = dayTodos.filter(t => t.status === 'completed').length;
        const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

        return { ...diary, todos: dayTodos, completionRate };
      });
      setHistory(combinedData);
    }
  };

  return (
    <main style={{ minHeight: '650px', display: 'flex', flexDirection: 'column' }}>
      <section className="history-section" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h2>📖 나의 기록들</h2>
        {history.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'gray', textAlign: 'center' }}>아직 작성된 기록이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {history.map((record) => (
              <div key={record.id} style={{ border: '1px solid #eee', borderRadius: '8px', padding: '20px', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{record.date}</h3>
                  <span style={{ fontWeight: 'bold', color: '#4CAF50' }}>오늘의 점수: {record.emotion}점</span>
                </div>
                <p style={{ lineHeight: '1.6', color: '#333', marginBottom: '20px' }}>{record.content}</p>
                <div style={{ backgroundColor: '#f4f6f8', padding: '15px', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '14px' }}>📌 그날의 목표</strong>
                    <strong style={{ fontSize: '14px', color: '#0066cc' }}>달성률: {record.completionRate}%</strong>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px' }}>
                    {record.todos.length === 0 ? (
                      <li style={{ color: 'gray' }}>등록된 할 일이 없었습니다.</li>
                    ) : (
                      record.todos.map(t => (
                        <li key={t.id} style={{ marginBottom: '5px', color: t.status === 'completed' ? 'gray' : 'black', textDecoration: t.status === 'completed' ? 'line-through' : 'none' }}>
                          {t.status === 'completed' ? '✅' : '⬜️'} {t.title}
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

// ==========================================
// 3. 메인 앱 컴포넌트 (라우팅 및 네비게이션)
// ==========================================
function App() {
  return (
    <Router>
      {/* 💡 핵심 수정 부분: 가로 너비를 500px로 단단하게 고정했습니다! */}
      <div className="app-container" style={{ width: '100%', maxWidth: '500px', minWidth: '450px', margin: '0 auto', boxSizing: 'border-box' }}>
        <header>
          <h1>Mindful Do 🧘🏻‍♀️</h1>
          <p>할 일을 완료하고 하루의 끝에 내 감정을 기록해보세요.</p>

          <nav style={{ display: 'flex', width: '100%', gap: '10px', marginTop: '30px', marginBottom: '20px' }}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                flex: 1,
                textAlign: 'center',
                padding: '14px 0',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#4a90e2' : '#f0f0f0',
                color: isActive ? 'white' : '#666',
                transition: 'all 0.2s ease-in-out'
              })}
            >
              오늘의 할 일
            </NavLink>

            <NavLink
              to="/history"
              style={({ isActive }) => ({
                flex: 1,
                textAlign: 'center',
                padding: '14px 0',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                borderRadius: '8px',
                backgroundColor: isActive ? '#4a90e2' : '#f0f0f0',
                color: isActive ? 'white' : '#666',
                transition: 'all 0.2s ease-in-out'
              })}
            >
              나의 기록
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
