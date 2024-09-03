import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const buildFamilyTree = (members) => {
  const memberMap = new Map(members.map(member => [member.id, { ...member, children: [] }]));
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

const FamilyMember = ({ member, allMembers }) => {
  const spouse = member.spouseId ? allMembers.find(m => m.id === member.spouseId) : null;

  return (
    <div className="relative">
      <div className="flex items-center">
        <Link to={`/edit-member/${member.id}`}>
          <Card className="w-48 m-2 hover:shadow-md transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-sm">{`${member.firstName} ${member.lastName || ''}`}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Kön: {member.gender === 'male' ? 'Man' : 'Kvinna'}</p>
              {member.birthDate && <p className="text-xs text-muted-foreground">Född: {member.birthDate}</p>}
              {member.isDeceased && member.deathDate && <p className="text-xs text-muted-foreground">Död: {member.deathDate}</p>}
            </CardContent>
          </Card>
        </Link>
        {spouse && (
          <>
            <div className="w-8 h-px bg-gray-300"></div>
            <Link to={`/edit-member/${spouse.id}`}>
              <Card className="w-48 m-2 hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-sm">{`${spouse.firstName} ${spouse.lastName || ''}`}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">Kön: {spouse.gender === 'male' ? 'Man' : 'Kvinna'}</p>
                  {spouse.birthDate && <p className="text-xs text-muted-foreground">Född: {spouse.birthDate}</p>}
                  {spouse.isDeceased && spouse.deathDate && <p className="text-xs text-muted-foreground">Död: {spouse.deathDate}</p>}
                </CardContent>
              </Card>
            </Link>
          </>
        )}
      </div>
      {member.children && member.children.length > 0 && (
        <div className="flex flex-col items-center mt-4">
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="flex">
            {member.children.map((child, index) => (
              <div key={child.id} className="relative">
                {index > 0 && <div className="absolute top-0 left-0 w-full h-px bg-gray-300" style={{ top: '-1rem' }}></div>}
                <FamilyMember member={child} allMembers={allMembers} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const FamilyTree = () => {
  const [zoom, setZoom] = useState(100);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
    setFamilyMembers(storedMembers);
  }, []);

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
      <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }} className="transition-transform duration-300 flex justify-center">
        <div className="flex flex-col items-center">
          {familyTree.map(rootMember => (
            <FamilyMember key={rootMember.id} member={rootMember} allMembers={familyMembers} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;