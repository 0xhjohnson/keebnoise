import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import toast from 'react-hot-toast'
import { useMutation } from 'react-query'

import { UserInfo } from '@/types'
import { isSupabaseError } from '@/utils'

async function signUp({ email, password }: UserInfo) {
  const { user, error: signUpError } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  })
  if (signUpError) {
    throw signUpError
  }

  return user
}

export default function useSignUp(userInfo: UserInfo) {
  return useMutation(() => signUp(userInfo), {
    onError(error) {
      if (isSupabaseError(error)) {
        toast.error(error.message)
      }
    }
  })
}
