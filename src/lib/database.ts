// database connection is a global variable
// (not ideal, but OK for simple project)
import { supabase } from '../lib/supabaseClient'

import type { Database, Tables, TablesInsert } from '../../types/database.types'

////////////////////////////////////////////////////////////

export type Instrument = Tables<"instruments">;

////////////////////////////////////////////////////////////

export const getInstruments = async () => {
    const { data, error } = await supabase.from('instruments').select()

    if (error) {
      console.error(error)
      return
    }

    return data
  }

export const createInstrument = async (instrument: TablesInsert<"instruments">) => {
  // run sql INSERT command
  const { data, error } = await supabase
    .from("instruments").insert(instrument); // INSERT INTO instruments (...) VALUES (...)

  // optional: handle errors
  if (error) { console.error(error); }
}

export const deleteInstrument = async (instrumentId: number) => {
  // run sql DELETE command
  const { data, error } = await supabase
    .from("instruments").delete() // DELETE FROM instruments
    .eq("id", instrumentId);      // WHERE id = ${instrumentId}

  // optional: handle errors
  if (error) { console.error(error); }
}