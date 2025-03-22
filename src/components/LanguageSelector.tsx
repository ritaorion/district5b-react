import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Language {
    code: string;
    name: string;
    flag: string;
}

const LanguageSelector: React.FC = () => {
    const { i18n } = useTranslation();

    const languages: Language[] = [
        { code: "en", name: "English", flag: "🇺🇸" },
        { code: "es", name: "Español", flag: "🇪🇸" },
    ];

    const [currentLanguage, setCurrentLanguage] = useState<Language>(
        languages.find((lang) => lang.code === i18n.language) || languages[0]
    );

    const handleLanguageChange = (language: Language) => {
        i18n.changeLanguage(language.code).then(() => console.log('Language Changed.') );
        setCurrentLanguage(language);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-32">
                    <span>{currentLanguage.flag}</span>
                    <span className="flex-1 text-left">{currentLanguage.name}</span>
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => handleLanguageChange(language)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <span className="flex items-center gap-2">
                            <span>{language.flag}</span>
                            <span>{language.name}</span>
                        </span>
                        {currentLanguage.code === language.code && <Check className="h-4 w-4" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelector;