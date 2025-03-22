import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Search } from 'lucide-react';
import { useTranslation } from "react-i18next";
import Breadcrumbs from "@/components/Breadcrumbs.tsx";

interface AcronymData {
    acronym: string;
    description: string;
}

export default function Acronyms() {
    const [searchTerm, setSearchTerm] = useState('');
    const [acronyms, setAcronyms] = useState<AcronymData[]>([]);
    const [filteredAcronyms, setFilteredAcronyms] = useState<AcronymData[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const acronymData: AcronymData[] = [
            { acronym: "AAGV/AA Grapevine", description: t('acronyms.aagv_aa_grapevine') },
            { acronym: "AALV/AA La Viña", description: t('acronyms.aalv_aa_la_vina') },
            { acronym: "AAWS", description: t('acronyms.aaws') },
            { acronym: "Ad Hoc Committee", description: t('acronyms.ad_hoc_committee') },
            { acronym: "ACC", description: t('acronyms.acc') },
            { acronym: "Advisory Action", description: t('acronyms.advisory_action') },
            { acronym: "Agenda Item", description: t('acronyms.agenda_item') },
            { acronym: "Archives", description: t('acronyms.archives') },
            { acronym: "Box 4-5-9", description: t('acronyms.box_4_5_9') },
            { acronym: "BTG/Bridging the Gap", description: t('acronyms.btg_bridging_the_gap') },
            { acronym: "C & T/Corrections & Treatment", description: t('acronyms.c_t_corrections_treatment') },
            { acronym: "Corrections", description: t('acronyms.corrections') },
            { acronym: "DCM/District Committee Member", description: t('acronyms.dcm_district_committee_member') },
            { acronym: "CPC/Cooperation with the Professional Community", description: t('acronyms.cpc_cooperation_with_the_professional_community') },
            { acronym: "GV/Grapevine", description: t('acronyms.gv_grapevine') },
            { acronym: "LV/La Viña", description: t('acronyms.lv_la_vina') },
            { acronym: "NAGSC", description: t('acronyms.nagsc') },
            { acronym: "Delegate", description: t('acronyms.delegate') },
            { acronym: "GSB/General Service Board", description: t('acronyms.gsb_general_service_board') },
            { acronym: "GSC/General Service Conference", description: t('acronyms.gsc_general_service_conference') },
            { acronym: "GSO/General Service Office", description: t('acronyms.gso_general_service_office') },
            { acronym: "GSR/General Service Representative", description: t('acronyms.gsr_general_service_representative') },
            { acronym: "Guidelines", description: t('acronyms.guidelines') },
            { acronym: "H & I/Hospitals & Institutions", description: t('acronyms.h_i_hospitals_institutions') },
            { acronym: "Intergroup/Central Office", description: t('acronyms.intergroup_central_office') },
            { acronym: "Linguistic District", description: t('acronyms.linguistic_district') },
            { acronym: "SAGSC", description: t('acronyms.sagsc') },
            { acronym: "Sense of the Assembly", description: t('acronyms.sense_of_the_assembly') },
            { acronym: "Panel", description: t('acronyms.panel') },
            { acronym: "PRAASA", description: t('acronyms.praasa') },
            { acronym: "PSA", description: t('acronyms.psa_public_service_announcement') },
            { acronym: "PI/Public Information", description: t('acronyms.pi_public_information') },
            { acronym: "Region", description: t('acronyms.region') },
            { acronym: "Regional Forum", description: t('acronyms.regional_forum') },
            { acronym: "Rotation", description: t('acronyms.rotation') },
            { acronym: "Roundtables", description: t('acronyms.roundtables') },
            { acronym: "Simple Majority", description: t('acronyms.simple_majority') },
            { acronym: "Substantial Unanimity", description: t('acronyms.substantial_unanimity') },
            { acronym: "Third Legacy Procedure", description: t('acronyms.third_legacy_procedure') },
            { acronym: "Three Legacies", description: t('acronyms.three_legacies') },
            { acronym: "Trustee", description: t('acronyms.trustee') },
            { acronym: "Trustee-at-large", description: t('acronyms.trustee_at_large') },
            { acronym: "Trustees (Class A)", description: t('acronyms.trustees_class_a') },
            { acronym: "Trustees (Class B)", description: t('acronyms.trustees_class_b') },
            { acronym: "YPAA", description: t('acronyms.ypaa') },
            { acronym: "NACYPAA", description: t('acronyms.nacypaa') },
            { acronym: "LVYPAA", description: t('acronyms.lvypaa') },
        ];
        acronymData.sort((a, b) => a.acronym.localeCompare(b.acronym));

        setAcronyms(acronymData);
        setFilteredAcronyms(acronymData);
    }, [t]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredAcronyms(acronyms);
        } else {
            const filtered = acronyms.filter(
                (acronymItem) =>
                    acronymItem.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    acronymItem.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredAcronyms(filtered);
        }
    }, [searchTerm, acronyms]);

    return (
        <>
            <Breadcrumbs
                pages={[
                    { title: 'Home', href: '/', active: false },
                    { title: 'Acronyms', href: '/acronyms', active: true },
                ]}
            />
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">AA Acronyms and Terms</h1>
                <p className="mb-6">
                    This page provides explanations for common acronyms and terms used in Alcoholics Anonymous.
                    Use the search box to quickly find specific acronyms or descriptions.
                </p>
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400"/>
                    </div>
                    <Input
                        type="text"
                        placeholder="Search acronyms or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <p className="mb-4 text-gray-600">
                    Showing {filteredAcronyms.length} of {acronyms.length} acronyms
                </p>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-1/4">Acronym</TableHead>
                                <TableHead>Description</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAcronyms.length > 0 ? (
                                filteredAcronyms.map((acronymItem, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            className="font-medium whitespace-normal break-words">{acronymItem.acronym}</TableCell>
                                        <TableCell
                                            className="whitespace-normal break-words">{acronymItem.description}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center py-4">
                                        No acronyms found matching your search term.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}