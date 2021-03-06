import { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

import Header from '@/components/auth/Header'
import LoginForm from '@/components/auth/LoginForm'
import useSignUp from '@/hooks/useSignUp'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const signUpMutation = useSignUp({
    email,
    password
  })

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!email || !password) {
      return toast.error('sign up error: missing required information')
    }

    signUpMutation.mutate()
  }

  return (
    <div className="flex min-h-full">
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Header
            title="Sign up for free account"
            subtitle={{ text: 'sign in to existing account', href: '/login' }}
          />
          <div className="mt-8">
            <LoginForm
              handleSubmit={handleSubmit}
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
              submitButtonText="Sign up"
            />
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-pink-300 to-orange-100" />
      </div>
    </div>
  )
}
