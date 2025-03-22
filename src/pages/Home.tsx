import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();
    return (
        <div className="page home-page">
            <h1>Home</h1>
            <p>{t("welcome_message")}</p>
        </div>
    );
};

export default Home;