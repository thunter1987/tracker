"use client";

import { TextField, Button, Callout } from "@radix-ui/themes";
import SimpleMDE from "react-simplemde-editor";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIssueSchema } from "@/app/createIssueSchema";
import { z } from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import ButtonSpinner from "@/app/components/ButtonSpinner";

type IssueForm = z.infer<typeof createIssueSchema>;

export const NewIssuePage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (error) {
      setIsLoading(false);
      setError("An unexpected error occured.");
    }
  });

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form className="space-y-3" onSubmit={onSubmit}>
        <TextField.Root>
          <TextField.Input placeholder="Title" {...register("title")} />
        </TextField.Root>
        <ErrorMessage>{errors.title?.message}</ErrorMessage>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        />
        <ErrorMessage>{errors.description?.message}</ErrorMessage>
        {isLoading ? <ButtonSpinner /> : <Button>Submit New Issue</Button>}
      </form>
    </div>
  );
}
