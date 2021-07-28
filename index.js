const axios = require("axios");
require("dotenv").config();

const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY;
const URL = process.env.URL;
const DEVICE = process.env.DEVICE;
const ROUNDS = +process.env.ROUNDS;

const getScoresSeq = async () => {
	try {
		for (let i = 1; i <= ROUNDS; i++) {
			const result = await calculatePerformance(URL, DEVICE);
			console.log(i, result);
		}
	} catch (err) {
		console.error(err);
	}
};

const calculatePerformance = async (url, device) => {
	try {
		const lhr = await callAPI(url, device);

		if (!lhr) {
			console.error("Error while calling lighthouse");
			return;
		}

		const summary = {
			Date: today(),
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

		return summary;
	} catch (err) {
		console.error(err);
	}
};

const callAPI = async (page, device) => {
	try {
		const json = await axios.get("https://www.googleapis.com/pagespeedonline/v5/runPagespeed", {
			params: {
				key: PAGESPEED_API_KEY,
				url: page,
				strategy: device,
			},
		});

		return json.data.lighthouseResult;
	} catch (err) {
		console.error(err);
	}
};

function today(separator) {
	let todayDate = new Date().toLocaleString("en-US", { timeZone: "America/New_York" }).split(",")[0];
	if (separator) return todayDate.replace("/", separator);
	return todayDate;
}

(async function () {
	await getScoresSeq();
})();
