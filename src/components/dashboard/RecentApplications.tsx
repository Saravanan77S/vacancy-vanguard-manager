
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Applicant } from "@/lib/mock-data";

interface RecentApplicationsProps {
  applications: Applicant[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`/placeholder.svg`} />
                <AvatarFallback>{application.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{application.name}</p>
                  <StatusBadge status={application.status} />
                </div>
                <p className="text-xs text-muted-foreground truncate">
                  Applied {formatDate(application.appliedDate)} • {application.experience} years exp
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
}

function StatusBadge({ status }: { status: Applicant['status'] }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  
  switch (status) {
    case "Hired":
      variant = "default";
      break;
    case "Shortlisted":
      variant = "secondary";
      break;
    case "Rejected":
      variant = "destructive";
      break;
    default:
      variant = "outline";
  }
  
  return <Badge variant={variant}>{status}</Badge>;
}
