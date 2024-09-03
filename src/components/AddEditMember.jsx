import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";

const memberSchema = z.object({
  firstName: z.string().min(2, { message: "Förnamnet måste vara minst 2 tecken." }),
  lastName: z.string().optional(),
  gender: z.enum(["male", "female"]),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional().or(z.literal('')),
  birthPlace: z.string().optional(),
  isDeceased: z.boolean().default(false),
  deathDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Använd formatet ÅÅÅÅ-MM-DD." }).optional().or(z.literal('')),
  deathPlace: z.string().optional(),
  bio: z.string().max(500, { message: "Biografin får inte överstiga 500 tecken." }).optional(),
  fatherId: z.string().nullable().optional(),
  motherId: z.string().nullable().optional(),
  spouseId: z.string().nullable().optional(),
});

const AddEditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allMembers, setAllMembers] = useState([]);
  const isEditing = !!id;

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "male",
      birthDate: "",
      birthPlace: "",
      isDeceased: false,
      deathDate: "",
      deathPlace: "",
      bio: "",
      fatherId: null,
      motherId: null,
      spouseId: null,
    },
  });

  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
    setAllMembers(storedMembers);

    if (isEditing) {
      const memberToEdit = storedMembers.find(member => member.id === id);
      if (memberToEdit) {
        form.reset(memberToEdit);
      }
    }
  }, [isEditing, id, form]);

  const onSubmit = (data) => {
    const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
    let updatedMembers;

    if (isEditing) {
      updatedMembers = storedMembers.map(member => 
        member.id === id ? { ...member, ...data, id } : member
      );
    } else {
      const newMember = { ...data, id: Date.now().toString() };
      updatedMembers = [...storedMembers, newMember];
    }

    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
    toast.success(isEditing ? "Medlem uppdaterad" : "Ny medlem tillagd");
    navigate('/');
  };

  const getPotentialParents = (gender) => {
    return allMembers.filter(member => member.gender === gender);
  };

  const getPotentialSpouses = () => {
    return allMembers.filter(member => member.id !== id);
  };

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
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kön</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj kön" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="male">Man</SelectItem>
                      <SelectItem value="female">Kvinna</SelectItem>
                    </SelectContent>
                  </Select>
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
                      {getPotentialParents("male").map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {`${member.firstName} ${member.lastName}`}
                        </SelectItem>
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
                      {getPotentialParents("female").map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {`${member.firstName} ${member.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="spouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make/Maka</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Välj make/maka" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Ingen make/maka</SelectItem>
                      {getPotentialSpouses().map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {`${member.firstName} ${member.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">
              {isEditing ? "Uppdatera medlem" : "Lägg till medlem"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddEditMember;