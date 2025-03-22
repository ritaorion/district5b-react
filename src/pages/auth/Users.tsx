import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    // DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MoreHorizontal, Plus, Loader2 } from 'lucide-react';

interface User {
    id: string;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_admin: boolean;
    password: string;
    created_at: string;
    updated_at: string;
}

const Users = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<User>>({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        is_admin: false,
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    useEffect(() => {
        fetchUsers().then(() => console.log('Users fetched! 🔥'));
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch('https://district5b-production.up.railway.app/api/v1/users', {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                    return;
                }
                throw new Error(`Error fetching users: ${response.statusText}`);
            }
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            console.log("Preparing to send user data:", formData);
            const payload = {
                username: formData.username || "",
                email: formData.email || "",
                password: formData.password || "password",
                first_name: formData.first_name || "",
                last_name: formData.last_name || "",
                is_admin: Boolean(formData.is_admin)
            };
            console.log("Sending payload:", payload);
            const response = await fetch('https://district5b-production.up.railway.app/api/v1/users', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const responseText = await response.text();
            console.log("Response status:", response.status);
            console.log("Response text:", responseText);
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                    return;
                }
                throw new Error(`Error creating user: ${response.statusText}`);
            }
            setSuccess('User created successfully');
            await fetchUsers();
            setFormData({ username: '', email: '', first_name: '', last_name: '', is_admin: false });
            setIsCreateDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditUser = async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const payload = {
                ...selectedUser,
                username: formData.username || selectedUser.username,
                email: formData.email || selectedUser.email,
                first_name: formData.first_name || selectedUser.first_name,
                last_name: formData.last_name || selectedUser.last_name,
                is_admin: formData.is_admin !== undefined ? formData.is_admin : selectedUser.is_admin,
                ...(formData.password ? { password: formData.password } : {})
            };
            console.log("Updating user with payload:", {
                ...payload,
                password: payload.password ? "[REDACTED]" : undefined
            });

            const response = await fetch(`https://district5b-production.up.railway.app/api/v1/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const responseText = await response.text();
            let responseData;

            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                console.error("Failed to parse response:", e);
                responseData = { error: responseText };
            }
            console.log("Update response:", response.status, responseData);
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                    return;
                }
                const errorMessage = responseData.error || `Error: ${response.status} ${response.statusText}`;
                throw new Error(errorMessage);
            }
            setSuccess('User updated successfully');
            await fetchUsers();
            setFormData({ username: '', email: '', password: '', first_name: '', last_name: '', is_admin: false });
            setIsEditDialogOpen(false);
        } catch (err) {
            console.error("Update error:", err);
            setError(err instanceof Error ? err.message : 'Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch(`https://district5b-production.up.railway.app/api/v1/users/${selectedUser.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                    return;
                }
                throw new Error(`Error deleting user: ${response.statusText}`);
            }
            setSuccess('User deleted successfully');
            await fetchUsers();
            setIsDeleteDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const openEditDialog = (user: User) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            is_admin: user.is_admin,
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Users</CardTitle>
                        <CardDescription>Manage user accounts and permissions.</CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert variant={'default'} className={'mb-4 bg-green-50 border-green-600'}>
                            <AlertCircle className="h-4 w-4 " color={'#169116'} />
                            <AlertTitle className={'text-green-700'}>Success</AlertTitle>
                            <AlertDescription className={'text-green-600'}>{success}</AlertDescription>
                        </Alert>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Full Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Admin</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.username}</TableCell>
                                            <TableCell>{user.first_name} {user.last_name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>{user.is_admin ? 'Yes' : 'No'}</TableCell>
                                            <TableCell>{formatDate(user.created_at)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => openDeleteDialog(user)}
                                                            className="text-red-600"
                                                        >
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create User Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>
                            Add a new user to the system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="username" className="text-right">
                                Username
                            </label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="email" className="text-right">
                                Email
                            </label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="first_name" className="text-right">
                                First Name
                            </label>
                            <Input
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="last_name" className="text-right">
                                Last Name
                            </label>
                            <Input
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="password" className="text-right">
                                Password
                            </label>
                            <Input
                                id="password"
                                name="password"
                                type="text"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="is_admin" className="text-right">
                                Admin
                            </label>
                            <div className="col-span-3 flex items-center">
                                <Input
                                    id="is_admin"
                                    name="is_admin"
                                    type="checkbox"
                                    checked={formData.is_admin === true}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_admin: e.target.checked }))}
                                    className="h-4 w-4 mr-2"
                                />
                                <label htmlFor="is_admin">User has admin privileges</label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateUser}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Make changes to the user's information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-username" className="text-right">
                                Username
                            </label>
                            <Input
                                id="edit-username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-email" className="text-right">
                                Email
                            </label>
                            <Input
                                id="edit-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-first_name" className="text-right">
                                First Name
                            </label>
                            <Input
                                id="edit-first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-last_name" className="text-right">
                                Last Name
                            </label>
                            <Input
                                id="edit-last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-is_admin" className="text-right">
                                Admin
                            </label>
                            <div className="col-span-3 flex items-center">
                                <Input
                                    id="edit-is_admin"
                                    name="is_admin"
                                    type="checkbox"
                                    checked={formData.is_admin === true}
                                    onChange={(e) => setFormData(prev => ({ ...prev, is_admin: e.target.checked }))}
                                    className="h-4 w-4 mr-2"
                                />
                                <label htmlFor="edit-is_admin">User has admin privileges</label>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditUser}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {selectedUser?.username} ({selectedUser?.first_name} {selectedUser?.last_name})? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteUser}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Users;