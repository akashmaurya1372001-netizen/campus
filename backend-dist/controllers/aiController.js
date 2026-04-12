import { GoogleGenAI, Type } from "@google/genai";
const getAIClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new GoogleGenAI({ apiKey });
};
const parseAIOptions = (text) => {
    try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
            return parsed.filter((item) => typeof item === "string");
        }
    }
    catch {
        // ignore invalid JSON and attempt to parse line-by-line
    }
    const lines = text
        .split(/\r?\n/)
        .map((line) => line.replace(/^[\d\-\)\.\s]+/, "").trim())
        .filter(Boolean);
    return lines.slice(0, 4);
};
// @desc    Analyze sentiment of an issue
// @route   POST /api/ai/analyze
// @access  Private
export const analyzeSentiment = async (req, res) => {
    try {
        const { text } = req.body;
        const ai = getAIClient();
        if (!ai) {
            return res.json({ sentiment: "neutral" });
        }
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Analyze the sentiment of this campus issue and classify it as exactly one of: "positive", "negative", or "urgent". Only return the single word. Issue: "${text}"`,
        });
        const sentiment = response.text?.trim().toLowerCase() || "neutral";
        const validSentiments = ["positive", "negative", "urgent"];
        const finalSentiment = validSentiments.includes(sentiment)
            ? sentiment
            : "neutral";
        res.json({ sentiment: finalSentiment });
    }
    catch (error) {
        console.error("AI Analyze Error:", error);
        res
            .status(500)
            .json({ message: "Failed to analyze sentiment", error: error.message });
    }
};
// @desc    Generate poll options from a topic
// @route   POST /api/ai/generate-poll
// @access  Private
export const generatePoll = async (req, res) => {
    try {
        const { topic } = req.body;
        const ai = getAIClient();
        if (!ai) {
            const fallbackOptions = [
                `Improve ${topic}`,
                `Discuss ${topic}`,
                `Plan around ${topic}`,
                `Vote on ${topic}`,
            ];
            return res.json({ options: fallbackOptions });
        }
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Generate exactly 4 distinct, concise poll options for a university campus poll about this topic: "${topic}".`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.STRING,
                    },
                },
            },
        });
        const options = parseAIOptions(response.text || "");
        res.json({
            options: options.length
                ? options.slice(0, 4)
                : [
                    `Improve ${topic}`,
                    `Discuss ${topic}`,
                    `Plan around ${topic}`,
                    `Vote on ${topic}`,
                ],
        });
    }
    catch (error) {
        console.error("AI Generate Poll Error:", error);
        res
            .status(500)
            .json({
            message: "Failed to generate poll options",
            error: error.message,
        });
    }
};
// @desc    Moderate comment
// @route   POST /api/ai/moderate
// @access  Private
export const moderateComment = async (req, res) => {
    try {
        const { text } = req.body;
        const ai = getAIClient();
        if (!ai) {
            return res.json({ isToxic: false });
        }
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `Is this comment toxic, offensive, or inappropriate for a university forum? Answer with exactly "yes" or "no". Comment: "${text}"`,
        });
        const isToxic = response.text?.trim().toLowerCase() === "yes";
        res.json({ isToxic });
    }
    catch (error) {
        console.error("AI Moderation Error:", error);
        res
            .status(500)
            .json({ message: "Failed to moderate comment", error: error.message });
    }
};
//# sourceMappingURL=aiController.js.map