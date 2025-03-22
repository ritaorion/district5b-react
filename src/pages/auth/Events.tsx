import React, { useState, useEffect } from 'react';
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
import {
    AlertCircle,
    MoreHorizontal,
    Plus,
    Loader2,
    // Calendar
} from 'lucide-react';
import { RichTextEditor } from '@/components/rich-text-editor';

interface Event {
    id: string;
    title: string;
    description: string;
    location: string;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
}

const Events = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<Partial<Event>>({
        title: '',
        description: '',
        location: '',
        start_time: '',
        end_time: '',
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents().then(() => console.log('Events fetched! 🔥'));
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch('https://district5b-production.up.railway.app/api/v1/events', {
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
                throw new Error(`Error fetching events: ${response.statusText}`);
            }
            const data = await response.json();
            setEvents(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const formattedData = {
                ...formData,
                start_time: formData.start_time ? formatDateTimeForAPI(formData.start_time) : '',
                end_time: formData.end_time ? formatDateTimeForAPI(formData.end_time) : ''
            };
            const response = await fetch('https://district5b-production.up.railway.app/api/v1/events', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                    return;
                }
                throw new Error(`Error creating event: ${response.statusText}`);
            }
            setSuccess('Event created successfully');
            await fetchEvents();
            setFormData({
                title: '',
                description: '',
                location: '',
                start_time: '',
                end_time: ''
            });
            setIsCreateDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditEvent = async () => {
        if (!selectedEvent) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const formattedData = {
                ...formData,
                start_time: formData.start_time ? formatDateTimeForAPI(formData.start_time) : '',
                end_time: formData.end_time ? formatDateTimeForAPI(formData.end_time) : ''
            };
            const response = await fetch(`https://district5b-production.up.railway.app/api/v1/events/${selectedEvent.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/login');
                    return;
                }
                throw new Error(`Error updating event: ${response.statusText}`);
            }
            setSuccess('Event updated successfully');
            await fetchEvents();
            setFormData({
                title: '',
                description: '',
                location: '',
                start_time: '',
                end_time: ''
            });
            setIsEditDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent) return;
        setIsSubmitting(true);
        setError(null);
        try {
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                navigate('/login');
                return;
            }
            const response = await fetch(`https://district5b-production.up.railway.app/api/v1/events/${selectedEvent.id}`, {
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
                throw new Error(`Error deleting event: ${response.statusText}`);
            }
            setSuccess('Event deleted successfully');
            await fetchEvents();
            setIsDeleteDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete event');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (content: string) => {
        setFormData(prev => ({ ...prev, description: content }));
    };

    const openEditDialog = (event: Event) => {
        setSelectedEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            location: event.location,
            start_time: formatDateTimeForInput(event.start_time),
            end_time: formatDateTimeForInput(event.end_time),
        });
        setIsEditDialogOpen(true);
    };

    const openDeleteDialog = (event: Event) => {
        setSelectedEvent(event);
        setIsDeleteDialogOpen(true);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDateTimeForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const formatDateTimeForAPI = (dateString: string) => {
        const date = new Date(dateString);
        const tzOffset = -date.getTimezoneOffset();
        const tzOffsetHours = Math.floor(Math.abs(tzOffset) / 60);
        const tzOffsetMinutes = Math.abs(tzOffset) % 60;
        const tzSign = tzOffset >= 0 ? '+' : '-';
        const tzString = `${tzSign}${String(tzOffsetHours).padStart(2, '0')}:${String(tzOffsetMinutes).padStart(2, '0')}`;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00${tzString}`;
    };

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Events</CardTitle>
                        <CardDescription>Manage events and announcements.</CardDescription>
                    </div>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Event
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
                                    <TableHead>Title</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Start Time</TableHead>
                                    <TableHead>End Time</TableHead>
                                    <TableHead className="w-[80px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!events ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center pt-10">
                                            No events found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    events.map((event) => (
                                        <TableRow key={event.id}>
                                            <TableCell className="font-medium">{event.title}</TableCell>
                                            <TableCell>{event.location}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{formatDate(event.start_time)}</span>
                                                    <span className="text-sm text-muted-foreground">{formatTime(event.start_time)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{formatDate(event.end_time)}</span>
                                                    <span className="text-sm text-muted-foreground">{formatTime(event.end_time)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditDialog(event)}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => openDeleteDialog(event)}
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

            {/* Create Event Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                        <DialogDescription>
                            Add a new event or announcement.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="title" className="text-right">
                                Title
                            </label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <label htmlFor="description" className="text-right pt-2">
                                Description
                            </label>
                            <div className="col-span-3">
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={handleDescriptionChange}
                                    placeholder="Enter event description..."
                                    className="min-h-[200px]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="location" className="text-right">
                                Location
                            </label>
                            <Input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="start_time" className="text-right">
                                Start Time
                            </label>
                            <Input
                                id="start_time"
                                name="start_time"
                                type="datetime-local"
                                value={formData.start_time}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="end_time" className="text-right">
                                End Time
                            </label>
                            <Input
                                id="end_time"
                                name="end_time"
                                type="datetime-local"
                                value={formData.end_time}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateEvent}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Make changes to the event information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-title" className="text-right">
                                Title
                            </label>
                            <Input
                                id="edit-title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <label htmlFor="edit-description" className="text-right pt-2">
                                Description
                            </label>
                            <div className="col-span-3">
                                <RichTextEditor
                                    value={formData.description}
                                    onChange={handleDescriptionChange}
                                    placeholder="Enter event description..."
                                    className="min-h-[200px]"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-location" className="text-right">
                                Location
                            </label>
                            <Input
                                id="edit-location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-start_time" className="text-right">
                                Start Time
                            </label>
                            <Input
                                id="edit-start_time"
                                name="start_time"
                                type="datetime-local"
                                value={formData.start_time}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="edit-end_time" className="text-right">
                                End Time
                            </label>
                            <Input
                                id="edit-end_time"
                                name="end_time"
                                type="datetime-local"
                                value={formData.end_time}
                                onChange={handleInputChange}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEditEvent}
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Event Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the event "{selectedEvent?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteEvent}
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

export default Events;