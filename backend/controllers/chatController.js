
const responses = {
    water: "Most plants need watering when the top 1-2 inches of soil feel dry. Succulents can go 2-3 weeks between waterings, while tropical plants prefer consistently moist soil. Always check the soil before watering!",
    yellow: "Yellow leaves usually indicate overwatering, underwatering, or nutrient deficiency. Check if the soil is too wet or too dry first, then consider fertilizing. Also inspect the undersides of leaves for pests!",
    indoor: "Great beginner indoor plants include Pothos, Snake Plant, Spider Plant, ZZ Plant, and Peace Lily. They're all forgiving, low-maintenance, and can tolerate lower light conditions.",
    beginner: "The easiest plants to start with are Pothos, Snake Plant, and Spider Plant. They're nearly impossible to kill, require minimal light, and only need watering every 1-2 weeks.",
    light: "Most houseplants prefer bright, indirect light near a window. Direct sunlight can scorch leaves, while too little light causes leggy, pale growth. Rotate your plants every few weeks for even growth.",
    sun: "Most houseplants prefer bright, indirect light. South-facing windows provide the most light. If your plant is stretching towards the light, it needs more sun.",
    pest: "For common pests like spider mites, mealybugs, and aphids, mix neem oil with water and dish soap, then spray on all leaf surfaces. Repeat every 7-10 days. Isolate affected plants immediately!",
    fertilize: "Feed your plants during the growing season (spring and summer) with a balanced liquid fertilizer every 2-4 weeks. Reduce or stop fertilizing in fall and winter when plant growth naturally slows.",
    repot: "Repot when roots start coming out of the drainage holes, usually every 1-2 years. Choose a pot 1-2 inches larger and use fresh potting mix. Spring is the best time to repot.",
    soil: "Most houseplants do well in a well-draining potting mix. Succulents need a gritty, fast-draining cactus mix. Add perlite to regular potting soil to improve drainage for most plants.",
    propagate: "Most plants can be propagated from stem cuttings. Cut just below a leaf node, remove lower leaves, and place in water or moist soil. Roots typically appear in 2-4 weeks. Keep in bright indirect light!",
    humid: "Most tropical houseplants prefer 40-60% humidity. Group plants together, use a pebble tray with water, or run a humidifier nearby. Avoid misting as it can promote fungal diseases.",
    temperature: "Most houseplants prefer temperatures between 60-80°F (15-27°C). Keep plants away from cold drafts, heating vents, and air conditioners. Sudden temperature changes can stress your plants.",
    root: "Root rot is caused by overwatering and poor drainage. Signs include mushy stems, yellowing leaves, and a bad smell. Remove the plant, trim rotted roots, let dry, then repot in fresh dry soil.",
    succulent: "Succulents need bright light (6+ hours), well-draining soil, and infrequent watering. Use the soak and dry method — water thoroughly then let the soil dry completely before watering again.",
};

exports.chat = async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: "Messages array is required" });
        }

        const lastMessage = messages[messages.length - 1];
        const question = lastMessage.content.toLowerCase();

        // Find matching response
        let reply = null;
        for (const [keyword, response] of Object.entries(responses)) {
            if (question.includes(keyword)) {
                reply = response;
                break;
            }
        }

        // Default response
        if (!reply) {
            reply = "That's a great plant care question! For the best advice, I recommend checking our Plant Guides section for detailed care instructions, or posting in the Q&A Forum where our expert gardeners can help you with personalized advice.";
        }

        // Add a small delay to simulate thinking
        await new Promise((resolve) => setTimeout(resolve, 1000));
        res.json({ reply });
    } catch (error) {
        console.error("Chat error:", error.message);
        res.status(500).json({ message: "Chatbot temporarily unavailable." });
    }
};