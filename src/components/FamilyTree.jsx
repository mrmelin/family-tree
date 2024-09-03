import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZoomIn, ZoomOut, Maximize2, User, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const spouse = member.spouseId ? allMembers.find(m => m.id === member.spouseId) : null;
  const navigate = useNavigate();

  const handleDelete = () => {
    onDelete(member.id);
  };

  return (
    <div className="relative">
      <div className="flex items-center">
        <Card className="w-48 m-2 hover:shadow-md transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">{`${member.firstName} ${member.lastName || ''}`}</CardTitle>
            <span className="text-sm font-bold">{member.gender === 'male' ? '♂' : '♀'}</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <User className="h-4 w-4 mr-2" />
              <p className="text-xs text-muted-foreground">{member.gender === 'male' ? 'Man' : 'Kvinna'}</p>
            </div>
            {member.birthDate && <p className="text-xs text-muted-foreground">Född: {member.birthDate}</p>}
            {member.isDeceased && member.deathDate && <p className="text-xs text-muted-foreground">Död: {member.deathDate}</p>}
            <div className="flex justify-between mt-2">
              <Button variant="outline" size="sm" onClick={() => navigate(`/edit-member/${member.id}`)}>
                Redigera
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Är du säker?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Detta kommer att permanent ta bort familjemedlemmen och kan inte ångras.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Avbryt</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Ta bort</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
        {spouse && (
          <>
            <div className="w-8 h-px bg-gray-300"></div>
            <FamilyMember member={spouse} allMembers={allMembers} onDelete={onDelete} />
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

  useEffect(() => {
    const storedMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
    setFamilyMembers(storedMembers);
  }, []);

  const handleDeleteMember = (memberId) => {
    const updatedMembers = familyMembers.filter(member => member.id !== memberId);
    setFamilyMembers(updatedMembers);
    localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
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
            <FamilyMember key={rootMember.id} member={rootMember} allMembers={familyMembers} onDelete={handleDeleteMember} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;