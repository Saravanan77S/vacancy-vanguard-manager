
import { useState } from "react";
import { 
  AlertCircle, 
  Bug, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Search, 
  Settings 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  generateMockReports, 
  Report, 
  ReportStatus, 
  ReportType 
} from "@/lib/mock-data";
import { toast } from "sonner";

const Reports = () => {
  const [reports] = useState<Report[]>(generateMockReports(8));
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all");
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ReportType>("Technical Issue");
  
  // Filter reports based on search query and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Group reports by status
  const groupedReports = {
    all: filteredReports,
    new: filteredReports.filter(report => report.status === "New"),
    inProgress: filteredReports.filter(report => report.status === "In Progress"),
    resolved: filteredReports.filter(report => report.status === "Resolved"),
    closed: filteredReports.filter(report => report.status === "Closed"),
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, we would send this to the server
    toast.success("Report submitted successfully");
    
    // Reset form
    setTitle("");
    setDescription("");
    setType("Technical Issue");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Issues</h1>
        <p className="text-muted-foreground">
          Submit and track reports or issues you've encountered.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Submit a New Report</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  placeholder="Brief description of the issue"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide details about the issue..."
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Report Type</Label>
                <Select 
                  value={type} 
                  onValueChange={(value) => setType(value as ReportType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                    <SelectItem value="Feature Request">Feature Request</SelectItem>
                    <SelectItem value="Candidate Issue">Candidate Issue</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Submit Report</Button>
            </CardFooter>
          </form>
        </Card>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | "all")}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ReportType | "all")}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Technical Issue">Technical Issue</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="Candidate Issue">Candidate Issue</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            {Object.entries(groupedReports).map(([status, reports]) => (
              <TabsContent key={status} value={status} className="space-y-4 mt-4">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No reports found</h3>
                    <p className="text-muted-foreground">
                      {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                        ? "Try adjusting your filters"
                        : "Submit your first report"}
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface ReportCardProps {
  report: Report;
}

function ReportCard({ report }: ReportCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <ReportTypeIcon type={report.type} />
            <CardTitle className="text-base">{report.title}</CardTitle>
          </div>
          <ReportStatusBadge status={report.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-2">
          {expanded 
            ? report.description 
            : `${report.description.substring(0, 100)}${report.description.length > 100 ? '...' : ''}`}
        </div>
        {report.description.length > 100 && (
          <Button 
            variant="ghost" 
            className="p-0 h-auto text-sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Show less" : "Show more"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        Submitted on {formatDate(report.createdDate)}
        {report.status !== "New" && (
          <span className="ml-2">
            • Last updated on {formatDate(report.updatedDate)}
          </span>
        )}
      </CardFooter>
    </Card>
  );
}

function ReportTypeIcon({ type }: { type: ReportType }) {
  switch (type) {
    case "Technical Issue":
      return <Bug className="h-4 w-4 text-red-500" />;
    case "Feature Request":
      return <Settings className="h-4 w-4 text-purple-500" />;
    case "Candidate Issue":
      return <AlertCircle className="h-4 w-4 text-amber-500" />;
    default:
      return <FileText className="h-4 w-4 text-blue-500" />;
  }
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
  let icon = null;
  
  switch (status) {
    case "New":
      variant = "outline";
      icon = <FileText className="mr-1 h-3 w-3" />;
      break;
    case "In Progress":
      variant = "secondary";
      icon = <Clock className="mr-1 h-3 w-3" />;
      break;
    case "Resolved":
      variant = "default";
      icon = <CheckCircle2 className="mr-1 h-3 w-3" />;
      break;
    case "Closed":
      variant = "destructive";
      icon = <AlertCircle className="mr-1 h-3 w-3" />;
      break;
  }
  
  return (
    <Badge variant={variant} className="flex items-center">
      {icon}
      {status}
    </Badge>
  );
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

export default Reports;
