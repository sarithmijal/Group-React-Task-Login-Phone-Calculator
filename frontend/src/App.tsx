import { Flex, Spinner } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { CalculatorView } from './components/CalculatorView';
import { DashboardView, type ActiveTool } from './components/DashboardView';
import { LoginView } from './components/LoginView';
import { SumView } from './components/SumView';
import { authApi, type AuthUser } from './lib/api';

export function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [activeTool, setActiveTool] = useState<ActiveTool>('home');

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const res = await authApi.me();
        if (active) {
          setUser(res.user);
        }
      } catch {
        if (active) {
          setUser(null);
        }
      } finally {
        if (active) {
          setIsCheckingSession(false);
        }
      }
    }

    checkSession();
    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setActiveTool('home');
    }
  };

  if (isCheckingSession) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Spinner size="lg" color="blue.400" />
      </Flex>
    );
  }

  if (!user) {
    return <LoginView onSuccess={(loggedInUser) => setUser(loggedInUser)} />;
  }

  if (activeTool === 'sum') {
    return <SumView onBack={() => setActiveTool('home')} />;
  }

  if (activeTool === 'calculator') {
    return <CalculatorView onBack={() => setActiveTool('home')} />;
  }

  return (
    <DashboardView
      user={user}
      onSelectTool={(tool) => setActiveTool(tool)}
      onLogout={handleLogout}
    />
  );
}

export default App;
