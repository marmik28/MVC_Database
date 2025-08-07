import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, MapPin, User, FileText } from "lucide-react";
import { format } from "date-fns";

interface EmailLog {
  id: number;
  emailDate: string;
  senderLocationId: number;
  receiverEmail: string;
  subject: string;
  bodySnippet: string;
  senderLocation?: {
    name: string;
    type: string;
  };
}

export default function EmailLogs() {
  const { data: emailLogs, isLoading } = useQuery<EmailLog[]>({
    queryKey: ["/api/email-logs"],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Email Logs</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Email Logs</h1>
        </div>
        <Badge variant="secondary" className="text-sm">
          <FileText className="h-4 w-4 mr-1" />
          {emailLogs?.length || 0} emails sent
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>System Email History</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!emailLogs || emailLogs.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No emails sent yet
              </h3>
              <p className="text-muted-foreground">
                Email logs will appear here when the system sends automated notifications.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Date Sent</span>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[150px]">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>Sender Location</span>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[200px]">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>Receiver</span>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[250px]">
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>Subject</span>
                      </div>
                    </TableHead>
                    <TableHead className="min-w-[200px]">Preview</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailLogs.map((log) => (
                    <TableRow key={log.id} data-testid={`email-log-row-${log.id}`}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {format(new Date(log.emailDate), "MMM dd, yyyy")}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(log.emailDate), "h:mm a")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {log.senderLocation?.name || "Unknown Location"}
                          </span>
                          <Badge 
                            variant={log.senderLocation?.type === "Head" ? "default" : "secondary"}
                            className="w-fit text-xs"
                          >
                            {log.senderLocation?.type || "Unknown"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-mono text-sm">
                            {log.receiverEmail}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-sm leading-relaxed">
                          {log.subject}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="text-sm text-muted-foreground truncate">
                            {log.bodySnippet}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}