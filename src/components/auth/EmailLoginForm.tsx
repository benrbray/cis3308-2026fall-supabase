import type { SupabaseClient } from "@supabase/supabase-js";
import * as S from "@supabase/supabase-js";
import type { Database } from "../../../types/database.types";
import { useCallback, useState } from "react";

export const LoginForm = (
  props: {
    supabaseClient : SupabaseClient<Database>
  }
) => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"unsent"|"error"|"sending"|"sent">("unsent");

  const handleLogin = useCallback(async (event: React.SubmitEvent<HTMLFormElement>) => {
    // prevent the form from redirecting the page
    event.preventDefault();

    // we're about to send the email
    setEmailStatus("sending");

    // signInWithOtp tells Supabase to send a log-in link to the user
    // - the response we get will either be an error, or null
    // - the actual log-in doesn't happen on _this_ page, it happens when
    //     the user clicks the link in their email and visits a new page that
    //     includes the login details as part of the URL
    const response: S.AuthOtpResponse = await props.supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    // if sending the login email was unsucessful, show an error to the user
    if(response.error !== null) {
      console.log(response.error);
      setEmailStatus("error");
    } else {  
      setEmailStatus("sent");
    }
  }, [props.supabaseClient, email]);

  return <div>
    <h1>Email Login</h1>
    <p>Sign in via magic link with your email below.</p>
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        required={true}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button disabled={emailStatus == "sending"}>
        {(emailStatus == "sending") ? <span>Sending Email...</span> : <span>Send Magic Link</span>}
      </button>
    </form>
    <div>
      {(emailStatus == "unsent") && <div>Unsent!</div> }
      {(emailStatus == "sent")   && <div>Email Sent!</div> }
      {(emailStatus == "error")  && <div>Error!</div> }
    </div>
  </div>
}