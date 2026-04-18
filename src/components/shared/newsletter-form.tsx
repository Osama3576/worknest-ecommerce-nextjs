"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type FormValues = { email: string };

export function NewsletterForm() {
  const [status, setStatus] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    const response = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    setStatus(data.message);
    if (response.ok) reset();
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Enter your email" {...register("email")} />
        <Button disabled={isSubmitting} className="sm:w-auto">
          {isSubmitting ? "Joining..." : "Join newsletter"}
        </Button>
      </div>
      {errors.email ? <p className="text-sm text-danger">{errors.email.message}</p> : null}
      {status ? <p className="text-sm text-muted">{status}</p> : null}
    </form>
  );
}
