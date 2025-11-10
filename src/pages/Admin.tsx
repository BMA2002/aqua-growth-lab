import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Users, FileText, Trash2, ArrowLeft, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UserData {
  id: string;
  email: string;
  created_at: string;
  validationCount: number;
}

const Admin = () => {
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalValidations: 0,
    totalContainers: 0,
  });

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      toast.error('Access denied', {
        description: 'You do not have admin privileges',
      });
      navigate('/');
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all validation history
      const { data: validations, error: validError } = await supabase
        .from('validation_history')
        .select('user_id, total_containers');

      if (validError) throw validError;

      // Calculate stats
      const userMap = new Map<string, number>();
      let totalContainers = 0;

      validations?.forEach((v) => {
        userMap.set(v.user_id, (userMap.get(v.user_id) || 0) + 1);
        totalContainers += v.total_containers || 0;
      });

      setStats({
        totalUsers: userMap.size,
        totalValidations: validations?.length || 0,
        totalContainers,
      });

      // Fetch user emails from auth.users (via RPC or pre-fetched data)
      // Note: We can't directly query auth.users, so we'll use the user_id
      const usersData: UserData[] = Array.from(userMap.entries()).map(
        ([userId, count]) => ({
          id: userId,
          email: userId.substring(0, 8) + '...', // Display partial ID
          created_at: new Date().toISOString(),
          validationCount: count,
        })
      );

      setUsers(usersData);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete user's validation history
      const { error: validError } = await supabase
        .from('validation_history')
        .delete()
        .eq('user_id', userId);

      if (validError) throw validError;

      // Delete user's container details
      const { error: containerError } = await supabase
        .from('container_details')
        .delete()
        .eq('user_id', userId);

      if (containerError) throw containerError;

      toast.success('User data deleted successfully');
      loadAdminData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user data');
    }
  };

  if (adminLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-primary to-accent rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-muted-foreground">Manage users and view system data</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <Button variant="outline" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Users</p>
                <h3 className="text-3xl font-bold">{stats.totalUsers}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-secondary/10 rounded-lg">
                <FileText className="h-8 w-8 text-secondary" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Validations</p>
                <h3 className="text-3xl font-bold">{stats.totalValidations}</h3>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <div>
                <p className="text-muted-foreground">Total Containers</p>
                <h3 className="text-3xl font-bold">{stats.totalContainers}</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Management</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Validations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm">{user.email}</TableCell>
                  <TableCell>{user.validationCount}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-2">
                          <Trash2 className="h-4 w-4" />
                          Delete Data
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all data associated with this user,
                            including validation history and container details. This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No user data found
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default Admin;
