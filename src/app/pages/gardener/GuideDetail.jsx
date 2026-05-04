// src/app/pages/gardener/GuideDetail.jsx
import { ArrowLeft, Bookmark, Clock, Tag } from "lucide-react";
import { Link, useParams } from "react-router";
import { useState } from "react";

// Static guide content — later replace with API call to /api/guides/:id
const guidesData = {
    "1": {
        title: "Complete Guide to Indoor Plant Care",
        description: "Everything you need to know about caring for indoor plants, from lighting to watering schedules.",
        imageUrl: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&h=400&fit=crop",
        readTime: "8 min read",
        category: ["indoor", "beginner"],
        author: "Rawda Experts",
        content: [
            {
                heading: "Understanding Light Requirements",
                body: "Light is the most important factor for indoor plant health. Most houseplants thrive in bright, indirect light — meaning near a window but not in direct sunlight. South-facing windows provide the most light, while north-facing windows provide the least. Rotate your plants every few weeks to ensure even growth.",
            },
            {
                heading: "Watering Basics",
                body: "Overwatering is the number one killer of indoor plants. Before watering, always check the top 1-2 inches of soil. If it feels dry, it's time to water. If it still feels moist, wait another day or two. Use room-temperature water and water until it drains from the bottom of the pot.",
            },
            {
                heading: "Soil and Repotting",
                body: "Use well-draining potting mix suitable for your plant type. Most houseplants need repotting every 1-2 years when roots start coming out of the drainage holes. Choose a pot 1-2 inches larger than the current one. Spring is the best time to repot.",
            },
            {
                heading: "Humidity and Temperature",
                body: "Most indoor plants prefer temperatures between 60-80°F (15-27°C). Avoid placing plants near heating vents, air conditioners, or drafty windows. Tropical plants like higher humidity — group them together or use a pebble tray with water to increase moisture in the air.",
            },
            {
                heading: "Fertilizing",
                body: "Feed your plants during the growing season (spring and summer) with a balanced liquid fertilizer every 2-4 weeks. Reduce or stop fertilizing in fall and winter when plant growth slows. Always water before fertilizing to avoid burning the roots.",
            },
        ],
    },
    "2": {
        title: "Natural Pest Control Methods",
        description: "Organic and eco-friendly ways to protect your plants from common pests without harsh chemicals.",
        imageUrl: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop",
        readTime: "6 min read",
        category: ["pest-control", "outdoor"],
        author: "Rawda Experts",
        content: [
            {
                heading: "Identifying Common Pests",
                body: "The first step in pest control is identification. Common indoor pests include spider mites (tiny dots on leaves), mealybugs (white cottony clusters), fungus gnats (small flies around soil), and aphids (small green or black insects on new growth). Inspect your plants regularly, especially the undersides of leaves.",
            },
            {
                heading: "Neem Oil Solution",
                body: "Neem oil is one of the most effective natural pesticides. Mix 2 teaspoons of neem oil, 1 teaspoon of dish soap, and 1 quart of water in a spray bottle. Apply to all surfaces of the plant, including undersides of leaves. Repeat every 7-10 days until pests are gone. Apply in the evening to avoid leaf burn.",
            },
            {
                heading: "Rubbing Alcohol Treatment",
                body: "For mealybugs and scale insects, dip a cotton swab in 70% isopropyl alcohol and dab directly on the pests. For larger infestations, dilute the alcohol with water (1:1 ratio) and spray on affected areas. Test on a small area first as some plants are sensitive.",
            },
            {
                heading: "Preventive Measures",
                body: "Prevention is better than treatment. Quarantine new plants for 2 weeks before placing them near other plants. Keep leaves clean by wiping them with a damp cloth. Avoid overwatering which attracts fungus gnats. Ensure good airflow around plants to discourage pest infestations.",
            },
        ],
    },
    "3": {
        title: "Mastering Plant Watering",
        description: "Learn the art of watering — how much, when, and what signs to look for in your plants.",
        imageUrl: "https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=400&fit=crop",
        readTime: "5 min read",
        category: ["watering", "beginner"],
        author: "Rawda Experts",
        content: [
            {
                heading: "The Golden Rule of Watering",
                body: "Most plants prefer to dry out slightly between waterings. Insert your finger 1-2 inches into the soil — if it feels dry, water thoroughly. If it's still moist, wait. This simple test works for most houseplants and prevents both overwatering and underwatering.",
            },
            {
                heading: "Signs of Overwatering",
                body: "Overwatering signs include yellow leaves, mushy stems, soggy soil that doesn't dry out, root rot smell, and mold on the soil surface. If you notice these signs, reduce watering frequency, improve drainage, and allow the soil to dry out completely before watering again.",
            },
            {
                heading: "Signs of Underwatering",
                body: "Underwatered plants show wilting or drooping leaves, dry and pulling-away-from-sides soil, crispy brown leaf tips, slow growth, and leaves that feel thin or papery. Water thoroughly and consider moving the plant to a less sunny location temporarily.",
            },
            {
                heading: "Water Quality Matters",
                body: "Many plants are sensitive to chlorine and fluoride in tap water. Let tap water sit overnight before using to allow chlorine to dissipate. Rainwater or filtered water is ideal. Use room-temperature water to avoid shocking the roots. Always water at the base of the plant, not on the leaves.",
            },
        ],
    },
    "4": {
        title: "Propagation 101: Growing New Plants",
        description: "Step-by-step guide to propagating your favorite plants through cuttings and division.",
        imageUrl: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=400&fit=crop",
        readTime: "10 min read",
        category: ["propagation", "indoor"],
        author: "Rawda Experts",
        content: [
            {
                heading: "Stem Cuttings",
                body: "Stem cuttings are the most common propagation method. Cut a 4-6 inch stem just below a leaf node using clean, sharp scissors. Remove the lower leaves, leaving 2-3 leaves at the top. Place in water or moist potting mix. Change water every few days if propagating in water. Roots typically appear in 2-4 weeks.",
            },
            {
                heading: "Leaf Cuttings",
                body: "Plants like succulents and snake plants can be propagated from single leaves. For succulents, gently twist off a healthy leaf and let it dry for 1-2 days. Then place on top of moist cactus soil. For snake plants, cut a leaf into 3-4 inch sections and insert upright into soil.",
            },
            {
                heading: "Division",
                body: "Many plants like peace lilies, spider plants, and hostas can be divided. Remove the plant from its pot and gently separate the root ball into sections, ensuring each section has both roots and leaves. Replant each division in fresh potting mix and water well. This works best in spring.",
            },
            {
                heading: "Caring for New Cuttings",
                body: "Keep new cuttings in bright, indirect light and high humidity. Cover with a clear plastic bag or dome to retain moisture. Don't fertilize until the plant is well-established (about 1 month after roots form). Be patient — some plants take longer to root than others.",
            },
        ],
    },
    "5": {
        title: "Creating a Thriving Outdoor Garden",
        description: "Design and maintain a beautiful outdoor garden with seasonal planting tips and layout ideas.",
        imageUrl: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=400&fit=crop",
        readTime: "12 min read",
        category: ["outdoor", "beginner"],
        author: "Rawda Experts",
        content: [
            {
                heading: "Planning Your Garden",
                body: "Start by observing your outdoor space for a full day. Note which areas get full sun (6+ hours), partial sun (3-6 hours), and shade (less than 3 hours). Sketch a rough layout of your garden beds. Consider the mature size of plants when spacing them. Group plants with similar water and light needs together.",
            },
            {
                heading: "Soil Preparation",
                body: "Good soil is the foundation of a successful garden. Test your soil pH (most plants prefer 6.0-7.0). Amend heavy clay soil with compost and sand for better drainage. Sandy soil benefits from added compost to improve water retention. Add 2-3 inches of compost to garden beds each year.",
            },
            {
                heading: "Seasonal Planting Guide",
                body: "Spring is ideal for most vegetables and cool-season flowers. Summer is perfect for heat-loving plants like tomatoes and zinnias. Fall is great for planting bulbs and preparing beds for spring. Winter is the time to plan, order seeds, and maintain garden tools. Knowing your local frost dates is essential for timing.",
            },
            {
                heading: "Watering and Mulching",
                body: "Water deeply and infrequently to encourage deep root growth. Most gardens need about 1 inch of water per week. Apply 2-3 inches of mulch around plants to retain moisture, suppress weeds, and regulate soil temperature. Keep mulch away from plant stems to prevent rot.",
            },
        ],
    },
    "6": {
        title: "Succulent Care Made Simple",
        description: "The ultimate guide to keeping your succulents happy and healthy with minimal effort.",
        imageUrl: "https://images.unsplash.com/photo-1459156212016-c812468e2115?w=800&h=400&fit=crop",
        readTime: "7 min read",
        category: ["indoor", "beginner", "watering"],
        author: "Rawda Experts",
        content: [
            {
                heading: "Light Requirements",
                body: "Succulents love bright light. Place them in your sunniest window — south or east-facing windows are ideal. They need at least 6 hours of bright light daily. If your succulent starts stretching or leaning towards the light (etiolation), it needs more light. Grow lights work well if natural light is limited.",
            },
            {
                heading: "The Soak and Dry Method",
                body: "The best way to water succulents is the 'soak and dry' method. Water thoroughly until water drains from the bottom, then allow the soil to dry completely before watering again. In summer, this may be every 7-10 days. In winter, once a month or less is sufficient. Never let succulents sit in water.",
            },
            {
                heading: "The Right Soil and Pot",
                body: "Succulents need fast-draining soil. Use a cactus and succulent mix or amend regular potting soil with 50% perlite or coarse sand. Always use pots with drainage holes — this is non-negotiable. Terra cotta pots are ideal as they are porous and allow the soil to dry out faster.",
            },
            {
                heading: "Common Problems and Solutions",
                body: "Mushy, translucent leaves indicate overwatering — reduce watering and improve drainage. Wrinkled leaves indicate underwatering — water more frequently. Brown, crispy tips can indicate too much direct sun — provide some shade. Stretchy, pale growth means insufficient light — move to a brighter location.",
            },
        ],
    },
};

export default function GuideDetail() {
    const { id }  = useParams();
    const [saved, setSaved] = useState(false);
    const [toast, setToast] = useState(null);

    const guide = guidesData[id];

    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const handleSave = () => {
        setSaved(!saved);
        showToast(saved ? "Removed from Saved Guides." : "Added to Saved Guides.");
    };

    if (!guide) {
        return (
            <div className="max-w-4xl mx-auto text-center py-32">
                <p className="text-gray-500 text-lg mb-4">Guide not found.</p>
                <Link to="/gardener/guides" className="text-[#4CAF50] hover:underline">← Back to Guides</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Back */}
            <Link to="/gardener/guides" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="w-5 h-5" /><span>Back to Guides</span>
            </Link>

            {/* Hero Image */}
            <div className="relative rounded-xl overflow-hidden mb-6 h-64 md:h-80">
                <img src={guide.imageUrl} alt={guide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{guide.title}</h1>
                    <div className="flex items-center gap-4 text-white/80 text-sm">
                        <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{guide.readTime}</span>
                        <span>By {guide.author}</span>
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                        saved ? "bg-[#4CAF50] text-white" : "bg-white/80 text-gray-700 hover:bg-white"
                    }`}
                >
                    <Bookmark className="w-5 h-5" fill={saved ? "currentColor" : "none"} />
                </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {guide.category.map((cat) => (
                    <span key={cat} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
            <Tag className="w-3 h-3" />{cat}
          </span>
                ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <p className="text-gray-700 text-lg leading-relaxed">{guide.description}</p>
            </div>

            {/* Content Sections */}
            <div className="space-y-6">
                {guide.content.map((section, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-[#4CAF50] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                {index + 1}
              </span>
                            {section.heading}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{section.body}</p>
                    </div>
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Found this helpful?</h3>
                        <p className="text-sm text-gray-600">Save it to your collection or ask a question in the forum.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            className={`px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2 ${
                                saved ? "bg-[#4CAF50] text-white" : "border border-[#4CAF50] text-[#4CAF50] hover:bg-green-50"
                            }`}
                        >
                            <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
                            {saved ? "Saved" : "Save Guide"}
                        </button>
                        <Link to="/gardener/forum"
                              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                            Ask Community
                        </Link>
                    </div>
                </div>
            </div>

            {toast && (
                <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                    {toast}
                </div>
            )}
        </div>
    );
}