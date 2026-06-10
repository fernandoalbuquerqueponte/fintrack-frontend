import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { loginFormSchema, signupFormSchema } from '../schemas/user'

export const useLoginForm = () => {
  const form = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return { form }
}

export const useSignupForm = () => {
  return useForm({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })
}
