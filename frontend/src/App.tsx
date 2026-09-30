import AppRoutes from './routes/AppRoutes'
import { useEffect } from 'react'
import { monitorSession } from './services/session'


function App() {
 useEffect(monitorSession, []);
 

  return (
    <>
     <AppRoutes/> 
    </>
  )
}

export default App
