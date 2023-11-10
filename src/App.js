import "./App.css";
import { useEffect, useState } from "react";
import HighsService from "./Service/Highs/HighsService";
import MultiInput from "./Components/MultiInput/MultiInput";
import fr from "./i18n/fr.json";
import en from "./i18n/en.json";
import i18next from "i18next";
import { I18nextProvider } from "react-i18next";
import { Button, Col, Row, Space } from "tiny-ui";
import "./general.css"

export default function App() {
	i18next.init({
		interpolation: { escapeValue: false },
		lng: "fr",
		resources: {
			en: { translation: en },
			fr: { translation: fr },
		},
	});
	const [objets, setObjets] = useState([
		5593260, 2474503, 2311323, 1680129, 1344077, 1268699, 916753, 773860,
		746492, 680925, 577131, 450023, 432339, 413107, 353431, 334615, 320416,
		310604, 308216, 235674, 226024, 215287, 212325, 193524, 189843, 351973,
		269750, 264238, 171180, 159226,
	]);
	const [sac, setSac] = useState([
		225000, 262000, 322000, 345000, 487000, 517000, 585000, 787000, 862000,
		975000, 1240000, 1300000, 1570000, 1950000, 2250000, 2700000, 3670000,
		3900000, 4570000, 6070000, 6370000, 7500000, 8770000,
	]);
	const [sacRempli, setSacRempli] = useState({});
	const [notUse, setNotUse] = useState([]);
    const [sacType, setSacType] = useState(1);

	useEffect(() => {
		HighsService({ objets: objets, sacs: sac }).then(
			([sacRempli, notUse]) => {
				setSacRempli(sacRempli);
				setNotUse(notUse);
			}
		);
	}, []);

	return (
		<I18nextProvider i18n={i18next} className="App">
            <Row justify="center" align="top" className="mt-4">
                <Col span={8}>
                    <MultiInput type="fellow" />
                </Col>
                <Col span={8} offset={4}>
                    <Space direction="vertical" align="start">
                        <Button btnType={sacType === 1 ? "info" : "default"} onClick={() => setSacType(1)}>{i18next.t("sacType.mine")}</Button>
                        <Button btnType={sacType === 2 ? "info" : "default"} onClick={() => setSacType(2)}>{i18next.t("sacType.sandtopia")}</Button>
                        <Button btnType={sacType === 3 ? "info" : "default"} onClick={() => setSacType(3)}>{i18next.t("sacType.perso")}</Button>
                        <MultiInput className={sacType === 3 ? "" : "d-n"} type="obj" />
                    </Space>
                </Col>
            </Row>
		</I18nextProvider>
	);
}
