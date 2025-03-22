import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage as BreadcrumbPageUI,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

interface BreadcrumbPageItem {
    title: string;
    href: string;
    active: boolean;
}

interface BreadcrumbsProps {
    pages: BreadcrumbPageItem[];
}

const Breadcrumbs = ({ pages }: BreadcrumbsProps) => {
    return (
        <Breadcrumb className={'mb-4'}>
            <BreadcrumbList>
                {pages.map((page, index) => {
                    const isLast = index === pages.length - 1;

                    return (
                        <Fragment key={index}>
                            <BreadcrumbItem>
                                {isLast || page.active ? (
                                    <BreadcrumbPageUI>{page.title}</BreadcrumbPageUI>
                                ) : (
                                    <BreadcrumbLink href={page.href}>{page.title}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>

                            {!isLast && (
                                <BreadcrumbSeparator />
                            )}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrumbs;