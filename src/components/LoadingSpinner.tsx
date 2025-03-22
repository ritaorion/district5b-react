import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;