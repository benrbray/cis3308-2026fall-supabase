import { useState, useEffect } from 'react'
import type { Database } from '../../types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import * as S from "@supabase/supabase-js";

// adapted from https://supabase.com/docs/guides/auth/quickstarts/react

////////////////////////////////////////////////////////////

interface AuthLoggedOut {
  kind: "auth-logged-out",
}
interface AuthPending {
  kind: "auth-pending"
}
interface AuthLoggedIn {
  kind: "auth-logged-in"
  claims: S.JwtPayload,
}
interface AuthError {
  kind: "auth-error",
  error: S.AuthError
}

type AuthState =
  | AuthLoggedOut  
  | AuthPending
  | AuthLoggedIn
  | AuthError

/**
 * Used for components that requrie authentication.
 * Retrieves the current login state.
 */
export const useAuth = (
  supabaseClient: SupabaseClient<Database>
) => {
  const [authState, setAuthState] = useState<AuthState|null>(null);

  useEffect(() => {
    // called whenever the local authorization state has changed
    const handleClaimsChanged = (claims: Awaited<ReturnType<SupabaseClient["auth"]["getClaims"]>>) => {
      // LOGGED OUT:  data, error both NULL
      if(claims.data == null && claims.error == null) {
        setAuthState({
          kind: "auth-logged-out",
        })
      }
      // LOGIN ERROR: null data, non-null error
      else if(claims.error !== null) {
        setAuthState({
          kind: "auth-error",
          error: claims.error
        })
      }
      // LOGGED IN: non-null data
      else {
        setAuthState({
          kind: "auth-logged-in",
          claims: claims.data.claims,
        })
      }
    }

    // this call to getClaims() initializes the claims when the page loads
    supabaseClient.auth.getClaims().then(handleClaimsChanged);

    // listen for changes to the authorization state
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(() => {
      supabaseClient.auth.getClaims().then(handleClaimsChanged);
    })

    // useEffect should return a "cleanup" function for any resources used
    return () => {
      // detach the onAuthStateChange event listener
      subscription.unsubscribe();
    }
  }, []);

  return authState
}

////////////////////////////////////////////////////////////

export const LoginForm = (
  props: {
    supabaseClient : SupabaseClient<Database>
  }
) => {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"unsent"|"error"|"sending"|"sent">("unsent");

  const handleLogin = async (event: React.SubmitEvent<HTMLFormElement>) => {
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
  }

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

export const AuthStateDisplay = (
  props: {
    supabaseClient : SupabaseClient<Database>
  }
) => {
  const authState = useAuth(props.supabaseClient);

  if(authState == null) {
    return <div>Loading...</div>
  } else if(authState.kind == "auth-logged-out") {
    return <div>
      <LoginForm supabaseClient={props.supabaseClient} />
    </div>
  }

  return <>
    <pre>
      {JSON.stringify(authState, null, 2)}
    </pre>
  </>
}