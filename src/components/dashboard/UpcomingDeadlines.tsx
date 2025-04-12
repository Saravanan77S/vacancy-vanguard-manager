
import { CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Job } from "@/lib/mock-data";
import { Link } from "react-router-dom";

interface UpcomingDeadlinesProps {
  jobs: Job[];
}

export function UpcomingDeadlines({ jobs }: UpcomingDeadlinesProps) {
  // Sort jobs by deadline (closest first)
  const sortedJobs = [...jobs]
    .filter((job) => job.status === "Published")
    .sort((a, b) => a.deadline.getTime() - b.deadline.getTime())
    .slice(0, 5); // Show only 5 upcoming deadlines

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Deadlines</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedJobs.map((job) => (
            <Link to={`/jobs/${job.id}`} key={job.id} className="block">
              <div className="flex items-start space-x-3 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                  <CalendarIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium group-hover:text-purple-600 transition-colors">
                    {job.title}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>
                      Deadline: {formatDate(job.deadline)} ({getDaysUntil(job.deadline)})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          {sortedJobs.length === 0 && (
            <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
          )}
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

function getDaysUntil(date: Date): string {
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  return `${diffDays} days left`;
}
