
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, doc, updateDoc, where, orderBy, DocumentData } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

// Allowed admin emails - in a real app this would be secured through Firebase rules
const ADMIN_EMAILS = ['admin@example.com'];

type WaitlistUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Redirect if not authenticated or not an admin
    if (!loading && (!isAuthenticated || !ADMIN_EMAILS.includes(user?.email || ''))) {
      navigate('/');
      toast.error('You do not have permission to access this page');
    } else if (!loading && isAuthenticated) {
      fetchWaitlist();
    }
  }, [isAuthenticated, loading, navigate, user]);

  const fetchWaitlist = async () => {
    try {
      setIsLoading(true);
      const q = query(collection(db, "waitlist"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const users: WaitlistUser[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          status: data.status || 'pending'
        });
      });
      
      setWaitlistUsers(users);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      toast.error("Failed to fetch waitlist");
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (user: WaitlistUser) => {
    try {
      // Update waitlist status
      await updateDoc(doc(db, "waitlist", user.id), {
        status: 'approved'
      });

      // Check if user already exists in users collection
      const userQuery = query(collection(db, "users"), where("email", "==", user.email));
      const userDocs = await getDocs(userQuery);
      
      if (!userDocs.empty) {
        // Update existing user
        userDocs.forEach(async (docSnapshot) => {
          await updateDoc(doc(db, "users", docSnapshot.id), {
            isApproved: true
          });
        });
      }
      
      toast.success(`${user.name} has been approved`);
      fetchWaitlist(); // Refresh the list
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const rejectUser = async (user: WaitlistUser) => {
    try {
      await updateDoc(doc(db, "waitlist", user.id), {
        status: 'rejected'
      });
      
      toast.success(`${user.name} has been rejected`);
      fetchWaitlist(); // Refresh the list
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user");
    }
  };

  if (loading || isLoading) {
    return (
      <div className="container py-10 flex justify-center items-center min-h-[50vh]">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !ADMIN_EMAILS.includes(user?.email || '')) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Waitlist Management</h1>
      
      {waitlistUsers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No users in the waitlist</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waitlistUsers.map((waitlistUser) => (
                <TableRow key={waitlistUser.id}>
                  <TableCell className="font-medium">{waitlistUser.name}</TableCell>
                  <TableCell>{waitlistUser.email}</TableCell>
                  <TableCell>{new Date(waitlistUser.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {waitlistUser.status === 'pending' && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {waitlistUser.status === 'approved' && (
                      <Badge className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                    {waitlistUser.status === 'rejected' && (
                      <Badge variant="destructive" className="bg-red-50 text-red-700 border-red-200">
                        <XCircle className="h-3 w-3 mr-1" />
                        Rejected
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {waitlistUser.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => approveUser(waitlistUser)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive" 
                            onClick={() => rejectUser(waitlistUser)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {waitlistUser.status !== 'pending' && (
                        <span className="text-sm text-muted-foreground">No actions available</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Admin;
