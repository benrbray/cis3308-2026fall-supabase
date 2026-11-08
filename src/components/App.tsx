import { useEffect, useState } from 'react'

import { supabase } from '../lib/supabaseClient'
import type { Database, Tables, Enums } from '../../types/database.types'
import { AuthStateDisplay } from './SignIn'
import { CreateInstrumentForm } from './CreateInstrumentForm'
import { deleteInstrument } from '../lib/database'

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
    loadInstruments()
  }, [])

  async function loadInstruments() {
    const { data, error } = await supabase.from('instruments').select()

    if (error) {
      console.error(error)
      return
    }

    setInstruments(data)
  }

  const handleDelete = async (instrumentId: number) => {
    await deleteInstrument(instrumentId);
    await loadInstruments();
  }

  return (<>
    <div className="instrument-list">
      {instruments.map((instrument) => (
        <div key={instrument.id} className="instrument">
          <button onClick={() => handleDelete(instrument.id)}>Delete</button>
          <div className="title">{instrument.name}</div>
        </div>
      ))}
    </div>

    <CreateInstrumentForm />

    {/* <AuthStateDisplay supabaseClient={supabase}/> */}
  </>)
}

export default App;