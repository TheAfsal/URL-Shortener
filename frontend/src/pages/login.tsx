"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form"
import { useAuthStore } from "../store/auth-store"
import { LinkIcon } from "lucide-react"

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type FormValues = z.infer<typeof formSchema>

export default function LoginPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuthStore()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true)
        try {
            await login(values.email, values.password)
            navigate("/home")
        } catch (error) {
            toast("Invalid email or password. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-12rem)]">
            <Card className="w-full max-w-md gradient-card">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <div className="p-2 rounded-full bg-blue-900/50 border border-blue-700/30">
                            <LinkIcon className="h-6 w-6 text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center text-blue-100">Welcome back</CardTitle>
                    <CardDescription className="text-center text-blue-300">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-200">Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="you@example.com"
                                                {...field}
                                                className="bg-blue-950/50 border-blue-800/50 text-blue-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-blue-200">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                className="bg-blue-950/50 border-blue-800/50 text-blue-100"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-blue-300 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
