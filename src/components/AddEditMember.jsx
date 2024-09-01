import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const memberSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Use YYYY-MM-DD format." }),
  birthPlace: z.string().min(2, { message: "Birth place must be at least 2 characters." }),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Use YYYY-MM-DD format." }).optional().or(z.literal('')),
  deathPlace: z.string().min(2, { message: "Death place must be at least 2 characters." }).optional(),
  bio: z.string().max(500, { message: "Bio must not exceed 500 characters." }).optional(),
});

// Mock API calls - replace with actual API calls
const fetchMember = async (id) => {
  // Simulated API response for editing
  return {
    id,
    name: "John Doe",
    birthDate: "1980-01-01",
    birthPlace: "New York, USA",
    deathDate: "",
    deathPlace: "",
    bio: "John is a family historian.",
  };
};

const saveMember = async (data) => {
  // Simulated API call to save member
  console.log("Saving member:", data);
  return { id: "new-id", ...data };
};

const AddEditMember = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingMember, isLoading: isLoadingMember } = useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchMember(id),
    enabled: isEditing,
  });

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: isEditing ? existingMember : {
      name: "",
      birthDate: "",
      birthPlace: "",
      deathDate: "",
      deathPlace: "",
      bio: "",
    },
  });

  const mutation = useMutation({
    mutationFn: saveMember,
    onSuccess: () => {
      // Handle successful save (e.g., show a success message, redirect)
      console.log("Member saved successfully");
      setIsSubmitting(false);
    },
    onError: (error) => {
      // Handle error (e.g., show error message)
      console.error("Error saving member:", error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  if (isEditing && isLoadingMember) return <div>Loading...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit Family Member" : "Add New Family Member"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="YYYY-MM-DD" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Place</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deathDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Death Date (if applicable)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="YYYY-MM-DD" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deathPlace"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Death Place (if applicable)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Brief biography (max 500 characters)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Member"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddEditMember;