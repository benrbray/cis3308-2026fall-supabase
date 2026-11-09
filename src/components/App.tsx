import { useCallback, useEffect, useState } from 'react'

import { supabase } from '../lib/supabaseClient'
import type { Database, Tables, Enums } from '../../types/database.types'
import { AuthStateDisplay } from './SignIn'
import { CreateInstrumentForm } from './CreateInstrumentForm'
import { deleteInstrument, type Instrument } from '../lib/database'

////////////////////////////////////////////////////////////

const InstrumentList = (
  props: { 
    instruments: Instrument[],
    onDelete: (instrumentId: number) => void,
  }
) => {
  return (<div className="instrument-list">
    {props.instruments.map((instrument) => (
      <div key={instrument.id} className="instrument">
        <button onClick={() => props.onDelete(instrument.id)}>Delete</button>
        <div className="title">{instrument.name}</div>
      </div>
    ))}
  </div>);
}

function App() {

  // ---- instruments ---- //

  const [instruments, setInstruments] = useState<Instrument[]>([])

  // useCallback caches the function definition, so it will
  // not be re-defined every time the component renders
  const loadInstruments = useCallback(async () => {
    const { data, error } = await supabase.from('instruments').select()

    if (error) {
      console.error(error)
      return
    }

    setInstruments(data)
  }, []);

  // the purpose of useEffect is to synchronize a react component
  // with an external system.  The callback is called when the
  // component renders for the first time, as well as whenever
  // one of its dependencies (the second, array argument) changes.
  useEffect(() => {
    loadInstruments();
  }, [loadInstruments])

  // --------------------- //

  const handleDelete = useCallback(async (instrumentId: number) => {
    await deleteInstrument(instrumentId);
    await loadInstruments();
  }, [loadInstruments]);

  // --------------------- //

  return (<>
    <InstrumentList instruments={instruments} onDelete={handleDelete} />
    <CreateInstrumentForm onCreate={() => loadInstruments()} />

    {/* <AuthStateDisplay supabaseClient={supabase}/> */}
  </>)
}

export default App;