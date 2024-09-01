import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Fetch family members from local storage or initialize with default members
const fetchFamilyTree = async () => {
  let storedMembers = localStorage.getItem('familyMembers');
  if (!storedMembers) {
    const defaultMembers = [
      { id: "1", firstName: "Birgitta", lastName: "Melin", birthDate: "1963-01-01", fatherId: null, motherId: null },
      { id: "2", firstName: "Peter", lastName: "Melin", birthDate: "1961-01-01", fatherId: null, motherId: null },
      { id: "3", firstName: "Ola", lastName: "Melin", birthDate: "1987-01-01", fatherId: "2", motherId: "1" },
      { id: "4", firstName: "Elin", lastName: "Melin", birthDate: "1989-01-01", fatherId: "2", motherId: "1" },
      { id: "5", firstName: "Filip", lastName: "Melin", birthDate: "1991-01-01", fatherId: "2", motherId: "1" },
    ];
    localStorage.setItem('familyMembers', JSON.stringify(defaultMembers));
    storedMembers = JSON.stringify(defaultMembers);
  }
  return JSON.parse(storedMembers);
};

const FamilyMember = ({ member }) => (
  <Link to={`/edit-member/${member.id}`}>
    <Card className="w-48 m-2 hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-sm">{`${member.firstName} ${member.lastName || ''}`}</CardTitle>
      </CardHeader>
      <CardContent>
        {member.birthDate && <p className="text-xs text-muted-foreground">Född: {member.birthDate}</p>}
        <p className="text-xs text-blue-500 mt-2">Klicka för att redigera</p>
      </CardContent>
    </Card>
  </Link>
);

const renderFamilyTree = (node, members) => (
  <div key={node.id} className="flex flex-col items-center">
    <FamilyMember member={node} />
    {node.children && node.children.length > 0 && (
      <div className="flex">
        {node.children.map(childId => renderFamilyTree(members.find(m => m.id === childId), members))}
      </div>
    )}
  </div>
);

const buildFamilyTree = (members) => {
  const memberMap = new Map(members.map(m => [m.id, { ...m, children: [] }]));
  const rootMembers = [];

  members.forEach(member => {
    if (member.fatherId && memberMap.has(member.fatherId)) {
      memberMap.get(member.fatherId).children.push(member.id);
    } else if (member.motherId && memberMap.has(member.motherId)) {
      memberMap.get(member.motherId).children.push(member.id);
    } else {
      rootMembers.push(member.id);
    }
  });

  return { rootMembers, memberMap };
};

const FamilyTree = () => {
  const [zoom, setZoom] = useState(100);
  const { data: familyMembers, isLoading, error } = useQuery({
    queryKey: ['familyTree'],
    queryFn: fetchFamilyTree,
  });

  if (isLoading) return <div>Laddar...</div>;
  if (error) return <div>Fel: {error.message}</div>;

  const { rootMembers, memberMap } = buildFamilyTree(familyMembers);

  return (
    <div className="relative">
      <div className="mb-4 flex justify-between items-center">
        <Link to="/add-member">
          <Button variant="outline">Lägg till ny medlem</Button>
        </Link>
        <div className="flex space-x-2">
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
      </div>
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} className="transition-transform duration-300">
        {rootMembers.map(rootMemberId => renderFamilyTree(memberMap.get(rootMemberId), familyMembers))}
      </div>
    </div>
  );
};

export default FamilyTree;
