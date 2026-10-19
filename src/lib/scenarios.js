// Joel fills targetPhrases with checked Malayalam (Manglish). The AI is told to steer toward these.
export const SCENARIOS = {
  uncle: {
    title: "Do you speak Malayalam?",
    character: "an uncle at a family gathering in the US",
    setting: "he asks about school, college plans, and whether you speak Malayalam",
    targetPhrases: ["enikku Malayalam ariyam", "njan 12th-il aanu padikkunnathu", "college-il apply cheyyunnu"],
  },
  grandma: {
    title: "Calling grandma",
    character: "a grandmother in Kerala on a video call",
    setting: "she asks about food, health, school, and when you will visit",
    targetPhrases: ["kazhicho?", "njan sukhamayi irikkunnu", "summer-il varam"],
  },
  kerala: {
    title: "In Kerala",
    character: "an auto-rickshaw driver in Kochi",
    setting: "you need to get somewhere and ask the price",
    targetPhrases: ["ethra aakum?", "nere pokoo", "ivide nirthikko"],
  },
};
