import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info, FileText, Users, Calendar, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Breadcrumbs from "@/components/Breadcrumbs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CircleAlert } from "lucide-react";

export default function GSR() {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-3xl mx-auto">
                <Breadcrumbs
                    pages={[
                        { title: 'Home', href: '/', active: false },
                        { title: 'GSR', href: '/gsr', active: true },
                    ]}
                />
                <h1 className="text-4xl font-bold mb-6 md:mb-8">
                    General Service Representative
                </h1>

                <Card className="mb-8 shadow-md">
                    <CardHeader className="">
                        <CardTitle className="flex items-center">
                            <Info className="h-5 w-5 mr-2 text-blue-600" />
                            Welcome to General Service
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <p className="mb-4">
                            Congratulations and welcome to General Service. There is a lot to take in and learn,
                            kind of like drinking from a fire hose, but hang in there. This can be incredibly
                            rewarding and purposeful.
                        </p>
                        <p className="mb-4">
                            Basically, the GSR is suggested for a 2-year period of time. This allows you
                            to attend discussion and election assemblies to best represent your group and
                            learn how the service structure works.
                        </p>
                        <p>
                            In addition to supporting your Alternate GSR and learning as much as you can about
                            General Service, there is a way to be helpful and resourceful to both the District and
                            your group. You can use this website for some great resources.
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <Card className="shadow-md">
                        <CardHeader className="">
                            <CardTitle className="text-lg flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-blue-600" />
                                Getting Started
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <p className="mb-4">
                                If you haven't read the pamphlet on being a GSR, it might be a good idea.
                                Basically, you are representing your group to the rest of AA and vice versa.
                            </p>
                            <p>
                                There may be times when you cannot attend meetings or give a report(s).
                                Remember you may have an Alternate who can help and be encouraged to get more involved.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="">
                            <CardTitle className="text-lg flex items-center">
                                <Users className="h-4 w-4 mr-2 text-blue-600" />
                                Your Responsibilities
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <p className="mb-4">
                                One of the responsibilities of the GSR is to give reports back to the group.
                                When giving reports back to the group from the District or Area meetings, remember
                                this is your time to shine, you can show the group that you are informed and prepared.
                            </p>
                            <p>
                                If someone from your group asks you a question you don't know the answer to,
                                don't be afraid to let them know that that is a good question and you will
                                find out for them, remember, you aren't supposed to know very much at this point.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-8 shadow-md">
                    <CardHeader className="">
                        <CardTitle className="text-lg flex items-center">
                            <Book className="h-4 w-4 mr-2 text-blue-600" />
                            Learning Resources
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <p className="mb-4">
                            Familiar yourself with the AA Service Manual as best you can, learn the general
                            idea of the service structure and remember universal respect is key, no
                            member is better or less than another.
                        </p>
                        <p className="mb-6">
                            It may also be helpful to learn about Robert's Rules of Order. This is commonly used
                            when conducting meetings in AA.
                        </p>
                        <Button
                            variant="outline"
                            className="mb-4"
                            asChild
                        >
                            <Link
                                to={'/resources/Roberts-Rules-Overview.pdf'}
                                target="_blank"
                                referrerPolicy={'no-referrer'}
                            >
                                View Robert's Rules of Order Guide
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="mb-8 shadow-md">
                    <CardHeader className="">
                        <CardTitle className="text-lg flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                            Getting Involved
                        </CardTitle>
                        <CardDescription>
                            Building connections in General Service
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="">
                        <ul className="space-y-4">
                            <li className="flex">
                                <div className="mr-3 mt-1">
                                    <div className="bg-blue-100 rounded-full p-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                </div>
                                <p>Ask other GSR's questions about being of service and you'll probably make lifelong friends.</p>
                            </li>
                            <li className="flex">
                                <div className="mr-3 mt-1">
                                    <div className="bg-blue-100 rounded-full p-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                </div>
                                <p>Attend District meetings and events and volunteer if you can, this helps people get to know you as well as letting them get to know you.</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Separator className="my-8" />

                <Alert className={'shadow-md p-4'}>
                    <CircleAlert className={'h-4 w-4'} />
                    <AlertTitle className={'text-lg'}>Final Thoughts</AlertTitle>
                    <AlertDescription className={'text-gray-800'}>
                        Relax and enjoy the learning process of how things work. General Service is not
                        for everyone, it takes humility, patience and a lot of understanding.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
}