import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock API call - replace with actual API call
const fetchTimelineEvents = async () => {
  const familyMembers = JSON.parse(localStorage.getItem('familyMembers') || '[]');
  return familyMembers
    .filter(member => member.birthDate) // Only include members with a birth date
    .map(member => ({
      id: member.id,
      date: member.birthDate,
      event: `${member.firstName} ${member.lastName} född`,
      type: "birth"
    }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));
};

const Timeline = () => {
  const { data: events, isLoading, error } = useQuery({
    queryKey: ['timelineEvents'],
    queryFn: fetchTimelineEvents,
  });

  if (isLoading) return <div>Laddar...</div>;
  if (error) return <div>Fel: {error.message}</div>;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Familjetidslinje</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-24 text-sm text-muted-foreground">
                {event.date}
              </div>
              <div className={`w-3 h-3 rounded-full ${getEventColor(event.type)}`} />
              <div className="flex-grow">
                <p>{event.event}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const getEventColor = (type) => {
  switch (type) {
    case 'birth':
      return 'bg-green-500';
    case 'marriage':
      return 'bg-blue-500';
    case 'death':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

export default Timeline;
