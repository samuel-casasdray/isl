const highs_settings = {
	locateFile: (file) => "https://lovasoa.github.io/highs-js/" + file,
};
const highs_promise = require("highs")(highs_settings);

export default async function HighsService(props) {
	const highs = await highs_promise;
	const nombre_objet = props.objets.length;
	const nombre_sac = props.sacs.length;
	const x = Array.from({ length: nombre_objet }, (_, i) =>
		Array.from({ length: nombre_sac }, (_, j) => "x_" + i + "_" + j)
	);
	const y = Array.from({ length: nombre_sac }, (_, j) => "y_" + j);
	let pb = "Maximize\n " + y.join(" + ");
	let constraints = [];
	for (let j = 0; j < nombre_sac; j++)
		constraints.push(
			Array.from(
				{ length: nombre_objet },
				(_, i) => props.objets[i] + " " + x[i][j]
			).join(" + ") +
				" -" +
				props.sacs[j] +
				" " +
				y[j] +
				" >= 0"
		);
	for (let i = 0; i < nombre_objet; i++)
		constraints.push(
			Array.from({ length: nombre_sac }, (_, j) => x[i][j]).join(" + ") +
				" <= 1"
		);
	for (let j = 0; j < nombre_sac - 1; j++)
		constraints.push(y[j] + " -" + y[j + 1] + " >= 0");
	pb +=
		"\nSubject To\n " +
		constraints.join("\n ") +
		"\nBounds\n " +
		y.map((v) => "0 <= " + v + " <= 1").join("\n ") +
		"\n " +
		[]
			.concat(...x)
			.map((v) => "0 <= " + v + " <= 1")
			.join("\n ") +
		"\nGeneral\n " +
		[]
			.concat(...x)
			.concat(...y)
			.join(" ") +
		"\nEnd";
	let sol = highs.solve(pb);
	let sacRempli = [];
	let notUse = [];
	for (let j = 0; j < nombre_sac; j++) {
		let sr = {
			fill: sol.Columns[y[j]].Primal === 1,
			objets: [],
			capacity: props.sacs[j],
			weight: 0,
		};
		for (let i = 0; i < nombre_objet; i++) {
			if (sol.Columns[x[i][j]].Primal === 1) {
				sr.objets.push(props.objets[i]);
				sr.weight += props.objets[i];
			}
		}
		sacRempli.push(sr);
	}
	for (let i = 0; i < nombre_objet; i++) {
		let use = false;
		for (let j = 0; j < nombre_sac; j++) {
			if (sol.Columns[x[i][j]].Primal === 1) {
				use = true;
				break;
			}
		}
		if (!use) notUse.push(props.objets[i]);
	}
	return [sacRempli, notUse];
}
