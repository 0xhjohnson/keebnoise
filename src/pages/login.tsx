import { ChangeEvent, FormEvent, useState } from 'react'

import Header from '@/components/auth/Header'
import LoginForm from '@/components/auth/LoginForm'
import useLogin from '@/hooks/useLogin'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginMutation = useLogin({
    email,
    password,
  })

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value)
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    loginMutation.mutate()
  }

  return (
    <div className="min-h-full flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Header
            title="Sign in to your account"
            subtitle={{ text: 'sign up for free account', href: '/signup' }}
          />
          <div className="mt-8">
            <LoginForm
              handleSubmit={handleSubmit}
              handleEmailChange={handleEmailChange}
              handlePasswordChange={handlePasswordChange}
              submitButtonText="Sign in"
            />
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-orange-100 to-pink-300" />
      </div>
    </div>
  )
}
