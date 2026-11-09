import { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { GitHubLoginButton } from './GitHubLoginButton';
import { type AuthLoggedIn, type AuthState } from './authentication';

// adapted from https://supabase.com/docs/guides/auth/quickstarts/react

////////////////////////////////////////////////////////////

const displayName = (claims: AuthLoggedIn) => {
  const metadata = claims.claims.user_metadata;

  const displayName = metadata?.display_name;
  const preferredUsername = metadata?.preferred_username;
  const fullName = metadata?.full_name;
  const userName = metadata?.user_name;
  const email = metadata?.email;

  return displayName || preferredUsername || fullName || userName || email || "Unknown User";
}

export const AuthStateDisplay = (
  props: {
    onLogOutClicked: () => void
  }
) => {
  const authState: AuthState|null = useContext(AuthContext);
  
  if(authState == null) {
    return <div>
      Loading...
    </div>
  } else if(authState.kind == "auth-logged-out") {
    return <div>
      <GitHubLoginButton />
    </div>
  } else if(authState.kind == "auth-logged-in") {
    return <div>
      <div>
        Logged In as {displayName(authState)}
        <button onClick={() => props.onLogOutClicked()}>Log Out</button>
      </div>
      <pre>
        {JSON.stringify(authState, null, 2)}
      </pre>
    </div>
  }

  return <>
    <pre>
      {JSON.stringify(authState, null, 2)}
    </pre>
  </>
}