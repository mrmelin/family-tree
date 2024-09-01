import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const memberSchema = z.object({
  firstName: z.string().min(2, { message: "Förnamnet måste vara minst 2 tecken." }),
  lastName: z.string().min(2, { message: "Efternamnet måste vara minst 2 tecken." }),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional(),
  birthPlace: z.string().min(2, { message: "Födelseorten måste vara minst 2 tecken." }).optional(),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional().or(z.literal('')),
  deathPlace: z.string().min(2, { message: "Dödsorten måste vara minst 2 tecken." }).optional(),
  bio: z.string().max(500, { message: "Biografin får inte överstiga 500 tecken." }).optional(),
  fatherId: z.string(),
  motherId: z.string(),
});

// Mock API calls - replace with actual API calls
const fetchMember = async (id) => {
  // Simulated API response for editing
  return {
    id,
    name: "John Doe",
    birthDate: "1980-01-01",
    birthPlace: "Stockholm, Sverige",
    deathDate: "",
    deathPlace: "",
    bio: "John är en familjehistoriker.",
    fatherId: "father-id",
    motherId: "mother-id",
  };
};

const fetchAllMembers = async () => {
  // Simulated API call to fetch all members
  return [
    { id: "1", name: "John Doe" },
    { id: "2", name: "Jane Doe" },
    // ... more members
  ];
};

const saveMember = async (data) => {
  // In a real application, this would be an API call
  const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
  const newMember = {
    id: Date.now().toString(), // Generate a unique ID
    ...data
  };
  const updatedMembers = [...storedMembers, newMember];
  localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
  return newMember;
};

const AddEditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingMember, isLoading: isLoadingMember } = useQuery({
    queryKey: ['member', id],
    queryFn: () => fetchMember(id),
    enabled: isEditing,
  });

  const { data: allMembers = [] } = useQuery({
    queryKey: ['allMembers'],
    queryFn: fetchAllMembers,
  });

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      birthPlace: "",
      deathDate: "",
      deathPlace: "",
      bio: "",
      fatherId: "",
      motherId: "",
    },
  });

  useEffect(() => {
    if (isEditing && existingMember) {
      form.reset(existingMember);
    }
  }, [isEditing, existingMember, form]);

  const mutation = useMutation({
    mutationFn: saveMember,
    onSuccess: () => {
      console.log("Medlem sparad framgångsrikt");
      setIsSubmitting(false);
      queryClient.invalidateQueries(['allMembers']);
      queryClient.invalidateQueries(['familyTree']);
      navigate('/');
    },
    onError: (error) => {
      console.error("Fel vid sparande av medlem:", error);
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    mutation.mutate(data);
  };

  if (isEditing && isLoadingMember) return <div>Laddar...</div>;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? "Redigera familjemedlem" : "Lägg till ny familjemedlem"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Förnamn</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Efternamn</FormLabel>
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
                  <FormLabel>Födelsedatum (valfritt)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ÅÅÅÅ-MM-DD" />
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
                  <FormLabel>Födelseort</FormLabel>
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
                  <FormLabel>Dödsdatum (om tillämpligt)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ÅÅÅÅ-MM-DD" />
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
                  <FormLabel>Dödsort (om tillämpligt)</FormLabel>
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
                  <FormLabel>Biografi</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>Kort biografi (max 500 tecken)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fatherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Far</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj far" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="motherId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mor</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj mor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sparar..." : "Spara medlem"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddEditMember;
