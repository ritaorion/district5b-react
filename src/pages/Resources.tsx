import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Search, Download } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { formatFileSize } from "@/lib/utils";
import Breadcrumbs from '@/components/Breadcrumbs';

interface DownloadItem {
    modified: string;
    name: string;
    size: string;
}

export default function Resources() {
    const [searchTerm, setSearchTerm] = useState('');
    const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<DownloadItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDownloadItems = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://district5b-production.up.railway.app/api/v1/pdfs');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
                setDownloadItems(sortedData);
                setFilteredItems(sortedData);
                setError(null);
            } catch (err) {
                setError('Failed to load download items. Please try again later.');
                console.error('Error fetching download items:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDownloadItems().then(() => console.log('Available Resources Fetched! 🔥'));
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredItems(downloadItems);
        } else {
            const filtered = downloadItems.filter(
                (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredItems(filtered);
        }
    }, [searchTerm, downloadItems]);
    const handleDownload = (fileName: string) => {
        const downloadUrl = `/resources/${fileName}`;
        window.open(downloadUrl, '_blank');
    };

    return (
        <>
            <Breadcrumbs
                pages={[
                    { title: 'Home', href: '/', active: false },
                    { title: 'Resources', href: '/resources', active: true },
                ]}
            />
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6">Available Documents</h1>
                <p className="mb-6">
                    This page provides access to downloadable documents and resources.
                    Use the search box to quickly find specific files.
                </p>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400"/>
                    </div>
                    <Input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <LoadingSpinner/>
                    </div>
                ) : (
                    <>
                        <p className="mb-4 text-gray-600">
                            Showing {filteredItems.length} of {downloadItems.length} documents
                        </p>
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document Name</TableHead>
                                        <TableHead>Size</TableHead>
                                        <TableHead>Download</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredItems.length > 0 ? (
                                        filteredItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-medium whitespace-normal break-words">
                                                    {item.name.replace(/-/g, ' ').replace('.pdf', '')}
                                                </TableCell>
                                                <TableCell>
                                                    {formatFileSize(item.size)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownload(item.name)}
                                                    >
                                                        <Download className="h-4 w-4 mr-2"/>
                                                        Download
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-4">
                                                No documents found matching your search term.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}