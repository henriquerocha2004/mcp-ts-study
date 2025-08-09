import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "MCP-TS-Study/1.0.0";
const server = new McpServer({
    name: "MCP-TS-Study",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {}
    },
});
async function makeNWSRequest(url) {
    const headers = {
        "User-Agent": USER_AGENT,
        "Accept": "application/geo+json"
    };
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error making NWS request:", error);
        throw error;
    }
}
function formatAlert(feature) {
    const props = feature.properties;
    return [
        `Event: ${props.event || "N/A"}`,
        `Area: ${props.areaDesc || "N/A"}`,
        `Severity: ${props.severity || "N/A"}`,
        `Status: ${props.status || "N/A"}`,
        `Headline: ${props.headline || "N/A"}`
    ].join("\n");
}
server.tool("get_alerts", "Retrieve active weather alerts", {
    state: z.string().length(2).describe("State code (e.g., CA, NY)"),
}, async ({ state }) => {
    const stateCode = state.toUpperCase();
    const url = `${NWS_API_BASE}/alerts/active?area=${stateCode}`;
    const alertsData = await makeNWSRequest(url);
    if (!alertsData) {
        return {
            content: [
                {
                    type: "text",
                    text: `failed to retrieve alerts data`
                },
            ],
        };
    }
    const features = alertsData.features || [];
    if (features.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `No active alerts for ${stateCode}.`
                },
            ],
        };
    }
    const formattedAlerts = features.map(formatAlert);
    const alertsText = `Active alerts for ${stateCode}:\n\n` + formattedAlerts.join("\n\n");
    return {
        content: [
            {
                type: "text",
                text: alertsText
            },
        ],
    };
});
server.tool("get_forecast", "Retrieve weather forecast for a specific location", {
    latitude: z.number().min(-90).max(90).describe("Latitude of the location"),
    longitude: z
        .number()
        .min(-180)
        .max(180)
        .describe("Longitude of the location"),
}, async ({ latitude, longitude }) => {
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest(pointsUrl);
    if (!pointsData) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
                },
            ],
        };
    }
    const forecastUrl = pointsData.properties.forecast;
    if (!forecastUrl) {
        return {
            content: [
                {
                    type: "text",
                    text: `No forecast URL found for coordinates: ${latitude}, ${longitude}.`,
                },
            ],
        };
    }
    const forecastData = await makeNWSRequest(forecastUrl);
    if (!forecastData) {
        return {
            content: [
                {
                    type: "text",
                    text: `Failed to retrieve forecast data for coordinates: ${latitude}, ${longitude}.`,
                },
            ],
        };
    }
    const periods = forecastData.properties.periods || [];
    if (periods.length === 0) {
        return {
            content: [
                {
                    type: "text",
                    text: `No forecast periods found for coordinates: ${latitude}, ${longitude}.`,
                },
            ],
        };
    }
    const formattedForecast = periods.map(period => {
        return [
            `Name: ${period.name || "N/A"}`,
            `Temperature: ${period.temperature || "N/A"} ${period.temperatureUnit || "N/A"}`,
            `Wind: ${period.windSpeed || "N/A"} ${period.windDirection || "N/A"}`,
            `Short Forecast: ${period.shortForecast || "N/A"}`
        ].join("\n");
    }).join("\n\n");
    return {
        content: [
            {
                type: "text",
                text: `Forecast for coordinates ${latitude}, ${longitude}:\n\n` + formattedForecast
            },
        ],
    };
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Weather MCP Server running on stdio");
}
main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});
