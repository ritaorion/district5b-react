import * as React from "react"
import { addDays, format, getDay, isSameDay, isSameMonth, startOfMonth, parseISO } from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, MapPin, ExternalLink } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import LoadingSpinner from "@/components/LoadingSpinner"
import Breadcrumbs from "@/components/Breadcrumbs.tsx";

type Event = {
    id: string
    title: string
    date: Date
    description: string
    type: "meeting" | "personal" | "deadline"
    url?: string
    venue?: {
        venue: string
        address?: string
        city?: string
        country?: string
        zip?: string
    }
    start_time?: string
    end_time?: string
}
type WordPressEvent = {
    id: number
    title: string
    description: string
    url: string
    start_date: string
    end_date: string
    venue: {
        venue: string
        address?: string
        city?: string
        country?: string
        zip?: string
    } | null
}
interface MeetingsProps {
    searchTerm?: string;
}

export default function Meetings({ searchTerm = "District 5b" }: MeetingsProps) {
    const [date, setDate] = React.useState<Date>(new Date())
    const [month, setMonth] = React.useState<Date>(new Date())
    const [selectedEvent, setSelectedEvent] = React.useState<Event | null>(null)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)
    const [events, setEvents] = React.useState<Event[]>([])
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [currentSearchTerm, setCurrentSearchTerm] = React.useState(searchTerm)

    const firstDayOfMonth = startOfMonth(month)
    const startDay = getDay(firstDayOfMonth)
    const days = React.useMemo(() => {
        const daysArray = []
        const daysInView = 42 // 6 weeks
        const startDate = addDays(firstDayOfMonth, -startDay)
        for (let i = 0; i < daysInView; i++) {
            const currentDate = addDays(startDate, i)
            daysArray.push(currentDate)
        }

        return daysArray
    }, [firstDayOfMonth, startDay])
    const fetchEvents = React.useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const encodedSearchTerm = encodeURIComponent(currentSearchTerm)
            const response = await fetch(
                `https://nevadaarea42.org/wp-json/tribe/events/v1/events?search=${encodedSearchTerm}&per_page=50&page=1&order=asc&orderby=start_date`
            )
            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`)
            }
            const data = await response.json()
            const transformedEvents: Event[] = data.events.map((event: WordPressEvent) => {
                const startDate = parseISO(event.start_date)
                const startTime = format(startDate, 'h:mm a')
                const endTime = event.end_date ? format(parseISO(event.end_date), 'h:mm a') : undefined
                const eventType: "meeting" | "personal" | "deadline" = "meeting"
                return {
                    id: event.id.toString(),
                    title: event.title,
                    date: startDate,
                    description: event.description.replace(/<\/?[^>]+(>|$)/g, ""),
                    type: eventType,
                    url: event.url,
                    venue: event.venue,
                    start_time: startTime,
                    end_time: endTime
                }
            })

            setEvents(transformedEvents)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred')
            console.error('Error fetching events:', err)
        } finally {
            setLoading(false)
        }
    }, [])
    React.useEffect(() => {
        fetchEvents()
    }, [fetchEvents])
    React.useEffect(() => {
        if (currentSearchTerm !== searchTerm) {
            setCurrentSearchTerm(searchTerm)
        }
    }, [searchTerm])
    React.useEffect(() => {
        fetchEvents().then(() => console.log('Events fetched! 📅'))
    }, [currentSearchTerm, fetchEvents])

    const getEventsForDay = (day: Date) => {
        return events.filter((event) => isSameDay(event.date, day))
    }

    const handleEventClick = (event: Event) => {
        setSelectedEvent(event)
        setIsDialogOpen(true)
    }

    return (
        <div className="max-w-3xl mx-auto p-4">
            <Breadcrumbs
                pages={[
                    { title: 'Home', href: '/', active: false },
                    { title: 'Meetings', href: '/meetings', active: true },
                ]}
            />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{format(month, "MMMM yyyy")}</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={() => setMonth(addDays(month, -30))}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => setMonth(new Date())}>
                        This Month
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4" />
                                <span>Select</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(newDate) => {
                                    if (newDate) {
                                        setDate(newDate)
                                        setMonth(newDate)
                                    }
                                }}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <Button variant="outline" size="icon" onClick={() => setMonth(addDays(month, 30))}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Error state */}
            {error && <div className="text-center py-4 text-red-500">Error: {error}</div>}

            {/* Calendar header - days of week */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-medium py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid with loading overlay */}
            <div className="relative">
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-md">
                        <LoadingSpinner />
                    </div>
                )}

                <div className="grid grid-cols-7 gap-1">
                    {days.map((day, index) => {
                        const dayEvents = getEventsForDay(day)
                        const isCurrentMonth = isSameMonth(day, month)

                        return (
                            <Card
                                key={index}
                                className={cn(
                                    "min-h-24 p-1",
                                    !isCurrentMonth && "opacity-40",
                                    isSameDay(day, new Date()) && "border-primary",
                                )}
                            >
                                <div className="text-right p-1 font-medium text-sm">{format(day, "d")}</div>
                                <div className="space-y-1">
                                    {dayEvents.map((event) => (
                                        <CalendarEvent key={event.id} event={event} onClick={() => handleEventClick(event)} />
                                    ))}
                                </div>
                            </Card>
                        )
                    })}
                </div>
            </div>

            {/* Event details dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    {selectedEvent && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedEvent.title}</DialogTitle>
                                <DialogDescription>
                                    {format(selectedEvent.date, "EEEE, MMMM d, yyyy")}
                                    {selectedEvent.start_time && ` • ${selectedEvent.start_time}`}
                                    {selectedEvent.end_time && ` - ${selectedEvent.end_time}`}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="flex items-center gap-2">
                                    <div
                                        className={cn(
                                            "w-3 h-3 rounded-full",
                                            selectedEvent.type === "meeting" && "bg-blue-500",
                                            selectedEvent.type === "personal" && "bg-green-500",
                                            selectedEvent.type === "deadline" && "bg-red-500",
                                        )}
                                    />
                                    <span className="capitalize">{selectedEvent.type}</span>
                                </div>

                                {selectedEvent.description && (
                                    <p>{selectedEvent.description}</p>
                                )}

                                {selectedEvent.venue && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 mt-1" />
                                        <div>
                                            <div className="font-medium">{selectedEvent.venue.venue}</div>
                                            {selectedEvent.venue.address && <div>{selectedEvent.venue.address}</div>}
                                            <div>
                                                {selectedEvent.venue.city && selectedEvent.venue.city}
                                                {selectedEvent.venue.city && selectedEvent.venue.zip && `, `}
                                                {selectedEvent.venue.zip && selectedEvent.venue.zip}
                                            </div>
                                            {selectedEvent.venue.country && <div>{selectedEvent.venue.country}</div>}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedEvent.url && (
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => window.open(selectedEvent.url, '_blank')}
                                        className="flex items-center gap-2"
                                    >
                                        <span>View on Website</span>
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </DialogFooter>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

function CalendarEvent({ event, onClick }: { event: Event; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left px-2 py-1 rounded text-xs font-medium truncate",
                event.type === "meeting" &&
                "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/40",
                event.type === "personal" &&
                "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/40",
                event.type === "deadline" &&
                "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/40",
            )}
        >
            {event.start_time && `${event.start_time} - `}{event.title}
        </button>
    )
}