import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Mock API call - replace with actual API call
const fetchFamilyTree = async () => {
  // Simulated API response
  return [
    {
      id: "1",
      name: "John Doe",
      birthDate: "1980-01-01",
      fatherId: null,
      motherId: null,
    },
    {
      id: "2",
      name: "Jane Doe",
      birthDate: "1982-03-15",
      fatherId: null,
      motherId: null,
    },
    {
      id: "3",
      name: "Jack Doe",
      birthDate: "2010-05-15",
      fatherId: "1",
      motherId: "2",
    },
    {
      id: "4",
      name: "Jill Doe",
      birthDate: "2012-09-20",
      fatherId: "1",
      motherId: "2",
    },
  ];
};

const FamilyMember = ({ member }) => (
  <Card className="w-48 m-2">
    <CardHeader>
      <CardTitle className="text-sm">{member.name}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-xs text-muted-foreground">Född: {member.birthDate}</p>
      <Link to={`/member/${member.id}`}>
        <Button variant="link" size="sm" className="p-0">Visa detaljer</Button>
      </Link>
    </CardContent>
  </Card>
);

const FamilyTree = () => {
  const [zoom, setZoom] = useState(100);
  const { data: familyMembers, isLoading, error } = useQuery({
    queryKey: ['familyTree'],
    queryFn: fetchFamilyTree,
  });

  if (isLoading) return <div>Laddar...</div>;
  if (error) return <div>Fel: {error.message}</div>;

  const buildFamilyTree = (members) => {
    const memberMap = new Map(members.map(m => [m.id, { ...m, children: [] }]));
    const rootMembers = [];

    memberMap.forEach(member => {
      if (member.fatherId && memberMap.has(member.fatherId)) {
        memberMap.get(member.fatherId).children.push(member);
      } else if (member.motherId && memberMap.has(member.motherId)) {
        memberMap.get(member.motherId).children.push(member);
      } else {
        rootMembers.push(member);
      }
    });

    return rootMembers;
  };

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

  const familyTree = buildFamilyTree(familyMembers);

  return (
    <div className="relative">
      <div className="mb-4 flex justify-end space-x-2">
        <Button variant="outline" size="icon" onClick={() => setZoom(zoom - 10)} aria-label="Zooma ut">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(100)} aria-label="Återställ zoom">
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(zoom + 10)} aria-label="Zooma in">
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} className="transition-transform duration-300">
        {familyTree.map(rootMember => renderFamilyTree(rootMember))}
      </div>
    </div>
  );
};

export default FamilyTree;
