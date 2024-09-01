import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zoom, ZoomIn, ZoomOut } from "lucide-react";

// Mock API call - replace with actual API call
const fetchFamilyTree = async () => {
  // Simulated API response
  return {
    id: "root",
    name: "Family Root",
    children: [
      {
        id: "1",
        name: "John Doe",
        birthDate: "1980-01-01",
        children: [
          { id: "3", name: "Jane Doe", birthDate: "2010-05-15" },
          { id: "4", name: "Jack Doe", birthDate: "2012-09-20" },
        ],
      },
      {
        id: "2",
        name: "Mary Smith",
        birthDate: "1982-03-15",
        children: [
          { id: "5", name: "Sarah Smith", birthDate: "2011-07-10" },
        ],
      },
    ],
  };
};

const FamilyMember = ({ member }) => (
  <Card className="w-48 m-2">
    <CardHeader>
      <CardTitle className="text-sm">{member.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">Born: {member.birthDate}</p>
      <Link to={`/member/${member.id}`}>
        <Button variant="link" size="sm" className="p-0">View Details</Button>
      </Link>
    </CardContent>
  </Card>
);

const FamilyTree = () => {
  const [zoom, setZoom] = useState(100);
  const { data: familyTree, isLoading, error } = useQuery({
    queryKey: ['familyTree'],
    queryFn: fetchFamilyTree,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const renderFamilyTree = (node) => (
    <div key={node.id} className="flex flex-col items-center">
      <FamilyMember member={node} />
      {node.children && node.children.length > 0 && (
        <div className="flex">
          {node.children.map(child => renderFamilyTree(child))}
        </div>
      )}
    </div>
  );

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end space-x-2">
        <Button variant="outline" size="icon" onClick={() => setZoom(zoom - 10)}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(100)}>
          <Zoom className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(zoom + 10)}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} className="transition-transform duration-300">
        {renderFamilyTree(familyTree)}
      </div>
    </div>
  );
};

export default FamilyTree;