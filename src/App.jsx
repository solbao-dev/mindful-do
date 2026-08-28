import { useEffect } from 'react';
import { supabase } from './supabase';

function App() {
  useEffect(() => {
    const testSupabase = async () => {
      // supabase의 'todos' 테이블에서 데이터를 가져오는 테스트
      const { data, error } = await supabase.from('todos').select('*');
      
      if (error) {
        console.error("❌ Supabase 연결 실패:", error.message);
      } else {
        console.log("✅ Supabase 연결 성공! 데이터:", data);
      }
    };

    testSupabase();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase 연동 테스트 중... 🚀</h1>
      <p>오른쪽 개발자 도구의 콘솔(Console) 탭을 확인해 보세요!</p>
    </div>
  );
}

export default App;