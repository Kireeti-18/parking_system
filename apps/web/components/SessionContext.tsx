'use client';

import { Session, SessionContextType } from '@parking/validations';
import { createContext, useContext, useEffect, useState } from 'react';

const SessionContext = createContext<SessionContextType | null>(null);

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (ctx) return ctx;
  return {
    session: { isLoggedIn: false, userInfo: null },
    setSession: () => {},
  };
}

export function SessionProvider({
  session: initial,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session>(initial);

  useEffect(() => {
    const stored = sessionStorage.getItem('__parkit');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (!session.isLoggedIn && parsed?.isLoggedIn) {
          setSession(parsed);
        }
      } catch (e) {
        console.error('Invalid session data in storage:', e);
        sessionStorage.removeItem('__parkit');
      }
    }
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}
