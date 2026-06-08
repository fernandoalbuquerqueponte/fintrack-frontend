import { useMutation } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { api } from '@/lib/axios'

export const AuthContext = createContext({
  user: null,
  isInitializing: true,
  login: () => {},
  signup: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

const LOCAL_STORAGE_ACCESS_TOKEN_KEY = 'accessToken'
const LOCAL_STORAGE_REFRESH_TOKEN_KEY = 'refreshToken'

const setTokens = (tokens) => {
  localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY, tokens.accessToken)
  localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY, tokens.refreshToken)
}

const removeTokens = () => {
  localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
  localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_KEY)
}

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isInitializing, setisInitializing] = useState(null)

  const signupMutation = useMutation({
    mutationKey: ['signup'],
    mutationFn: async (variables) => {
      const response = await api.post('/users', {
        first_name: variables.first_name,
        last_name: variables.last_name,
        email: variables.email,
        password: variables.password,
      })
      return response.data
    },
  })

  const signinMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async (data) => {
      const response = await api.post('/users/login', {
        email: data.email,
        password: data.password,
      })
      return response.data
    },
  })

  useEffect(() => {
    const init = async () => {
      try {
        setisInitializing(true)
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY)
        const refreshToken = localStorage.getItem(
          LOCAL_STORAGE_REFRESH_TOKEN_KEY
        )

        if (!accessToken && !refreshToken) {
          return
        }

        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        setUser(response.data)
      } catch (error) {
        setUser(null)
        removeTokens()
        console.log(error)
      } finally {
        setisInitializing(false)
      }
    }

    init()
  }, [])

  const signup = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        setTokens(createdUser.tokens)
        setUser(createdUser)

        toast.success('Conta criada com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao criar conta. Por favor, tente novamente.')
      },
    })
  }

  const login = (data) => {
    signinMutation.mutate(data, {
      onSuccess: (loggedUser) => {
        setTokens(loggedUser.tokens)
        setUser(loggedUser)
        toast.success('Login realizado com sucesso!')
      },
      onError: () => {
        toast.error(
          'Ocorreu um erro ao fazer login. Verifique suas credenciais e tente novamente.'
        )
      },
    })
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        isInitializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
