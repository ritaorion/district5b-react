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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, MoreHorizontal, Loader2, Sheet } from 'lucide-react';

interface ContactForm {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
    updated_at: string;
}

const ContactForms = () => {
    const [contactForms, setContactForms] = useState<ContactForm[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchContactForms().then(() => console.log('Contact forms fetched! 🔥'));
    }, []);

    const fetchContactForms = async () => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch('https://district5b-production.up.railway.app/api/v1/contacts', {
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
                throw new Error(`Error fetching contact forms: ${response.statusText}`);
            }

            const data = await response.json();
            setContactForms(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch contact forms');
        } finally {
            setLoading(false);
        }
    };

    const fetchContactDetails = async (id: string) => {
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch(`https://district5b-production.up.railway.app/api/v1/contacts/${id}`, {
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
                throw new Error(`Error fetching contact details: ${response.statusText}`);
            }
            const data = await response.json();
            setSelectedContact(data);
            setIsViewDialogOpen(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch contact details');
        }
    };

    const handleDeleteContact = async () => {
        if (!selectedContact) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch(`https://district5b-production.up.railway.app/api/v1/contacts/${selectedContact.id}`, {
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
                throw new Error(`Error deleting contact form: ${response.statusText}`);
            }
            await fetchContactForms();
            setIsDeleteDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete contact form');
        } finally {
            setIsSubmitting(false);
        }
    };

    const openViewDialog = async (id: string) => {
        await fetchContactDetails(id);
    };

    const openDeleteDialog = (contact: ContactForm) => {
        setSelectedContact(contact);
        setIsDeleteDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const exportSingleForm = async (id: string) => {
        const contact = contactForms.find((contact) => contact.id === id);
        if (!contact) {
            setError('Contact form not found');
            return;
        }

        const { name, email, subject, message, created_at } = contact;
        const formattedDate = new Date(created_at).toLocaleDateString();
        const csvData = `Name,Email,Subject,Message,Submitted On\n"${name}","${email}","${subject}","${message}","${formattedDate}"`;

        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `contact-form-${id}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const exportAllForms = async () => {
        const csvData = contactForms.map(({ id, name, email, subject, message, created_at }) => {
            const formattedDate = new Date(created_at).toLocaleDateString();
            return `"${id}","${name}","${email}","${subject}","${message}","${formattedDate}"`;
        }).join('\n');

        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all-contact-forms.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Contact Form Submissions</CardTitle>
                        <CardDescription>View and manage contact form submissions from your website.</CardDescription>
                    </div>
                    <Button onClick={() => exportAllForms()}>
                        <Sheet className="mr-2 h-4 w-4"/>
                        Export All
                    </Button>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
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
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!contactForms ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center pt-10">
                                            No contact form submissions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    contactForms.map((contact) => (
                                        <TableRow key={contact.id}>
                                            <TableCell className="font-medium">{contact.name}</TableCell>
                                            <TableCell>{contact.email}</TableCell>
                                            <TableCell>{contact.subject}</TableCell>
                                            <TableCell>{formatDate(contact.created_at)}</TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openViewDialog(contact.id)}>
                                                            View
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => exportSingleForm(contact.id)}>
                                                            Export
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => openDeleteDialog(contact)}
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

            {/* View Contact Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Contact Form Details</DialogTitle>
                        <DialogDescription>
                            Submission from {selectedContact?.name} on {selectedContact ? formatDate(selectedContact.created_at) : ''}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedContact && (
                        <div className="space-y-4 py-2">
                            <div>
                                <h4 className="text-sm font-medium">Name</h4>
                                <p className="text-sm">{selectedContact.name}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Email</h4>
                                <p className="text-sm">{selectedContact.email}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Subject</h4>
                                <p className="text-sm">{selectedContact.subject}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Message</h4>
                                <p className="text-sm whitespace-pre-wrap">{selectedContact.message}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium">Submitted On</h4>
                                <p className="text-sm">{formatDate(selectedContact.created_at)}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Contact Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this contact form submission from {selectedContact?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteContact}
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

export default ContactForms;