import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock API call - replace with actual API call
const fetchTimelineEvents = async () => {
  // Simulated API response
  return [
    { id: 1, date: "1980-01-01", event: "John Doe född", type: "birth" },
    { id: 2, date: "1982-03-15", event: "Jane Smith född", type: "birth" },
    { id: 3, date: "2005-06-15", event: "John Doe och Jane Smith gifter sig", type: "marriage" },
    { id: 4, date: "2010-05-15", event: "Jack Doe född", type: "birth" },
    { id: 5, date: "2012-09-20", event: "Jill Doe född", type: "birth" },
    { id: 6, date: "2020-09-01", event: "Familjen flyttar till Stockholm", type: "event" },
  ];
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
