/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from "../components/ui/card";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "../components/ui/form";
import { useAuthStore } from "../store/auth-store";
import { LinkIcon } from "lucide-react";

const formSchema = z
 .object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
 })
 .refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
 });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterPage() {
 const [isSubmitting, setIsSubmitting] = useState(false);
 const navigate = useNavigate();
 const { register, isAuthenticated } = useAuthStore();

 useEffect(() => {
  if (isAuthenticated) {
   navigate("/home");
  }
 }, [isAuthenticated, navigate]);

 const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   name: "",
   email: "",
   password: "",
   confirmPassword: "",
  },
 });

 async function onSubmit(values: FormValues) {
  setIsSubmitting(true);
  try {
   await register(values.name, values.email, values.password);
   toast("Your account has been created. Please sign in.");
   navigate("/login");
  } catch (error) {
   toast("This email may already be in use. Please try another.");
  } finally {
   setIsSubmitting(false);
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
     <CardTitle className="text-2xl text-center text-blue-100">Create an account</CardTitle>
     <CardDescription className="text-center text-blue-300">
      Enter your details to create your account
     </CardDescription>
    </CardHeader>
    <CardContent>
     <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
       <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
         <FormItem>
          <FormLabel className="text-blue-200">Name</FormLabel>
          <FormControl>
           <Input
            placeholder="John Doe"
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
       <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
         <FormItem>
          <FormLabel className="text-blue-200">Confirm Password</FormLabel>
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
        {isSubmitting ? "Creating account..." : "Create account"}
       </Button>
      </form>
     </Form>
    </CardContent>
    <CardFooter className="flex justify-center">
     <p className="text-blue-300 text-sm">
      Already have an account?{" "}
      <Link to="/login" className="text-blue-400 hover:text-blue-300">
       Sign in
      </Link>
     </p>
    </CardFooter>
   </Card>
  </div>
 );
}
