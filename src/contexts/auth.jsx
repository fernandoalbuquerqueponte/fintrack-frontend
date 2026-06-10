import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useLogin, useSignup } from '@/api/hooks/user'
import { UserService } from '@/api/services/user'
import {
  LOCAL_STORAGE_ACCESS_TOKEN_KEY,
  LOCAL_STORAGE_REFRESH_TOKEN_KEY,
} from '@/constants/local-storage'

export const AuthContext = createContext({
  user: null,
  isInitializing: true,
  login: () => {},
  signup: () => {},
  signOut: () => {},
})

export const useAuthContext = () => useContext(AuthContext)

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

  const signupMutation = useSignup()

  const signinMutation = useLogin()

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
        const response = await UserService.me()

        setUser(response)
      } catch (error) {
        setUser(null)
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

  const login = async (data) => {
    try {
      const loggedUser = await signinMutation.mutateAsync(data)
      setTokens(loggedUser.tokens)
      setUser(loggedUser)
      toast.success('Login realizado com sucesso!')
    } catch (error) {
      console.error(error)
    }
  }

  const signOut = () => {
    setUser(null)
    removeTokens()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        isInitializing,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
