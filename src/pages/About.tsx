import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";

const About = () => {
    return (
        <div className="page about-page">
            <Breadcrumbs
                pages={[
                    { title: 'Home', href: '/', active: false },
                    { title: 'About', href: '/about', active: true },
                ]}
            />
            <HeroSection />
        </div>
    );
};

function HeroSection() {
    return (
        <div className="w-full py-12 md:py-16">
            <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left column - Text content */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-5xl md:text-7xl font-bold text-[#1a3a7e] mb-2">
                            What is,
                            <div className="text-[#1a3a7e]">District 5B?</div>
                        </h1>
                    </div>

                    <div className="text-base text-gray-800 space-y-4 max-w-2xl">
                        <p className={'text-lg'}>
                            District 5B is part of <Link to="/area42" className="text-blue-600 hover:underline">Area
                            42</Link>, and more specifically Southern Area 42 (SAGSC). District 5B
                            includes meetings at the <Link to="/meetings" className="text-blue-600 hover:underline">Choices
                            Fellowship</Link>, located at 4343 N. Rancho Dr. #240, Las
                            Vegas on the second Saturday of every month from 1:15pm to 2:15pm. District 5B also
                            includes rural areas to the north including Hiko, Alamo, Indian Springs, High Desert State
                            Prison and the Southern Desert Correctional Center.
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className=""
                        size={'lg'}
                        asChild
                    >
                        <Link to="/about">
                            <MapPin className="mr-2 h-4 w-4"/>
                            Learn More About District 5B
                        </Link>
                    </Button>
                </div>

                {/* Right column - Image and Zoom card */}
                <div className="relative flex justify-center lg:justify-end">
                    <div className="w-full max-w-md h-80 md:h-96 bg-gray-300 rounded-lg">
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            <img
                                src={'/assets/bw-map.webp'}
                                alt={'District 5B Map'}
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* Zoom info card - positioned over the image */}
                    <Card className="absolute bottom-4 left-4 lg:-left-16 max-w-xs bg-white shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div
                                        className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-xs">zoom</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                        We host a Service Manual Step Study, on the
                                        third Saturday of the month from 10:00 a.m. to
                                        11:00 am. All AAs are welcome.
                                    </p>
                                    <p className="text-sm font-medium">Meeting ID: 911 603 2610</p>
                                    <p className="text-sm">Password: Service</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default About;