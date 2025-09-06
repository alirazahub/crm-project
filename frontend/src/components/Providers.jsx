'use client';

//import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import { store , persistor } from '@/store';
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({ children }) {
  return (
    
      <Provider store={store}> {/* ✅ Wrap Redux provider here */}
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    
  );
}



