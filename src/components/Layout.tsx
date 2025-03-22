import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetDescription
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator"
import { Menu, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

interface NavItem {
    name: string;
    path: string;
}

interface ResourceItem {
    name: string;
    path: string;
}

const Layout = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();

    const resourceItems: ResourceItem[] = [
        { name: t('primary_navigation.resources.new_gsr_checklist'), path: '/resources/New-GSR-Checklist.pdf' },
        { name: t('primary_navigation.resources.new_meeting_form'), path: '/resources/New-Meeting-Form.pdf' },
        { name: t('primary_navigation.resources.roberts_rules_overview'), path: '/resources/Roberts-Rules-Overview.pdf' },
        { name: t('primary_navigation.resources.sample_gsr_report'), path: '/resources/Sample-GSR-Report.pdf' },
        { name: t('primary_navigation.resources.aa_service_manual'), path: '/resources/AA-Service-Manual-2024-BM-31.pdf' },
        { name: t('primary_navigation.resources.new_group_listing_guidelines'), path: '/resources/New-Group-Listing-Guidelines-Form.pdf' },
        { name: t('primary_navigation.resources.gsr_orientation_manual'), path: '/resources/GSR-Orientation-Manual.pdf' },
        { name: t('primary_navigation.resources.group_information_change'), path: '/resources/Group-Information-Change-Form.pdf' },
        { name: t('primary_navigation.resources.group_contributions'), path: '/resources/Group-Contributions.pdf' },
        { name: t('primary_navigation.resources.aa_member_resource_flyer'), path: '/resources/AA-Member-Resource-Flyer.pdf' },
    ];
    resourceItems.sort((a, b) => a.name.localeCompare(b.name));

    const publicNavItems: NavItem[] = [
        { name: t('primary_navigation.acronyms'), path: '/acronyms' },
        { name: t('primary_navigation.about'), path: '/about' },
        { name: t('primary_navigation.map'), path: '/map' },
        { name: t('primary_navigation.agsr'), path: '/agsr' },
        { name: t('primary_navigation.gsr'), path: '/gsr' },
        { name: t('primary_navigation.meetings'), path: '/meetings' },
        { name: t('primary_navigation.events'), path: '/events' },
    ];

    const authenticatedNavItems: NavItem[] = [
        { name: t('secondary_navigation.dashboard'), path: '/auth/dashboard' },
        { name: t('secondary_navigation.web_forms'), path: '/auth/contact-forms' },
        { name: t('secondary_navigation.users'), path: '/auth/users' },
        { name: t('secondary_navigation.events'), path: '/auth/events' },
        { name: t('secondary_navigation.faqs'), path: '/auth/faqs' },
        { name: t('secondary_navigation.resources'), path: '/auth/resources' },
        { name: t('secondary_navigation.meetings'), path: '/auth/meetings' },
        { name: `${user?.first_name} ${user?.last_name}`, path: '/auth/profile' },
    ];

    const navItems = isAuthenticated ? authenticatedNavItems : publicNavItems;

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const headerStyle = {
        backgroundImage:
            "linear-gradient(to right, rgba(209, 213, 219, 0.15) 1px, transparent 1px), " +
            "linear-gradient(to bottom, rgba(209, 213, 219, 0.1) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
        backgroundColor: "white"
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-10 bg-white border-b" style={headerStyle}>
                <div className="mx-auto px-4">
                    <div className="flex items-center justify-between h-24">
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center">
                                <img
                                    src={'/logo/v2/logo.webp'}
                                    alt="District 5B Logo"
                                    className="h-20 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden">
                            <Sheet
                                open={isMobileMenuOpen}
                                onOpenChange={setIsMobileMenuOpen}
                            >
                                <SheetTrigger>
                                    <span className="flex justify-center items-center w-10 h-10 rounded-md hover:bg-gray-100">
                                        <Menu className="h-5 w-5"/>
                                    </span>
                                </SheetTrigger>
                                <SheetContent side="right" className={'p-6'}>
                                    <SheetTitle>
                                        Navigation Menu
                                    </SheetTitle>
                                    <SheetDescription>
                                        Links to various pages on the site
                                    </SheetDescription>
                                    <nav className="flex flex-col gap-1 mt-8">
                                        {navItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className="px-3 py-2 text-2xl font-medium rounded-md hover:bg-gray-100"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}

                                        {!isAuthenticated && (
                                            <>
                                                <Link
                                                    to="/resources"
                                                    className="px-3 py-2 text-2xl font-medium rounded-md hover:bg-gray-100"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    View All Resources
                                                </Link>
                                                <Link
                                                    to="/contact"
                                                    className="px-3 py-2 text-2xl font-medium rounded-md hover:bg-gray-100"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    Contact
                                                </Link>
                                                <Link
                                                    to="/login"
                                                    className="px-3 py-2 text-2xl font-medium rounded-md hover:bg-gray-100"
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                >
                                                    Login
                                                </Link>
                                            </>
                                        )}

                                        {isAuthenticated && (
                                            <div className="mt-4 border-t pt-4">
                                                <div className="px-3 py-2 text-sm font-medium text-gray-700">
                                                    Logged in as: {user?.first_name} {user?.last_name}
                                                </div>
                                                <Button
                                                    variant="default"
                                                    className="mt-2 w-full"
                                                    onClick={handleLogout}
                                                >
                                                    <LogOut className="mr-2 h-4 w-4"/>
                                                    {t('primary_navigation.logout')}
                                                </Button>
                                            </div>
                                        )}
                                    </nav>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Navigation links (center aligned) - hidden on mobile */}
                        <nav className="hidden md:flex flex-1 justify-center">
                            <ul className="flex justify-center w-full max-w-5xl">
                                {navItems.map((item) => (
                                    <li key={item.name} className="flex-1 text-center">
                                        <Link
                                            to={item.path}
                                            className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 block"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}

                                {/* Resources dropdown in desktop menu */}
                                {!isAuthenticated && (
                                    <li className="flex-1 text-center">
                                        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                                            <DropdownMenuTrigger asChild>
                                                <button
                                                    className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 flex items-center justify-center w-full"
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                >
                                                    {t('primary_navigation.resources_label')}
                                                    <ChevronDown className="ml-1 h-4 w-4"/>
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="center">
                                                <DropdownMenuItem asChild>
                                                    <Link to="/resources" onClick={() => setIsDropdownOpen(false)}>
                                                        <strong>View All Resources</strong>
                                                    </Link>
                                                </DropdownMenuItem>
                                                {resourceItems.map((item, index) => (
                                                    <DropdownMenuItem key={index} asChild>
                                                        <Link to={item.path} onClick={() => setIsDropdownOpen(false)}>
                                                            {item.name}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </li>
                                )}
                            </ul>
                        </nav>

                        {/* Right side actions - hidden on mobile */}
                        <div className="hidden md:flex items-center space-x-4">
                            {!isAuthenticated && (
                                <>
                                    <Button
                                        variant={'outline'}
                                        asChild
                                    >
                                        <Link
                                            to={'/login'}
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            {t('primary_navigation.login')}
                                        </Link>
                                    </Button>
                                    <Button
                                        asChild
                                    >
                                        <Link
                                            to="/contact"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            {t('primary_navigation.contact')}
                                        </Link>
                                    </Button>
                                    <LanguageSelector />
                                </>
                            )}

                            {isAuthenticated && (
                                <div className="flex items-center space-x-3">
                                    <Button
                                        variant="default"
                                        size="default"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="mr-1 h-4 w-4"/>
                                        {t('primary_navigation.logout')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <Outlet/>
                </div>
            </main>

            <footer className="w-full py-6 border-t" style={headerStyle}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} District 5B</p>
                            <p className="text-sm text-muted-foreground">&bull; These pages are neither endorsed nor approved by Alcoholics Anonymous World Services, Inc.</p>
                        </div>

                        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
                            <Link
                                to="/privacy-policy"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Separator orientation="vertical" className="h-4 hidden sm:block"/>
                            <Link
                                to="/cookie-policy"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Cookie Policy
                            </Link>
                            <Separator orientation="vertical" className="h-4 hidden sm:block"/>
                            <Link
                                to="/terms-of-use"
                                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Terms of Use
                            </Link>
                        </nav>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;