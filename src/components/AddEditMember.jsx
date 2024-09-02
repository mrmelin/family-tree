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
import { Checkbox } from "@/components/ui/checkbox";
import { db } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";

const memberSchema = z.object({
  firstName: z.string().min(2, { message: "Förnamnet måste vara minst 2 tecken." }),
  lastName: z.string().optional(),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional().or(z.literal('')),
  birthPlace: z.string().optional(),
  isDeceased: z.boolean().default(false),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional().or(z.literal('')),
  deathPlace: z.string().optional(),
  bio: z.string().max(500, { message: "Biografin får inte överstiga 500 tecken." }).optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
  childrenIds: z.array(z.string()).optional(),
});

const fetchMember = async (id) => {
  const snapshot = await get(ref(db, `members/${id}`));
  return snapshot.val();
};

const fetchAllMembers = async () => {
  const snapshot = await get(ref(db, 'members'));
  return snapshot.val() || {};
};

const saveMember = async (data) => {
  const memberId = data.id || Date.now().toString();
  await set(ref(db, `members/${memberId}`), { ...data, id: memberId });
  return { ...data, id: memberId };
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

  const { data: allMembers = {} } = useQuery({
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
      isDeceased: false,
      deathDate: "",
      deathPlace: "",
      bio: "",
      fatherId: "",
      motherId: "",
      childrenIds: [],
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
              name="isDeceased"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Den här personen är avliden
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            {form.watch("isDeceased") && (
              <>
                <FormField
                  control={form.control}
                  name="deathDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dödsdatum</FormLabel>
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
                      <FormLabel>Dödsort</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj far" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Ingen far</SelectItem>
                      {Object.values(allMembers).map((member) => (
                        <SelectItem key={member.id} value={member.id}>{`${member.firstName} ${member.lastName}`}</SelectItem>
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
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj mor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Ingen mor</SelectItem>
                      {Object.values(allMembers).map((member) => (
                        <SelectItem key={member.id} value={member.id}>{`${member.firstName} ${member.lastName}`}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="childrenIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barn</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange([...field.value, value])}
                      value=""
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Lägg till barn" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(allMembers)
                          .filter((member) => !field.value.includes(member.id))
                          .map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {`${member.firstName} ${member.lastName}`}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="mt-2">
                    {field.value.map((childId) => (
                      <div key={childId} className="flex items-center space-x-2 mt-1">
                        <span>{`${allMembers[childId]?.firstName} ${allMembers[childId]?.lastName}`}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => field.onChange(field.value.filter((id) => id !== childId))}
                        >
                          Ta bort
                        </Button>
                      </div>
                    ))}
                  </div>
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