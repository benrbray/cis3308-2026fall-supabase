import { useEffect, useState } from 'react'

import { supabase } from './lib/supabaseClient'
import type { Database, Tables, Enums } from '../types/database.types'
import { AuthStateDisplay } from './components/SignIn'

////////////////////////////////////////////////////////////

// interface Instrument {
//   id: number,
//   name: string,
// }

type Instrument = Tables<"instruments">

////////////////////////////////////////////////////////////

function App() {
  const [instruments, setInstruments] = useState<Instrument[]>([])

  useEffect(() => {
    getInstruments()
  }, [])

  async function getInstruments() {
    const { data, error } = await supabase.from('instruments').select()

    if (error) {
      console.error(error)
      return
    }

    setInstruments(data)
  }

  return (<>
    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.id}>{instrument.name}</li>
      ))}
    </ul>

    <AuthStateDisplay supabaseClient={supabase}/>
  </>)
}

export default App;