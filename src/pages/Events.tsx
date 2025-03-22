import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Calendar, Clock, MapPin, AlertCircle, Loader2, Search } from 'lucide-react';
import Breadcrumbs from "@/components/Breadcrumbs.tsx";

interface Event {
    id: number;
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
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isEventDetailOpen, setIsEventDetailOpen] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            fetchEvents().then(() => console.log('Events fetched! 🔥'));
        }
    }, []);

    useEffect(() => {
        filterEvents();
    }, [events, searchQuery]);

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://district5b-production.up.railway.app/api/v1/events');
            if (!response.ok) {
                throw new Error(`Error fetching events: ${response.statusText}`);
            }
            const data = await response.json();
            const now = new Date();
            const upcomingEvents = data.filter((event: Event) => new Date(event.start_time) > now);
            upcomingEvents.sort((a: Event, b: Event) => {
                return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
            });
            setEvents(upcomingEvents);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const filterEvents = () => {
        if (!searchQuery.trim()) {
            setFilteredEvents(events);
            return;
        }
        const query = searchQuery.toLowerCase();
        const filtered = events.filter(
            (event) =>
                event.title.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.description.toLowerCase().includes(query)
        );
        setFilteredEvents(filtered);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const openEventDetail = (event: Event) => {
        setSelectedEvent(event);
        setIsEventDetailOpen(true);
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleTimeString(undefined, options);
    };
    const createPreviewText = (html: string) => {
        const text = html.replace(/<[^>]*>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return text.length > 150 ? text.substring(0, 147) + '...' : text;
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className={'flex justify-center'}>
                <Breadcrumbs
                    pages={[
                        { title: 'Home', href: '/', active: false },
                        { title: 'Events', href: '/events', active: true },
                    ]}
                />
            </div>
            <div className="flex flex-col items-center justify-center mb-8">
                <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
                <div className="w-full max-w-md relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="pl-10"
                    />
                </div>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            ) : !filteredEvents ? (
                <div className="text-center py-12">
                    <h2 className="text-xl">No upcoming events found</h2>
                    {searchQuery && (
                        <p className="mt-2 text-muted-foreground">
                            Try adjusting your search query
                        </p>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event) => (
                        <Card key={event.id} className="flex flex-col h-full">
                            <CardHeader>
                                <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                                <CardDescription className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(event.start_time)}
                                </CardDescription>
                                <CardDescription className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {formatTime(event.start_time)} - {formatTime(event.end_time)}
                                </CardDescription>
                                <CardDescription className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {event.location}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <div className="text-sm text-muted-foreground">
                                    {createPreviewText(event.description)}
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={() => openEventDetail(event)} className="w-full">
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isEventDetailOpen} onOpenChange={setIsEventDetailOpen}>
                <DialogContent className="sm:max-w-3xl">
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl">{selectedEvent.title}</DialogTitle>
                                <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatDate(selectedEvent.start_time)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{selectedEvent.location}</span>
                                </div>
                            </div>
                            <div className="py-4">
                                <article
                                    className="prose max-w-none dark:prose-invert"
                                    dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsEventDetailOpen(false)}>Close</Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Events;