import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

import PasswordInput from '@/components/password-input'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/lib/axios'

const signupSchema = z
  .object({
    first_name: z.string().trim().min(1, { message: 'O nome é obrigatório' }),
    last_name: z
      .string()
      .trim()
      .min(1, { message: 'O sobrenome é obrigatório' }),
    email: z
      .string()
      .email({ message: 'E-mail inválido' })
      .trim()
      .min(1, { message: 'O e-mail é obrigatório' }),
    password: z
      .string()
      .trim()
      .min(6, { message: 'A senha deve conter no mínimo 6 caracteres' }),
    confirmPassword: z.string().trim().min(6, {
      message: 'A confirmação de senha deve conter no mínimo 6 caracteres',
    }),
    terms: z.boolean().refine((value) => value === true, {
      message: 'Você deve aceitar os termos de uso e política de privacidade',
    }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword
    },
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }
  )

const SignupPage = () => {
  const [user, setUser] = useState(null)

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

  const methods = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  })

  useEffect(() => {
    const init = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

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
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        console.log(error)
      }
    }

    init()
  }, [])

  const handleSubmit = (data) => {
    signupMutation.mutate(data, {
      onSuccess: (createdUser) => {
        const accessToken = createdUser.tokens.accessToken
        const refreshToken = createdUser.tokens.refreshToken

        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        setUser(createdUser)

        toast.success('Conta criada com sucesso!')
      },
      onError: () => {
        toast.error('Erro ao criar conta. Por favor, tente novamente.')
      },
    })
  }

  if (user) {
    return <h1>Olá {user.first_name}</h1>
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3">
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(handleSubmit)}>
          <Card className="w-[500px]">
            <CardHeader>
              <CardTitle>Crie a sua conta</CardTitle>
              <CardDescription>
                Insira suas credenciais para criar uma nova conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={methods.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sobrenome</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o seu sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o seu e-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmação de Senha</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="Digite a sua senha novamente"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="terms"
                render={({ field }) => (
                  <FormItem className="items-top flex space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        id="terms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <label
                        htmlFor="terms"
                        className={`text-xs text-muted-foreground opacity-75 ${methods.formState.errors.terms && 'text-red-500'}`}
                      >
                        Ao clicar em criar conta, você concorda com os nossos{' '}
                        <a
                          href="/terms"
                          className={`text-white underline hover:text-primary ${methods.formState.errors.terms && 'text-red-500'}`}
                        >
                          termos de uso e política de privacidade.
                        </a>
                      </label>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Criar conta</Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
      <div className="flex items-center justify-center">
        <p className="text-center opacity-50">Já possui uma conta?</p>
        <Button variant="link" asChild>
          <Link to="/login">Faça login</Link>
        </Button>
      </div>
    </div>
  )
}

export default SignupPage
