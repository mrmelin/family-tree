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
  lastName: z.string().optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional().or(z.literal('')),
  birthPlace: z.string().optional(),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional().or(z.literal('')),
  deathPlace: z.string().optional(),
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
  const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
  let updatedMembers;
  if (data.id) {
    // If the member has an ID, it's an edit operation
    updatedMembers = storedMembers.map(member => 
      member.id === data.id ? { ...member, ...data } : member
    );
  } else {
    // If no ID, it's a new member
    const newMember = {
      id: Date.now().toString(),
      ...data
    };
    updatedMembers = [...storedMembers, newMember];
  }
  localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
  return data.id ? data : updatedMembers[updatedMembers.length - 1];
};

const AddEditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingMember, isLoading: isLoadingMember } = useQuery({
    queryKey: ['member', id],
    queryFn: () => {
      const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
      return storedMembers.find(member => member.id === id) || null;
    },
    enabled: isEditing,
  });

  const { data: allMembers = [] } = useQuery({
    queryKey: ['allMembers'],
    queryFn: () => {
      const members = JSON.parse(localStorage.getItem('familyMembers') || '[]');
      return members.map(member => ({
        id: member.id,
        name: `${member.firstName} ${member.lastName || ''}`.trim()
      }));
    },
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
    if (isEditing) {
      data.id = id;
    }
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj far" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Ingen far</SelectItem>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj mor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Ingen mor</SelectItem>
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
