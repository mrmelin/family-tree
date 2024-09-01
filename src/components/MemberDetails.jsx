import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

// Mock API call - replace with actual API call
const fetchMemberDetails = async (id) => {
  // Simulated API response
  return {
    id,
    name: "John Doe",
    birthDate: "1980-01-01",
    birthPlace: "New York, USA",
    deathDate: null,
    deathPlace: null,
    marriages: [
      { spouse: "Jane Smith", date: "2005-06-15", place: "Los Angeles, USA" }
    ],
    children: [
      { id: "3", name: "Sarah Doe" },
      { id: "4", name: "Mike Doe" }
    ],
    photos: [
      { id: "1", url: "/placeholder.svg", caption: "John's wedding" }
    ],
    contactDetails: {
      email: "john.doe@example.com",
      phone: "+1 234 567 8900"
    },
    tags: ["Historian", "Veteran"]
  };
};

const MemberDetails = () => {
  const { id } = useParams();
  const { data: member, isLoading, error } = useQuery({
    queryKey: ['memberDetails', id],
    queryFn: () => fetchMemberDetails(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{member.name}</CardTitle>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Personal Information</h3>
            <p>Born: {member.birthDate} in {member.birthPlace}</p>
            {member.deathDate && (
              <p>Died: {member.deathDate} in {member.deathPlace}</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold">Marriages</h3>
            {member.marriages.map((marriage, index) => (
              <p key={index}>
                Married to {marriage.spouse} on {marriage.date} in {marriage.place}
              </p>
            ))}
          </div>
          <div>
            <h3 className="font-semibold">Children</h3>
            <ul>
              {member.children.map(child => (
                <li key={child.id}>{child.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Contact Details</h3>
            <p>Email: {member.contactDetails.email}</p>
            <p>Phone: {member.contactDetails.phone}</p>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Photos</h3>
          <div className="flex space-x-2 mt-2">
            {member.photos.map(photo => (
              <img key={photo.id} src={photo.url} alt={photo.caption} className="w-24 h-24 object-cover rounded" />
            ))}
          </div>
        </div>
        <div className="mt-4">
          <h3 className="font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {member.tags.map(tag => (
              <span key={tag} className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberDetails;