import { supabase } from "../../lib/supabaseClient";

async function signInWithGithub() {
  // triggers redirect to GitHub sign-in page
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
  })

  console.log(data);

  if(error !== null) {
    console.error(error);
  }
}

export const GitHubLoginButton = () => {
  return <div>
    <button onClick={() => signInWithGithub()}>Sign in with GitHub</button>
  </div>
}