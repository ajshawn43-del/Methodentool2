export function DebugPage() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🔍 Environment Variables Debug</h1>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>VITE_SUPABASE_URL:</h3>
        <p style={{ color: supabaseUrl ? 'green' : 'red', fontSize: '14px', wordBreak: 'break-all' }}>
          {supabaseUrl || '❌ NICHT GELADEN (undefined)'}
        </p>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>VITE_SUPABASE_ANON_KEY:</h3>
        <p style={{ color: supabaseKey ? 'green' : 'red', fontSize: '14px', wordBreak: 'break-all' }}>
          {supabaseKey ? `${supabaseKey.substring(0, 50)}... (geladen ✅)` : '❌ NICHT GELADEN (undefined)'}
        </p>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', background: '#fff3cd', borderRadius: '8px' }}>
        <h3>Status:</h3>
        {supabaseUrl && supabaseKey ? (
          <p style={{ color: 'green' }}>✅ Beide Variablen sind geladen!</p>
        ) : (
          <p style={{ color: 'red' }}>❌ Environment Variablen fehlen - Backend funktioniert nicht!</p>
        )}
      </div>
    </div>
  );
}
