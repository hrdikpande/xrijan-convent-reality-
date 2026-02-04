import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { getBookings } from "@/app/actions/dashboard"

interface Booking {
    id: string | number;
    property?: {
        address_details?: {
            locality?: string;
        };
    };
    status?: string;
    booking_date: string;
    notes?: string;
}

export default async function BookingsPage() {
    const bookings = (await getBookings()) as Booking[]

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Bookings</h2>
                <p className="text-slate-500">Track your property visits and appointments.</p>
            </div>

            {bookings.length === 0 ? (
                <Card className="border-slate-200/60 shadow-sm border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Calendar className="w-6 h-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No bookings found</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">You haven&apos;t scheduled any property visits yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking: Booking) => (
                        <Card key={booking.id} className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                                        Visit to {booking.property?.address_details?.locality || "Property"}
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                            booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                'bg-slate-100 text-slate-600'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </h4>
                                    <div className="flex items-center gap-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{new Date(booking.booking_date).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {booking.notes && (
                                    <p className="text-sm text-slate-500 bg-slate-50 p-2 rounded max-w-md">
                                        {booking.notes}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
