import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CloudDownload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ResourceDownloader() {
    const { resourceName } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!resourceName) {
            console.error("No resource name provided");
            navigate('/404');
            return;
        }
        const apiUrl = `https://district5b-production.up.railway.app/api/v1/pdfs/download?file=${encodeURIComponent(resourceName)}`;
        const downloadResource = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${resourceName}`);
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', resourceName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.error(error);
                navigate('/404');
            } finally {
                setLoading(false);
            }
        };

        downloadResource().then(() => console.log('Resource downloaded! 🔥'));
    }, [resourceName, navigate]);

    return (
        <div className="flex items-center justify-center h-[500px]">
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className={'flex flex-col items-center justify-center space-y-4'}>
                    <CloudDownload size={48} className="text-blue-500" />
                    <p>Your download should have started. If not,
                        <a
                            href={`https://district5b-production.up.railway.app/api/v1/pdfs/download?file=${encodeURIComponent(resourceName ?? '')}`}
                            className="text-blue-500 underline ml-1"
                        >
                            click here
                        </a>.
                    </p>
                    <Button
                        asChild
                    >
                        <Link
                            to={'/resources'}
                            className="text-white"
                        >
                            Back to Resources
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
