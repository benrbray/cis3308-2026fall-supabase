import { useState } from "react";
import { createInstrument } from "../lib/database";

export const CreateInstrumentForm = () => {
  // form data
  const [instrumentName, setInstrumentName] = useState("");


  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    createInstrument({
      name: instrumentName
    });
  }

  return <form onSubmit={handleSubmit} className="create-instrument-form">
    <input
        type="text"
        placeholder="Instrument Name..."
        value={instrumentName}
        required={true}
        onChange={(e) => setInstrumentName(e.target.value)}
      />
    <button>
      Create Instrument
    </button>
  </form>;
}