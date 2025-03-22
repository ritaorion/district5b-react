import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {CircleAlert, Info} from 'lucide-react';
import Breadcrumbs from "@/components/Breadcrumbs.tsx";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";

export default function AGSR() {
    return (
        <div className="container mx-auto py-8">
            <div className="max-w-3xl mx-auto">
                <Breadcrumbs
                    pages={[
                        { title: 'Home', href: '/', active: false },
                        { title: 'AGSR', href: '/agsr', active: true },
                    ]}
                />
                <h1 className="text-4xl font-bold mb-6 md:mb-8">
                    Alternate General Service Representative
                </h1>

                <Card className="mb-8 shadow-md">
                    <CardHeader className="">
                        <CardTitle className="flex items-center">
                            <Info className="h-5 w-5 mr-2 text-blue-600"/>
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
                            Basically, the Alternate GSR is suggested for a period of one year and often become
                            the natural choice for the 2-year GSR commitment.
                        </p>
                    </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    <Card className="shadow-md">
                        <CardHeader className="">
                            <CardTitle className="text-lg">Your Role</CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <p className="mb-4">
                                In addition to supporting the GSR and learning as much as you can about
                                General Service, there is a way to be helpful and resourceful as an alternate.
                            </p>
                            <p>
                                There may be times when your GSR cannot attend meetings or give a report(s).
                                This is your time to shine, you can show the group that you are equally
                                informed and prepared. You can use this website for some great resources.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-md">
                        <CardHeader className="">
                            <CardTitle className="text-lg">Learning Process</CardTitle>
                        </CardHeader>
                        <CardContent className="">
                            <p className="mb-4">
                                If someone from your group asks you a question you don't know the answer to,
                                don't be afraid to let them know that that is a good question and you will
                                find out for them, remember, you aren't supposed to know very much at this point.
                            </p>
                            <p>
                                Familiar yourself with the AA Service Manual as best you can, learn the general
                                idea of the service structure and remember universal respect is key, no
                                member is better or less than another.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-8 shadow-md">
                    <CardHeader className="">
                        <CardTitle className="text-lg">Getting Involved</CardTitle>
                    </CardHeader>
                    <CardContent className="">
                        <ul className="space-y-4">
                            <li className="flex">
                                <div className="mr-3 mt-1">
                                    <div className="bg-blue-100 rounded-full p-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                </div>
                                <p>Ask your GSR and other GSR's questions about being of service and
                                    you'll probably make lifelong friends.</p>
                            </li>
                            <li className="flex">
                                <div className="mr-3 mt-1">
                                    <div className="bg-blue-100 rounded-full p-1">
                                        <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                                    </div>
                                </div>
                                <p>Attend District meetings and events and volunteer if you can, this helps people
                                    get to know you as well as letting them get to know you.</p>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Separator className="my-8"/>

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