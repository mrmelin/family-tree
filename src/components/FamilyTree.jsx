import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Maximize2, Male, Female, Trash2 } from "lucide-react";

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

const FamilyMember = ({ member, allMembers, onDelete }) => {
  const navigate = useNavigate();
  const spouse = member.spouseId ? allMembers.find(m => m.id === member.spouseId) : null;

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this family member?")) {
      onDelete(id);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Link to={`/edit-member/${member.id}`}>
          <Card className="w-48 m-2 hover:shadow-md transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between py-2">
              <CardTitle className="text-sm">{`${member.firstName} ${member.lastName || ''}`}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDelete(e, member.id)}
                className="h-6 w-6"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {member.gender === 'male' ? <Male className="h-4 w-4" /> : <Female className="h-4 w-4" />}
                </p>
                {member.birthDate && <p className="text-xs text-muted-foreground">Born: {member.birthDate}</p>}
              </div>
              {member.isDeceased && member.deathDate && <p className="text-xs text-muted-foreground">Died: {member.deathDate}</p>}
            </CardContent>
          </Card>
        </Link>
        {spouse && (
          <>
            <div className="w-8 h-px bg-gray-300"></div>
            <Link to={`/edit-member/${spouse.id}`}>
              <Card className="w-48 m-2 hover:shadow-md transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between py-2">
                  <CardTitle className="text-sm">{`${spouse.firstName} ${spouse.lastName || ''}`}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => handleDelete(e, spouse.id)}
                    className="h-6 w-6"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {spouse.gender === 'male' ? <Male className="h-4 w-4" /> : <Female className="h-4 w-4" />}
                    </p>
                    {spouse.birthDate && <p className="text-xs text-muted-foreground">Born: {spouse.birthDate}</p>}
                  </div>
                  {spouse.isDeceased && spouse.deathDate && <p className="text-xs text-muted-foreground">Died: {spouse.deathDate}</p>}
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
                <FamilyMember member={child} allMembers={allMembers} onDelete={onDelete} />
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
  const navigate = useNavigate();

  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
    setFamilyMembers(storedMembers);
  }, []);

  const handleDelete = (id) => {
    const updatedMembers = familyMembers.filter(member => member.id !== id);
    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
    setFamilyMembers(updatedMembers);
    navigate('/');
  };

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
            <FamilyMember key={rootMember.id} member={rootMember} allMembers={familyMembers} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;