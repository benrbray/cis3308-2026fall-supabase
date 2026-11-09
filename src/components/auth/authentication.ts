import { useState, useEffect, useCallback } from 'react'
import type { Database } from '../../../types/database.types';
import type { SupabaseClient } from '@supabase/supabase-js';
import * as S from "@supabase/supabase-js";

////////////////////////////////////////////////////////////

export interface AuthLoggedOut {
  kind: "auth-logged-out",
}
export interface AuthPending {
  kind: "auth-pending"
}
export interface AuthLoggedIn {
  kind: "auth-logged-in"
  claims: S.JwtPayload,
}
export interface AuthError {
  kind: "auth-error",
  error: S.AuthError
}

export type AuthState =
  | AuthLoggedOut  
  | AuthPending
  | AuthLoggedIn
  | AuthError

////////////////////////////////////////////////////////////

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
  }, [supabaseClient]);

  return authState
}