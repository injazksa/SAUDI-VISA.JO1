import React, { useState, useEffect } from 'react';
import { db } from '@/db/api';
import { ContactSubmission } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Calendar, User, MessageSquare } from 'lucide-react';

const AdminContact: React.FC = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const { data } = await db.getContactSubmissions();
    setSubmissions(data);
    setLoading(false);
  };

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-1">
         <h1 className="text-3xl font-bold text-primary flex items-center space-x-3 rtl:space-x-reverse">
           <Mail size={32} />
           <span>Contact Submissions</span>
         </h1>
         <p className="text-muted-foreground">View and manage messages from your website visitors.</p>
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-1/2">Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8">No submissions yet.</TableCell></TableRow>
            ) : (
              submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                       <Calendar size={14} />
                       <span>{new Date(s.created_at).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                     <div className="flex items-center space-x-2 rtl:space-x-reverse">
                       <User size={14} className="text-muted-foreground" />
                       <span>{s.name}</span>
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex items-center space-x-2 rtl:space-x-reverse">
                       <Mail size={14} className="text-muted-foreground" />
                       <a href={`mailto:${s.email}`} className="text-primary hover:underline">{s.email}</a>
                     </div>
                  </TableCell>
                  <TableCell>
                     <div className="flex space-x-2 rtl:space-x-reverse items-start p-2 bg-muted/30 rounded-lg">
                        <MessageSquare size={14} className="text-muted-foreground mt-1 shrink-0" />
                        <p className="text-sm whitespace-pre-wrap">{s.message}</p>
                     </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminContact;
