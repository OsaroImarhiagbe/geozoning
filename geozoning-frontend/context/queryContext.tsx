'use client'
import { MutationCache, QueryClient,QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'


const queryClient = new QueryClient({
    mutationCache: new MutationCache({
        onError: (error) => {
            // Global error handling for mutations (e.g., POST/PUT requests)
            console.log(error)
        }
    })
})

export const QueryContextProvider = ({children}:PropsWithChildren) => {

    return (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)
}