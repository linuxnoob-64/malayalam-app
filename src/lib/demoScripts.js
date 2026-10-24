/**
 * Multi-turn lines for each scene. Live chat uses these only when VITE_DEMO_CHAT is on.
 * Lines need native-speaker review.
 */

import { EXTRA_SCRIPTS } from "./extraScenes.js";

/** @typedef {{ ml: string, manglish: string, en: string }} Triple */
/** @typedef {{
 *   line: Triple,
 *   correction: null | { said: string, better_manglish: string, en: string },
 *   suggested_reply: Triple,
 *   phrases_used: string[],
 * }} DemoStep */

/**
 * @param {DemoStep[]} steps
 * @param {number} historyLength
 * @param {number} replayIndex 0 = first time, 1+ = replays with shifted dialogue
 */
export function pickDemoStep(steps, historyLength) {
  const base = Math.floor(historyLength / 2);
  const index = base % steps.length;
  const turn = base + 1;
  return { payload: steps[index], turn, done: turn >= 8 };
}

/** @type {Record<string, DemoStep[]>} */
export const DEMO_SCRIPTS = {
  neighbor: [
    {
      line: {
        ml: "ഹലോ! അമേരിക്കയിൽ നിന്ന് വന്നതാണോ?",
        manglish: "hello! America-il ninnu vannathano?",
        en: "Hello! Did you come from America?",
      },
      correction: null,
      suggested_reply: {
        ml: "അതെ, ഞാൻ ഇവിടെ നിന്ന്",
        manglish: "athe, njan ivide ninnu",
        en: "Yes, I am here visiting from there",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "അവിടെ climate എങ്ങനെയുണ്ട്?",
        manglish: "avide climate enganeyundu?",
        en: "How is the weather there?",
      },
      correction: null,
      suggested_reply: {
        ml: "ഇപ്പോൾ നല്ലതാണ്",
        manglish: "ippol nallathaanu",
        en: "It is good now",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "നിങ്ങൾ ഇവിടെ news കേൾക്കുന്നുണ്ടോ?",
        manglish: "ningal ivide news kelkkunnundo?",
        en: "Do you still hear local news here?",
      },
      correction: null,
      suggested_reply: {
        ml: "കുറച്ച് കേൾക്കും",
        manglish: "kurachu kelkkum",
        en: "I hear a little",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "നല്ലത്! വീട്ടിൽ എല്ലാവരും സുഖമാണോ?",
        manglish: "nallathu! veettil ellavarum sukhamano?",
        en: "Good! Is everyone at home doing well?",
      },
      correction: null,
      suggested_reply: {
        ml: "എല്ലാവരും സുഖം",
        manglish: "ellavarum sukham",
        en: "Everyone is fine",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "ഇനി എത്ര ദിവസം ഇവിടെ?",
        manglish: "ini ethra divasam ivide?",
        en: "How many more days are you here?",
      },
      correction: null,
      suggested_reply: {
        ml: "രണ്ട് ആഴ്ച",
        manglish: "randu aazhcha",
        en: "Two weeks",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "ശരി, പിന്നീട് chai കുടിക്കാം.",
        manglish: "shari, pinneed chai kudikkam.",
        en: "Okay, we will have tea later.",
      },
      correction: null,
      suggested_reply: {
        ml: "അതെ, ഉണ്ടാകാം",
        manglish: "athe, undaakam",
        en: "Yes, sure",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "നിങ്ങളുടെ Malayalam നന്നayi!",
        manglish: "ningalude Malayalam nannayi!",
        en: "Your Malayalam is good!",
      },
      correction: null,
      suggested_reply: {
        ml: "നന്ദി!",
        manglish: "nandi!",
        en: "Thank you!",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "പോയി വരാം, സൂക്ഷിക്കണം.",
        manglish: "pooyi vaaram, sooShikkanam.",
        en: "Bye, take care.",
      },
      correction: null,
      suggested_reply: {
        ml: "പോയി വരാം",
        manglish: "pooyi vaaram",
        en: "Bye",
      },
      phrases_used: [],
    },
  ],
  uncle: [
    step(
      "ഹലോ! നിനക്ക് മലയാളം അറിയാമോ?",
      "hello! ninakku Malayalam ariyamo?",
      "Hello! Do you know Malayalam?",
      "ariyam, kurachu",
      "Yes, a little",
    ),
    step(
      "ഏത് ക്ലാസിലാ?",
      "ethu classila?",
      "Which grade are you in?",
      "njan 12th-il aanu padikkunnathu",
      "I am in 12th grade",
    ),
    step(
      "college-il apply ചെയ്തോ?",
      "college-il apply cheytho?",
      "Did you apply to college?",
      "college-il apply cheyyunnu",
      "I am applying to college",
    ),
    step(
      "ഏത് major?",
      "ethu major?",
      "What major?",
      "computer science",
      "Computer science",
    ),
    step(
      "നല്ലത്! proud ആണ്.",
      "nallathu! proud aanu.",
      "Good! Proud of you.",
      "nanni uncle",
      "Thanks uncle",
    ),
    step(
      "വീട്ടിൽ parent-ന്റെ കൂടെ practice ചെയ്യ്.",
      "veettil parent-inte koode practice cheyy.",
      "Practice with your parent at home.",
      "cheyyam",
      "I will",
    ),
    step(
      "ഇനി Onam-il കാണാം.",
      "ini Onam-il kanaam.",
      "See you at Onam.",
      "athe, kanaam",
      "Yes, see you",
    ),
    step(
      "പോയി വരാം.",
      "pooyi vaaram.",
      "Goodbye.",
      "pooyi vaaram",
      "Bye",
    ),
  ],
  grandma: [
    step("മോളെ, കഴിച്ചോ?", "mole, kazhicho?", "Dear, have you eaten?", "athe, kazhichu", "Yes, I ate"),
    step("സുഖമാണോ?", "sukhamano?", "Are you well?", "njan sukhamayi irikkunnu", "I am doing well"),
    step("എപ്പോൾ വരും?", "eppol varum?", "When will you come?", "summer-il varam", "I will come in summer"),
    step("study നന്നayi?", "study nannayi?", "Studying well?", "padikkunnu", "I am studying"),
    step("ചൂടുണ്ടോ?", "choodundo?", "Is it hot there?", "kurachu undu", "A little"),
    step("അമ്മയോട് hi പറ.", "ammayodu hi para.", "Say hi to mom.", "parayam", "I will tell her"),
    step("സ്നേഹം.", "sneham.", "Love you.", "enikum sneham", "Love you too"),
    step("bye മോളെ.", "bye mole.", "Bye dear.", "bye", "Bye"),
  ],
  kerala: [
    step(
      "എവിടെ പോകണം?",
      "evide pokanam?",
      "Where do you need to go?",
      "Ernakulam railway station",
      "Ernakulam railway station",
    ),
    step(
      "80 rupees aakum.",
      "80 rupees aakum.",
      "That will be 80 rupees.",
      "kurachu kuraykkamo?",
      "Can you lower it a little?",
    ),
    step(
      "ശരി, 70 aakum. kayaru.",
      "shari, 70 aakum. kayaru.",
      "Okay, 70 rupees. Get in.",
      "nanni",
      "Thanks",
    ),
    step(
      "nere pokkanam alle?",
      "nere pokkanam alle?",
      "I go straight this way, right?",
      "athe, nere pokoo",
      "Yes, go straight",
    ),
    step(
      "station samipam. ivide nirthano?",
      "station samipam. ivide nirthano?",
      "We are near the station. Should I stop here?",
      "ivide nirthikko",
      "Stop here",
    ),
    step(
      "shari, nirthunnu.",
      "shari, nirthunnu.",
      "Okay, stopping.",
      "nanni",
      "Thanks",
    ),
    step(
      "70 rupees mathi.",
      "70 rupees mathi.",
      "That will be 70 rupees.",
      "shari",
      "Okay",
    ),
    step(
      "nanni! nanni!",
      "nanni! nanni!",
      "Thank you! Thank you!",
      "pooyi vaaram",
      "Bye",
    ),
  ],
  shop: [
    step(
      "entha venam?",
      "entha venam?",
      "What do you need?",
      "oru packet chips venam",
      "I need one packet of chips",
    ),
    step(
      "ithu 30 rupees.",
      "ithu 30 rupees.",
      "This one is 30 rupees.",
      "ithu ethra?",
      "How much is this?",
    ),
    step(
      "30 rupees aakum.",
      "30 rupees aakum.",
      "It is 30 rupees.",
      "shari, tharoo",
      "Okay, give it please",
    ),
    step(
      "veru entha venam?",
      "veru entha venam?",
      "Anything else?",
      "illa, mathi",
      "No, that is all",
    ),
    step(
      "45 rupees total.",
      "45 rupees total.",
      "45 rupees total.",
      "shari",
      "Okay",
    ),
    step(
      "nanni!",
      "nanni!",
      "Thank you!",
      "nanni",
      "Thank you",
    ),
    step("pooyi varunne.", "pooyi varunne.", "Take care.", "pooyi vaaram", "Bye"),
    step("shari.", "shari.", "Okay.", "shari", "Okay"),
  ],
  market: [
    step(
      "entha venam chechi?",
      "entha venam chechi?",
      "What do you want, dear?",
      "randu kilo urulli",
      "Two kilos of onion",
    ),
    step(
      "fresh aanu. 40 rupees kilo.",
      "fresh aanu. 40 rupees kilo.",
      "It is fresh. 40 rupees per kilo.",
      "shari, randu kilo tharoo",
      "Okay, give me two kilos",
    ),
    step(
      "80 rupees aakum.",
      "80 rupees aakum.",
      "That comes to 80 rupees.",
      "kurachu kuraykkamo?",
      "Can you reduce a little?",
    ),
    step(
      "75 aakum.",
      "75 aakum.",
      "Make it 75.",
      "shari",
      "Okay",
    ),
    step(
      "veru entha?",
      "veru entha?",
      "Anything else?",
      "illa",
      "No",
    ),
    step(
      "nanni chechi.",
      "nanni chechi.",
      "Thank you, dear.",
      "nanni",
      "Thank you",
    ),
    step("pinne varanam.", "pinne varanam.", "Come again.", "athe", "Yes"),
    step("shari.", "shari.", "Okay.", "shari", "Okay"),
  ],
  cousin: [
    step("entha latest?", "entha latest?", "What is new with you?", "school nannayi", "School is going well"),
    step(
      "America-il entha padikkunnu?",
      "America-il entha padikkunnu?",
      "What are you studying in the US?",
      "computer science",
      "Computer science",
    ),
    step(
      "Malayalam jokes manassilaayoo?",
      "Malayalam jokes manassilaayoo?",
      "Do you get Malayalam jokes?",
      "kurachu manassilaayi",
      "I get some of them",
    ),
    step(
      "Kerala-il ethra naal aayi?",
      "Kerala-il ethra naal aayi?",
      "How long since you visited Kerala?",
      "randu varsham",
      "About two years",
    ),
    step(
      "sadya-il favorite entha?",
      "sadya-il favorite entha?",
      "What is your favorite sadya dish?",
      "payasam",
      "Payasam",
    ),
    step(
      "photo edukkam?",
      "photo edukkam?",
      "Should we take a photo?",
      "athe, edukkam",
      "Yes, let us take one",
    ),
    step("nannayi talk cheythu.", "nannayi talk cheythu.", "That was a nice chat.", "nanni", "Thanks"),
    step("pinne kaanam.", "pinne kaanam.", "See you later.", "kanaam", "See you"),
  ],
  momcall: [
    step("kazhicho?", "kazhicho?", "Did you eat?", "kazhichu", "I ate"),
    step("entha kazhichu?", "entha kazhichu?", "What did you eat?", "rice and curry", "Rice and curry"),
    step("padikkunnoo?", "padikkunnoo?", "Are you studying?", "padikkunnu", "I am studying"),
    step(
      "raatri nalla thookkam?",
      "raatri nalla thookkam?",
      "Are you sleeping enough at night?",
      "shari, nalla thookkam",
      "Yes, I sleep fine",
    ),
    step(
      "phone kurachu kammi cheyy.",
      "phone kurachu kammi cheyy.",
      "Use your phone a little less.",
      "shari amma",
      "Okay, Amma",
    ),
    step("sukham alle?", "sukham alle?", "You are okay, right?", "sukham", "I am fine"),
    step("miss you.", "miss you.", "I miss you.", "enikum miss", "I miss you too"),
    step("bye molay.", "bye molay.", "Bye, dear.", "bye", "Bye"),
  ],
  homestay: [
    step(
      "evide padukkam?",
      "evide padukkam?",
      "Where will you sleep tonight?",
      "melle room shari",
      "The upstairs room is fine",
    ),
    step(
      "fresh towel indu.",
      "fresh towel indu.",
      "There is a fresh towel for you.",
      "nanni",
      "Thank you",
    ),
    step(
      "raatri bhakshanam ethra mani?",
      "raatri bhakshanam ethra mani?",
      "What time is dinner tonight?",
      "8 mani alle?",
      "Is it at 8?",
    ),
    step(
      "athe, 8 mani.",
      "athe, 8 mani.",
      "Yes, at 8 o'clock.",
      "shari",
      "Okay",
    ),
    step(
      "bathroom evide?",
      "bathroom evide?",
      "Where is the bathroom?",
      "aduthe room",
      "The next room over",
    ),
    step(
      "kazhicho enkil kurachu rest cheyy.",
      "kazhicho enkil kurachu rest cheyy.",
      "If you have eaten, rest a little.",
      "kazhichu, rest cheyyam",
      "I ate, I will rest",
    ),
    step(
      "nanni vannathu.",
      "nanni vannathu.",
      "Thanks for coming.",
      "nanni",
      "Thank you",
    ),
    step("shari.", "shari.", "Okay.", "shari", "Okay"),
  ],
  airport: [
    step(
      "flight nallaayi?",
      "flight nallaayi?",
      "Was the flight okay?",
      "athe, nannayi",
      "Yes, it was fine",
    ),
    step(
      "luggage ellam indo?",
      "luggage ellam indo?",
      "Do you have all your luggage?",
      "indu",
      "Yes, I have it all",
    ),
    step(
      "evide thamasikkum?",
      "evide thamasikkum?",
      "Where will you stay?",
      "ammayude veetil",
      "At Amma's house",
    ),
    step(
      "kazhichittundo?",
      "kazhichittundo?",
      "Have you eaten?",
      "airport-il kurachu",
      "A little at the airport",
    ),
    step(
      "car ready aanu.",
      "car ready aanu.",
      "The car is ready outside.",
      "nanni uncle",
      "Thanks, uncle",
    ),
    step(
      "traffic undu, kurch wait.",
      "traffic undu, kurch wait.",
      "There is traffic, we may wait a bit.",
      "shari",
      "Okay",
    ),
    step(
      "ammayodu call cheyy.",
      "ammayodu call cheyy.",
      "Call your mother when we get close.",
      "cheyyam",
      "I will call",
    ),
    step("vaa.", "vaa.", "Come, let us go.", "varam", "I am coming"),
  ],
  restaurant: [
    step("entha venam?", "entha venam?", "What would you like?", "randu chaya", "Two teas"),
    step(
      "strong alle light alle?",
      "strong alle light alle?",
      "Strong tea or light tea?",
      "light venam",
      "Light tea please",
    ),
    step(
      "pazhampori fresh aanu.",
      "pazhampori fresh aanu.",
      "The banana fritters are fresh.",
      "randu edukkam",
      "We will take two",
    ),
    step(
      "45 rupees aakum.",
      "45 rupees aakum.",
      "That will be 45 rupees.",
      "shari",
      "Okay",
    ),
    step(
      "nannayi alle?",
      "nannayi alle?",
      "Tastes good, right?",
      "nannayi",
      "It is good",
    ),
    step("veru entha?", "veru entha?", "Anything else?", "illa mathi", "No, that is all"),
    step("nanni!", "nanni!", "Thank you!", "nanni", "Thank you"),
    step("pinne varanam.", "pinne varanam.", "Come again.", "athe", "Yes"),
  ],
  onam: [
    step(
      "sadya start cheytho?",
      "sadya start cheytho?",
      "Has the sadya started?",
      "athe, kazhikkam",
      "Yes, let us eat",
    ),
    step(
      "payasam edukkoo.",
      "payasam edukkoo.",
      "Take some payasam.",
      "nanni",
      "Thanks",
    ),
    step(
      "kurachu kooduth kazhikkoo.",
      "kurachu kooduth kazhikkoo.",
      "Eat a little more.",
      "kazhichu",
      "I ate",
    ),
    step(
      "pookalam nannayi alle?",
      "pookalam nannayi alle?",
      "The flower rangoli looks nice, right?",
      "valare nannayi",
      "It looks very nice",
    ),
    step(
      "Happy Onam!",
      "Happy Onam!",
      "Happy Onam!",
      "Happy Onam",
      "Happy Onam",
    ),
    step(
      "photo edukkam?",
      "photo edukkam?",
      "Should we take a photo?",
      "athe",
      "Yes",
    ),
    step("nannayi celebrate cheythu.", "nannayi celebrate cheythu.", "We celebrated well.", "nanni", "Thanks"),
    step("pinne kaanam.", "pinne kaanam.", "See you later.", "kanaam", "See you"),
  ],
  teacher: [
    step(
      "veettil Malayalam samsarikkunnundo?",
      "veettil Malayalam samsarikkunnundo?",
      "Do you speak Malayalam at home?",
      "samsarikkunnu",
      "We speak it at home",
    ),
    step(
      "parent-ine help cheyyunnundo?",
      "parent-ine help cheyyunnundo?",
      "Do you help your parent understand?",
      "cheyyunnu",
      "I help sometimes",
    ),
    step(
      "ivide oru vakyam vayikkoo.",
      "ivide oru vakyam vayikkoo.",
      "Read this sentence aloud.",
      "shari",
      "Okay",
    ),
    step(
      "nannayi padichittundu.",
      "nannayi padichittundu.",
      "You have been studying well.",
      "nanni teacher",
      "Thank you, teacher",
    ),
    step(
      "next class same time.",
      "next class same time.",
      "Next class is at the same time.",
      "shari",
      "Okay",
    ),
    step(
      "progress nannayi.",
      "progress nannayi.",
      "Your progress is good.",
      "nanni",
      "Thank you",
    ),
    step("pinne varanam.", "pinne varanam.", "Please come again.", "varum", "I will come"),
    step("shari.", "shari.", "Okay.", "shari", "Okay"),
  ],
  bus: [
    step(
      "ningal evide pokanam?",
      "ningal evide pokanam?",
      "Where do you need to go?",
      "town-il pokanam",
      "I need to go to town",
    ),
    step(
      "ee bus town-il pokum.",
      "ee bus town-il pokum.",
      "This bus goes to town.",
      "shari, kayaru",
      "Okay, I will get on",
    ),
    step(
      "ticket 25 rupees.",
      "ticket 25 rupees.",
      "The ticket is 25 rupees.",
      "shari",
      "Okay",
    ),
    step(
      "market stop next aanu.",
      "market stop next aanu.",
      "The market stop is next.",
      "nanni",
      "Thanks",
    ),
    step(
      "window seat open aanu.",
      "window seat open aanu.",
      "There is a window seat open.",
      "nanni",
      "Thanks",
    ),
    step(
      "town samipam.",
      "town samipam.",
      "We are near town.",
      "shari",
      "Okay",
    ),
    step(
      "ivide nirthano?",
      "ivide nirthano?",
      "Should I stop here?",
      "ivide nirthikko",
      "Stop here",
    ),
    step("nanni!", "nanni!", "Thank you!", "nanni", "Thank you"),
  ],
  hospital: [
    step("sukhamano?", "sukhamano?", "Are you feeling okay?", "sukham, nanni", "Fine, thanks"),
    step(
      "doctor vannittundo?",
      "doctor vannittundo?",
      "Has the doctor come yet?",
      "innum alla",
      "Not yet",
    ),
    step(
      "kurachu wait cheyyam.",
      "kurachu wait cheyyam.",
      "We will wait a little longer.",
      "shari",
      "Okay",
    ),
    step(
      "vellam venam?",
      "vellam venam?",
      "Do you want water?",
      "athe, venam",
      "Yes, please",
    ),
    step(
      "thalavanju undo?",
      "thalavanju undo?",
      "Do you have a headache?",
      "kurachu undu",
      "A little",
    ),
    step(
      "doctor kanikkanam.",
      "doctor kanikkanam.",
      "You should see the doctor.",
      "shari",
      "Okay",
    ),
    step("nanni koottathil.", "nanni koottathil.", "Thanks for staying with me.", "nanni", "Thank you"),
    step("varam pinne.", "varam pinne.", "I will come again.", "shari", "Okay"),
  ],
  beach: [
    step(
      "nalla kaattu alle?",
      "nalla kaattu alle?",
      "Nice breeze, right?",
      "athe, valare nannayi",
      "Yes, very nice",
    ),
    step(
      "ice cream venam?",
      "ice cream venam?",
      "Want ice cream?",
      "athe, venam",
      "Yes, I want some",
    ),
    step(
      "kadalil muzhuvan thonniille?",
      "kadalil muzhuvan thonniille?",
      "It has been a while since you swam in the sea?",
      "munpu cheythittund",
      "I have swum before",
    ),
    step(
      "sun set nannayi.",
      "sun set nannayi.",
      "The sunset looks beautiful.",
      "nannayi",
      "It is beautiful",
    ),
    step(
      "photo edukkam?",
      "photo edukkam?",
      "Should we take a photo?",
      "athe",
      "Yes",
    ),
    step(
      "kurachu nikkam.",
      "kurachu nikkam.",
      "Let us stay a little longer.",
      "shari",
      "Okay",
    ),
    step("nannayi evening.", "nannayi evening.", "Nice evening.", "nanni", "Thanks"),
    step("vaa return cheyyam.", "vaa return cheyyam.", "Come, let us head back.", "varam", "I am coming"),
  ],
  monsoon: [
    step(
      "mazha kooduth aanu, ivide nikkoo.",
      "mazha kooduth aanu, ivide nikkoo.",
      "Rain is heavy, wait here.",
      "nanni, chaya venam?",
      "Thanks, can I get tea?",
    ),
    step(
      "chaya ready aakum.",
      "chaya ready aakum.",
      "Tea will be ready soon.",
      "nanni",
      "Thank you",
    ),
    step(
      "umbrella undo?",
      "umbrella undo?",
      "Do you have an umbrella?",
      "illa",
      "No",
    ),
    step(
      "kurachu kazhinjal mazha thammilum.",
      "kurachu kazhinjal mazha thammilum.",
      "Rain should ease in a little while.",
      "shari",
      "Okay",
    ),
    step(
      "nalla mazha!",
      "nalla mazha!",
      "What heavy rain!",
      "athe",
      "Yes",
    ),
    step(
      "chaya nannayi.",
      "chaya nannayi.",
      "The tea is good.",
      "nannayi",
      "It is good",
    ),
    step("nanni!", "nanni!", "Thank you!", "nanni", "Thank you"),
    step("pooyi vaaram.", "pooyi vaaram.", "Bye, take care.", "pooyi vaaram", "Bye"),
  ],
  movie: [
    step(
      "movie kandoo?",
      "movie kandoo?",
      "Did you watch the movie?",
      "nannayi",
      "It was good",
    ),
    step(
      "hero nannayi alle?",
      "hero nannayi alle?",
      "The hero was great, right?",
      "athe",
      "Yes",
    ),
    step(
      "story manassilaayoo?",
      "story manassilaayoo?",
      "Did you follow the story?",
      "kurachu confusing",
      "It was a little confusing",
    ),
    step(
      "jokes kettiyo?",
      "jokes kettiyo?",
      "Did you catch the jokes?",
      "kurachu manassilaayi",
      "I caught some of them",
    ),
    step(
      "ending unexpected alle?",
      "ending unexpected alle?",
      "The ending was unexpected, right?",
      "athe",
      "Yes",
    ),
    step(
      "pinne oru movie kandam.",
      "pinne oru movie kandam.",
      "Let us watch another movie sometime.",
      "athe",
      "Yes",
    ),
    step("nannayi discuss cheythu.", "nannayi discuss cheythu.", "Good talk after the movie.", "nanni", "Thanks"),
    step("pooyi vaaram.", "pooyi vaaram.", "Bye.", "pooyi vaaram", "Bye"),
  ],
  cousinsKids: [
    step("vaa kheli!", "vaa kheli!", "Come play!", "varam", "I am coming"),
    step(
      "entha peru?",
      "entha peru?",
      "What is your name?",
      "Joel",
      "Joel",
    ),
    step(
      "cricket aadamo?",
      "cricket aadamo?",
      "Want to play cricket?",
      "aadam",
      "Let us play",
    ),
    step(
      "njan first batting.",
      "njan first batting.",
      "I bat first!",
      "shari",
      "Okay",
    ),
    step(
      "chocolate undo?",
      "chocolate undo?",
      "Do you have chocolate?",
      "illa ippol",
      "Not right now",
    ),
    step(
      "last game, pinne rest.",
      "last game, pinne rest.",
      "Last game, then we rest.",
      "shari",
      "Okay",
    ),
    step("nannayi aadi.", "nannayi aadi.", "That was fun.", "nanni", "Thanks"),
    step("bye!", "bye!", "Bye!", "bye", "Bye"),
  ],
  ...EXTRA_SCRIPTS,
};

/**
 * @param {string} ml
 * @param {string} manglish
 * @param {string} en
 * @param {string} replyManglish
 * @param {string} replyEn
 * @returns {DemoStep}
 */
function step(ml, manglish, en, replyManglish, replyEn) {
  return {
    line: { ml, manglish, en },
    correction: null,
    suggested_reply: { ml: "", manglish: replyManglish, en: replyEn },
    phrases_used: [],
  };
}

/** First scripted character line for preview / scenario card audio (demo content). */
export function getScenarioOpeningLine(scenarioId) {
  const steps = DEMO_SCRIPTS[scenarioId] ?? DEMO_SCRIPTS.neighbor;
  return steps[0]?.line ?? null;
}

export function getDemoTurn(scenarioId, historyLength, replayIndex = 0) {
  const steps = DEMO_SCRIPTS[scenarioId] ?? DEMO_SCRIPTS.neighbor;
  const { payload, turn, done } = pickDemoStep(steps, historyLength, replayIndex);
  return {
    line: payload.line,
    correction: payload.correction,
    suggested_reply: payload.suggested_reply,
    phrases_used: payload.phrases_used ?? [],
    turn,
    done,
    demo: true,
  };
}
