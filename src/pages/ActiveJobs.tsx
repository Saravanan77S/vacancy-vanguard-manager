
import { Link } from "react-router-dom";
import { Calendar, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Job, getActiveJobs } from "@/lib/mock-data";
import { useState } from "react";

const ActiveJobs = () => {
  const activeJobs = getActiveJobs();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredJobs = activeJobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Active Jobs</h1>
          <p className="text-muted-foreground">
            Currently open positions that are accepting applications.
          </p>
        </div>
        <Button asChild>
          <Link to="/create-job">
            Create New Job
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search active jobs..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <ActiveJobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No active jobs found</h3>
          <p className="text-muted-foreground mt-2 mb-4">
            {searchQuery 
              ? "Try adjusting your search term" 
              : "Create your first job posting or publish an existing draft"}
          </p>
          <Button asChild>
            <Link to="/create-job">
              Create New Job
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

interface ActiveJobCardProps {
  job: Job;
}

function ActiveJobCard({ job }: ActiveJobCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-xl">{job.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{job.type}</Badge>
            <Badge variant="outline">{job.location}</Badge>
            {job.remote && <Badge variant="outline">Remote</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {job.description}
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Key Requirements</h3>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              {job.requirements.slice(0, 3).map((req, index) => (
                <li key={index} className="line-clamp-1">{req}</li>
              ))}
              {job.requirements.length > 3 && (
                <li className="text-primary">+{job.requirements.length - 3} more</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t p-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Deadline: {formatDate(job.deadline)}
            </span>
          </div>
          <div className="flex items-center">
            <Users className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {job.applicantsCount} applicants
            </span>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Link to={`/jobs/${job.id}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full">View Details</Button>
          </Link>
          <Link to={`/applications?jobId=${job.id}`} className="w-full sm:w-auto">
            <Button className="w-full">View Applications</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(date);
}

export default ActiveJobs;
