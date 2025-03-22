import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Breadcrumbs from '@/components/Breadcrumbs';
import LoadingSpinner from '@/components/LoadingSpinner';

const Map = () => {
    const [isLoading, setIsLoading] = useState(true);

    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    return (
        <div className="page map-page">
            <Breadcrumbs
                pages={[
                    { title: 'Home', href: '/', active: false },
                    { title: 'Map', href: '/map', active: true },
                ]}
            />
            <Card>
                <CardHeader>
                    <CardTitle>Map</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="relative min-h-[600px]">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <LoadingSpinner />
                        </div>
                    )}
                    <iframe
                        src="https://www.google.com/maps/d/embed?mid=1hcFJSeBWCnPac8SInQREQK1zW-gb53U5&ehbc=2E312F"
                        width="100%"
                        height="600px"
                        onLoad={handleIframeLoad}
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </CardContent>
                <CardFooter>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Map;