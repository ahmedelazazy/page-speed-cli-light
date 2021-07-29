const fs = require("fs");
const axios = require("axios");

require("dotenv").config();

const { PAGESPEED_API_KEY, URL, DEVICE, EXP } = process.env;
const ROUNDS = +process.env.ROUNDS;

const getScoresSeq = async () => {
	try {
		let scores = [];
		for (let i = 1; i <= ROUNDS; i++) {
			const result = await calculatePerformance(URL, DEVICE);
			console.log(`#${i}:`, result);
			scores.push(result);
		}
		return scores;
	} catch (err) {
		console.error(err);
	}
};

const calculatePerformance = async (url, device) => {
	try {
		const response = await axios.get("https://www.googleapis.com/pagespeedonline/v5/runPagespeed", {
			params: {
				key: PAGESPEED_API_KEY,
				url: url,
				strategy: device,
			},
		});

		if (!response || !response.data || !response.data.lighthouseResult) {
			console.error("Error while calling lighthouse");
			return;
		}

		const lhr = response.data.lighthouseResult;

		return {
			Date: today(),
			Time: now(),
			Page: lhr.finalUrl,
			Device: device,
			"Performance Score": Math.trunc(lhr.categories.performance.score * 100),
			"Largest Contentful Paint (s)": lhr.audits["largest-contentful-paint"].displayValue,
			"First Contentful Paint (s)": lhr.audits["first-contentful-paint"].displayValue,
			"Speed Index (s)": lhr.audits["speed-index"].displayValue,
			"Time To Interact (s)": lhr.audits["interactive"].displayValue,
			"Total Blocking Time (ms)": lhr.audits["total-blocking-time"].displayValue,
			"Cumulative Layout Shift": lhr.audits["cumulative-layout-shift"].displayValue,
		};
	} catch (err) {
		console.error(err);
	}
};

const saveResultToFile = (data) => {
	const formatted = data.map((r, i) => ({ [`#${i + 1}`]: r }));
	fs.appendFileSync("output.txt", `\r\n\r\n############## ${now()} - ${EXP || ""} ##############\r\n\r\n`);
	fs.appendFileSync("output.txt", JSON.stringify(formatted, null, 2));
};

const today = () => new Date().toLocaleString("en-US", { timeZone: "America/New_York" }).split(",")[0];
const now = () => new Date().toLocaleString("en-US", { timeZone: "America/New_York" });

(async function () {
	const scores = await getScoresSeq();

	if (scores) {
		saveResultToFile(scores);
		console.log("Updated output.txt");
	}
})();
