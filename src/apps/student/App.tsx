import React from 'react';
import { AppProvider } from "./src/context/AppContext.tsx";
import StudentApp from "./src/components/StudentApp.tsx";

function App() {
  return (
    <AppProvider>
      <StudentApp />
    </AppProvider>
  );
}

export default App;