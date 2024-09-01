import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

// Mock API call - replace with actual API call
const fetchMediaItems = async () => {
  // Simulated API response
  return [
    { id: 1, url: "/placeholder.svg", caption: "Family Reunion 2020", type: "image" },
    { id: 2, url: "/placeholder.svg", caption: "Wedding of John and Jane", type: "image" },
    { id: 3, url: "/placeholder.svg", caption: "Birth of Sarah", type: "image" },
    { id: 4, url: "/placeholder.svg", caption: "Grandpa's 90th Birthday", type: "image" },
  ];
};

const MediaGallery = () => {
  const { data: mediaItems, isLoading, error } = useQuery({
    queryKey: ['mediaItems'],
    queryFn: fetchMediaItems,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Media Gallery</CardTitle>
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Media
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="relative group">
              <img src={item.url} alt={item.caption} className="w-full h-48 object-cover rounded-md" />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2">
                <p className="text-white text-sm">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaGallery;