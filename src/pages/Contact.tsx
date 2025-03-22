import React from 'react';
import { useState, FormEvent } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle
} from '@/components/ui/alert';
import Breadcrumbs from "@/components/Breadcrumbs.tsx";

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface ApiResponse {
    message: string;
    id?: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState<Partial<ContactFormData>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{
        status: 'success' | 'error';
        message: string;
    } | null>(null);

    const validateForm = (): boolean => {
        const newErrors: Partial<ContactFormData> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof ContactFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitResult(null);
        if (!validateForm()) {
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('https://district5b-production.up.railway.app/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data: ApiResponse = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit contact form');
            }
            setSubmitResult({
                status: 'success',
                message: 'Your message has been sent successfully! We will get back to you soon.'
            });
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

        } catch (error) {
            setSubmitResult({
                status: 'error',
                message: error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="container mx-auto py-8">
                <div className="max-w-2xl mx-auto">
                    <Breadcrumbs
                        pages={[
                            { title: 'Home', href: '/', active: false },
                            { title: 'Contact', href: '/contact', active: true },
                        ]}
                    />
                    <h1 className="text-3xl font-bold mb-6">Contact Us</h1>

                    {submitResult && (
                        <Alert
                            className={`mb-6 ${
                                submitResult.status === 'success' ? 'bg-green-50' : 'bg-red-50'
                            }`}
                        >
                            {submitResult.status === 'success' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-600"/>
                            ) : (
                                <AlertCircle className="h-4 w-4 text-red-600"/>
                            )}
                            <AlertTitle>
                                {submitResult.status === 'success' ? 'Success' : 'Error'}
                            </AlertTitle>
                            <AlertDescription>{submitResult.message}</AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Send us a message</CardTitle>
                            <CardDescription>
                                Fill out the form below and we'll get back to you as soon as possible.
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Name<span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email<span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Your email address"
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="What's this regarding?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="message">
                                        Message<span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Your message"
                                        rows={5}
                                        className={errors.message ? 'border-red-500' : ''}
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-sm">{errors.message}</p>
                                    )}
                                </div>
                            </CardContent>

                            <CardFooter className={'mt-3'}>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                            Sending...
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
}