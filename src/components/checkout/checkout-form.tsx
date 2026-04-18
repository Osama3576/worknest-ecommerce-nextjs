"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema } from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type CheckoutValues = {
  fullName: string;
  email: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  note?: string;
};

export function CheckoutForm({
  defaultValues,
}: {
  defaultValues?: Partial<CheckoutValues>;
}) {
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message ?? "Checkout failed.");
      return;
    }

    if (data.url) {
      window.location.href = data.url;
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <Input {...register("fullName")} placeholder="Alex Carter" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input {...register("email")} placeholder="alex@worknest.store" />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <Input {...register("phone")} placeholder="+1 415 555 0145" />
        </Field>
        <Field label="Country" error={errors.country?.message}>
          <Input {...register("country")} placeholder="United States" />
        </Field>
        <Field label="Street address" error={errors.line1?.message}>
          <Input {...register("line1")} placeholder="458 Market Street" />
        </Field>
        <Field label="Address line 2" error={errors.line2?.message}>
          <Input {...register("line2")} placeholder="Suite 12B" />
        </Field>
        <Field label="City" error={errors.city?.message}>
          <Input {...register("city")} placeholder="San Francisco" />
        </Field>
        <Field label="State" error={errors.state?.message}>
          <Input {...register("state")} placeholder="CA" />
        </Field>
        <Field label="Postal code" error={errors.postalCode?.message}>
          <Input {...register("postalCode")} placeholder="94105" />
        </Field>
      </div>

      <Field label="Delivery note" error={errors.note?.message}>
        <Textarea {...register("note")} placeholder="Anything the fulfillment team should know?" />
      </Field>

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full md:w-auto">
        {isSubmitting ? "Preparing checkout..." : "Continue to payment"}
      </Button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}
