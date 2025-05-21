"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { LinkIcon } from "lucide-react";
import { useUrlStore } from "../store/url-store";

const formSchema = z.object({
 originalUrl: z.string().url({ message: "Please enter a valid URL" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function UrlForm() {
 const [isSubmitting, setIsSubmitting] = useState(false);
 const { shortenUrl } = useUrlStore();

 const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
   originalUrl: "",
  },
 });

 async function onSubmit(values: FormValues) {
  setIsSubmitting(true);
  try {
   await shortenUrl(values.originalUrl);
   form.reset();
   toast("Your shortened URL has been created");
  } catch (error) {
   toast("Failed to shorten URL. Please try again.");
  } finally {
   setIsSubmitting(false);
  }
 }

 return (
  <Card className="gradient-card">
   <CardHeader>
    <CardTitle className="text-blue-100">Shorten a URL</CardTitle>
    <CardDescription className="text-blue-300">
     Paste a long URL to create a shorter link
    </CardDescription>
   </CardHeader>
   <CardContent>
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
       control={form.control}
       name="originalUrl"
       render={({ field }) => (
        <FormItem>
         <FormLabel className="text-blue-200">URL</FormLabel>
         <FormControl>
          <div className="flex gap-2">
           <Input
            placeholder="https://example.com/very-long-url"
            {...field}
            className="bg-blue-950/50 border-blue-800/50 text-blue-100"
           />
           <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
           >
            <LinkIcon className="h-4 w-4 mr-2" />
            Shorten
           </Button>
          </div>
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />
     </form>
    </Form>
   </CardContent>
  </Card>
 );
}
