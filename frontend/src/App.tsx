import { useEffect, useState } from 'react';

type Health = { status: string };

function App() {
  const [health, setHealth] = useState<Health | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then((data: Health) => setHealth(data))
      .catch(err => console.error('Health check failed:', err));
  }, []);

  return (
    <div>
      <h1>PetShop CompassUOL</h1>
      {health
        ? <p>🟢 API Health: {health.status}</p>
        : <p>⏳ Verificando API...</p>}
    </div>
  );
}

export default App;