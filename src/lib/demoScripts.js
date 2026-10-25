/**
 * Multi-turn lines for each scene. Live chat uses these only when VITE_DEMO_CHAT is on.
 * Manglish is the spoken romanization of the Malayalam line.
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
        ml: "അതെ, അവിടെ നിന്ന് വന്നതാണ്",
        manglish: "athe, avide ninnu vannathaanu",
        en: "Yes, I came from there",
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
        ml: "ശരി, പിന്നീട് ചായ കുടിക്കാം.",
        manglish: "shari, pinneedu chaaya kudikkaam.",
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
        ml: "നിങ്ങളുടെ മലയാളം നന്നായി!",
        manglish: "ningalude malayalam nannayi!",
        en: "Your Malayalam is good!",
      },
      correction: null,
      suggested_reply: {
        ml: "നന്ദി!",
        manglish: "nanni!",
        en: "Thank you!",
      },
      phrases_used: [],
    },
    {
      line: {
        ml: "പോയി വരാം, സൂക്ഷിക്കണം.",
        manglish: "pooyi varaam, sookshikkanam.",
        en: "Bye, take care.",
      },
      correction: null,
      suggested_reply: {
        ml: "പോയി വരാം",
        manglish: "pooyi varaam",
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
      "ethu classilaa?",
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
      "veettil parent-nte koode practice cheyy.",
      "Practice with your parent at home.",
      "cheyyam",
      "I will",
    ),
    step(
      "ഇനി Onam-il കാണാം.",
      "ini Onam-il kaanam.",
      "See you at Onam.",
      "athe, kaanam",
      "Yes, see you",
    ),
    step(
      "പോയി വരാം.",
      "pooyi varaam.",
      "Goodbye.",
      "pooyi varaam",
      "Bye",
    ),
  ],
  grandma: [
    step("മോളെ, കഴിച്ചോ?", "mole, kazhicho?", "Dear, have you eaten?", "athe, kazhichu", "Yes, I ate"),
    step("സുഖമാണോ?", "sukhamano?", "Are you well?", "njan sukhamayi irikkunnu", "I am doing well"),
    step("എപ്പോൾ വരും?", "eppol varum?", "When will you come?", "summer-il varum", "I will come in summer"),
    step("പഠിത്തം നന്നായി?", "padiththam nannayi?", "Studying well?", "padikkunnu", "I am studying"),
    step("ചൂടുണ്ടോ?", "choodundo?", "Is it hot there?", "kurachu undu", "A little"),
    step("അമ്മയോട് hi പറ.", "ammayodu hi para.", "Say hi to mom.", "parayam", "I will tell her"),
    step("സ്നേഹം.", "sneham.", "Love you.", "enikkum sneham", "Love you too"),
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
      "80 രൂപ ആകും.",
      "80 roopa aakum.",
      "That will be 80 rupees.",
      "kurachu kuraykkamo?",
      "Can you lower it a little?",
    ),
    step(
      "ശരി, 70 ആകും. കയറൂ.",
      "shari, 70 aakum. kayaroo.",
      "Okay, 70 rupees. Get in.",
      "nanni",
      "Thanks",
    ),
    step(
      "നേരെ പോകണം അല്ലേ?",
      "nere pokanam alle?",
      "I go straight this way, right?",
      "athe, nere pokoo",
      "Yes, go straight",
    ),
    step(
      "സ്റ്റേഷൻ സമീപം. ഇവിടെ നിർത്തണോ?",
      "station sameepam. ivide nirthano?",
      "We are near the station. Should I stop here?",
      "ivide nirthikko",
      "Stop here",
    ),
    step(
      "ശരി, നിർത്തുന്നു.",
      "shari, nirthunnu.",
      "Okay, stopping.",
      "nanni",
      "Thanks",
    ),
    step(
      "70 രൂപ മതി.",
      "70 roopa mathi.",
      "That will be 70 rupees.",
      "shari",
      "Okay",
    ),
    step(
      "നന്ദി! നന്ദി!",
      "nanni! nanni!",
      "Thank you! Thank you!",
      "pooyi varaam",
      "Bye",
    ),
  ],
  shop: [
    step(
      "എന്താ വേണം?",
      "entha venam?",
      "What do you need?",
      "oru packet chips venam",
      "I need one packet of chips",
    ),
    step(
      "ഇത് 30 രൂപ.",
      "ithu 30 roopa.",
      "This one is 30 rupees.",
      "ithu ethra?",
      "How much is this?",
    ),
    step(
      "30 രൂപ ആകും.",
      "30 roopa aakum.",
      "It is 30 rupees.",
      "shari, tharoo",
      "Okay, give it please",
    ),
    step(
      "വേറെ എന്താ വേണം?",
      "vere entha venam?",
      "Anything else?",
      "illa, mathi",
      "No, that is all",
    ),
    step(
      "ആകെ 45 രൂപ.",
      "aake 45 roopa.",
      "45 rupees altogether.",
      "shari",
      "Okay",
    ),
    step(
      "നന്ദി!",
      "nanni!",
      "Thank you!",
      "nanni",
      "Thank you",
    ),
    step("പോയി വരുന്നേ.", "pooyi varunne.", "Take care.", "pooyi varaam", "Bye"),
    step("ശരി.", "shari.", "Okay.", "shari", "Okay"),
  ],
  market: [
    step(
      "എന്താ വേണം ചേച്ചി?",
      "entha venam chechi?",
      "What do you want, dear?",
      "randu kilo ulli",
      "Two kilos of onion",
    ),
    step(
      "ഫ്രഷ് ആണ്. കിലോയ്ക്ക് 40 രൂപ.",
      "fresh aanu. kiloykku 40 roopa.",
      "It is fresh. 40 rupees per kilo.",
      "shari, randu kilo tharoo",
      "Okay, give me two kilos",
    ),
    step(
      "80 രൂപ ആകും.",
      "80 roopa aakum.",
      "That comes to 80 rupees.",
      "kurachu kuraykkamo?",
      "Can you reduce a little?",
    ),
    step(
      "75 ആകും.",
      "75 aakum.",
      "Make it 75.",
      "shari",
      "Okay",
    ),
    step(
      "വേറെ എന്താ?",
      "vere entha?",
      "Anything else?",
      "illa",
      "No",
    ),
    step(
      "നന്ദി ചേച്ചി.",
      "nanni chechi.",
      "Thank you, dear.",
      "nanni",
      "Thank you",
    ),
    step("പിന്നെ വരണം.", "pinne varanam.", "Come again.", "athe", "Yes"),
    step("ശരി.", "shari.", "Okay.", "shari", "Okay"),
  ],
  cousin: [
    step("എന്താ ലേറ്റസ്റ്റ്?", "entha latest?", "What is new with you?", "school nannayi", "School is going well"),
    step(
      "അമേരിക്കയിൽ എന്താ പഠിക്കുന്നത്?",
      "Americayil entha padikkunnathu?",
      "What are you studying in the US?",
      "computer science",
      "Computer science",
    ),
    step(
      "മലയാളം ജോക്ക് മനസ്സിലായോ?",
      "Malayalam jokes manassilaayo?",
      "Do you get Malayalam jokes?",
      "kurachu manassilaayi",
      "I get some of them",
    ),
    step(
      "കേരളത്തിൽ എത്ര നാൾ ആയി?",
      "Keralathil ethra naal aayi?",
      "How long since you visited Kerala?",
      "randu varsham aayi",
      "About two years",
    ),
    step(
      "സദ്യയിൽ ഏറ്റവും ഇഷ്ടം ഏതാ?",
      "sadyayil ettavum ishtam ethaa?",
      "What is your favorite sadya dish?",
      "payasam",
      "Payasam",
    ),
    step(
      "ഫോട്ടോ എടുക്കാം?",
      "photo edukkam?",
      "Should we take a photo?",
      "athe, edukkam",
      "Yes, let us take one",
    ),
    step("നന്നായി സംസാരിച്ചു.", "nannayi samsaarichu.", "That was a nice chat.", "nanni", "Thanks"),
    step("പിന്നെ കാണാം.", "pinne kaanam.", "See you later.", "kaanam", "See you"),
  ],
  momcall: [
    step("കഴിച്ചോ?", "kazhicho?", "Did you eat?", "kazhichu", "I ate"),
    step("എന്താ കഴിച്ചത്?", "entha kazhichathu?", "What did you eat?", "chorum curryum", "Rice and curry"),
    step("പഠിക്കുന്നോ?", "padikkunno?", "Are you studying?", "padikkunnu", "I am studying"),
    step(
      "രാത്രി നല്ല ഉറക്കം ഉണ്ടോ?",
      "raathri nalla urakkam undo?",
      "Are you sleeping enough at night?",
      "shari, nalla urakkam",
      "Yes, I sleep fine",
    ),
    step(
      "ഫോൺ കുറച്ച് കുറയ്ക്ക്.",
      "phone kurachu kuraykku.",
      "Use your phone a little less.",
      "shari amma",
      "Okay, Amma",
    ),
    step("സുഖം അല്ലേ?", "sukham alle?", "You are okay, right?", "sukham", "I am fine"),
    step("നിന്നെ മിസ് ചെയ്യുന്നു.", "ninne miss cheyyunnu.", "I miss you.", "enikkum miss", "I miss you too"),
    step("ബൈ മോളേ.", "bye mole.", "Bye, dear.", "bye", "Bye"),
  ],
  homestay: [
    step(
      "എവിടെ കിടക്കാം?",
      "evide kidakkam?",
      "Where will you sleep tonight?",
      "mukalile room shari",
      "The upstairs room is fine",
    ),
    step(
      "പുതിയ ടവൽ ഉണ്ട്.",
      "puthiya towel undu.",
      "There is a fresh towel for you.",
      "nanni",
      "Thank you",
    ),
    step(
      "അത്താഴം എത്ര മണിക്ക്?",
      "athazham ethra manikku?",
      "What time is dinner tonight?",
      "8 manikku alle?",
      "Is it at 8?",
    ),
    step(
      "അതെ, 8 മണിക്ക്.",
      "athe, 8 manikku.",
      "Yes, at 8 o'clock.",
      "shari",
      "Okay",
    ),
    step(
      "ബാത്ത്റൂം എവിടെ?",
      "bathroom evide?",
      "Where is the bathroom?",
      "adutha room",
      "The next room over",
    ),
    step(
      "കഴിച്ചെങ്കിൽ കുറച്ച് വിശ്രമിക്ക്.",
      "kazhichenkil kurachu vishramikku.",
      "If you have eaten, rest a little.",
      "kazhichu, vishramikkam",
      "I ate, I will rest",
    ),
    step(
      "വന്നതിന് നന്ദി.",
      "vannathinu nanni.",
      "Thanks for coming.",
      "nanni",
      "Thank you",
    ),
    step("ശരി.", "shari.", "Okay.", "shari", "Okay"),
  ],
  airport: [
    step(
      "ഫ്ലൈറ്റ് നന്നായിരുന്നോ?",
      "flight nallayirunno?",
      "Was the flight okay?",
      "athe, nannayi",
      "Yes, it was fine",
    ),
    step(
      "ലഗേജ് എല്ലാം ഉണ്ടോ?",
      "luggage ellam undo?",
      "Do you have all your luggage?",
      "undu",
      "Yes, I have it all",
    ),
    step(
      "എവിടെ താമസിക്കും?",
      "evide thamasikkum?",
      "Where will you stay?",
      "ammayude veettil",
      "At Amma's house",
    ),
    step(
      "കഴിച്ചിട്ടുണ്ടോ?",
      "kazhichittundo?",
      "Have you eaten?",
      "airport-il kurachu",
      "A little at the airport",
    ),
    step(
      "കാർ റെഡി ആണ്.",
      "car ready aanu.",
      "The car is ready outside.",
      "nanni uncle",
      "Thanks, uncle",
    ),
    step(
      "ട്രാഫിക് ഉണ്ട്, കുറച്ച് കാത്തിരിക്കണം.",
      "traffic undu, kurachu kaathirikkanam.",
      "There is traffic, we may wait a bit.",
      "shari",
      "Okay",
    ),
    step(
      "അടുത്തെത്തുമ്പോൾ അമ്മയോട് കോൾ ചെയ്യ്.",
      "aduthethumbol ammayodu call cheyy.",
      "Call your mother when we get close.",
      "cheyyam",
      "I will call",
    ),
    step("വാ, പോകാം.", "vaa, pokaam.", "Come, let us go.", "varunnu", "I am coming"),
  ],
  restaurant: [
    step("എന്താ വേണം?", "entha venam?", "What would you like?", "randu chaaya", "Two teas"),
    step(
      "സ്ട്രോങ്ങ് അല്ലേ, ലൈറ്റ് അല്ലേ?",
      "strong alle, light alle?",
      "Strong tea or light tea?",
      "light venam",
      "Light tea please",
    ),
    step(
      "പഴംപൊരി ഫ്രഷ് ആണ്.",
      "pazhampori fresh aanu.",
      "The banana fritters are fresh.",
      "randu edukkam",
      "We will take two",
    ),
    step(
      "45 രൂപ ആകും.",
      "45 roopa aakum.",
      "That will be 45 rupees.",
      "shari",
      "Okay",
    ),
    step(
      "നന്നായി അല്ലേ?",
      "nannayi alle?",
      "Tastes good, right?",
      "nannayi",
      "It is good",
    ),
    step("വേറെ എന്താ?", "vere entha?", "Anything else?", "illa, mathi", "No, that is all"),
    step("നന്ദി!", "nanni!", "Thank you!", "nanni", "Thank you"),
    step("പിന്നെ വരണം.", "pinne varanam.", "Come again.", "athe", "Yes"),
  ],
  onam: [
    step(
      "സദ്യ തുടങ്ങിയോ?",
      "sadya thudangiyo?",
      "Has the sadya started?",
      "athe, kazhikkam",
      "Yes, let us eat",
    ),
    step(
      "പായസം എടുക്കൂ.",
      "payasam edukkoo.",
      "Take some payasam.",
      "nanni",
      "Thanks",
    ),
    step(
      "കുറച്ച് കൂടുതൽ കഴിക്കൂ.",
      "kurachu kooduthal kazhikkoo.",
      "Eat a little more.",
      "kazhichu",
      "I ate",
    ),
    step(
      "പൂക്കളം നന്നായി അല്ലേ?",
      "pookalam nannayi alle?",
      "The flower rangoli looks nice, right?",
      "valare nannayi",
      "It looks very nice",
    ),
    step(
      "ഓണാശംസകൾ!",
      "Onashamsakal!",
      "Onam wishes!",
      "Onashamsakal",
      "Onam wishes",
    ),
    step(
      "ഫോട്ടോ എടുക്കാം?",
      "photo edukkam?",
      "Should we take a photo?",
      "athe",
      "Yes",
    ),
    step("നന്നായി ആഘോഷിച്ചു.", "nannayi aaghosichu.", "We celebrated well.", "nanni", "Thanks"),
    step("പിന്നെ കാണാം.", "pinne kaanam.", "See you later.", "kaanam", "See you"),
  ],
  teacher: [
    step(
      "വീട്ടിൽ മലയാളം സംസാരിക്കുന്നുണ്ടോ?",
      "veettil Malayalam samsarikkunnundo?",
      "Do you speak Malayalam at home?",
      "veettil Malayalam samsarikkunnu",
      "We speak Malayalam at home",
    ),
    step(
      "parent-നെ ഹെൽപ്പ് ചെയ്യുന്നുണ്ടോ?",
      "parent-ne help cheyyunnundo?",
      "Do you help your parent understand?",
      "cheyyunnu",
      "I help sometimes",
    ),
    step(
      "ഇവിടെ ഒരു വാക്യം വായിക്കൂ.",
      "ivide oru vakyam vaayikkoo.",
      "Read this sentence aloud.",
      "shari",
      "Okay",
    ),
    step(
      "നന്നായി പഠിച്ചിട്ടുണ്ട്.",
      "nannayi padichittundu.",
      "You have been studying well.",
      "nanni teacher",
      "Thank you, teacher",
    ),
    step(
      "അടുത്ത ക്ലാസ് അതേ സമയം.",
      "adutha class athe samayam.",
      "Next class is at the same time.",
      "shari",
      "Okay",
    ),
    step(
      "പുരോഗതി നന്നായി.",
      "purogathi nannayi.",
      "Your progress is good.",
      "nanni",
      "Thank you",
    ),
    step("പിന്നെ വരണം.", "pinne varanam.", "Please come again.", "varum", "I will come"),
    step("ശരി.", "shari.", "Okay.", "shari", "Okay"),
  ],
  bus: [
    step(
      "നിങ്ങൾ എവിടെ പോകണം?",
      "ningal evide pokanam?",
      "Where do you need to go?",
      "town-il pokanam",
      "I need to go to town",
    ),
    step(
      "ഈ ബസ് ടൗണിൽ പോകും.",
      "ee bus town-il pokum.",
      "This bus goes to town.",
      "shari, kayaroo",
      "Okay, I will get on",
    ),
    step(
      "ടിക്കറ്റ് 25 രൂപ.",
      "ticket 25 roopa.",
      "The ticket is 25 rupees.",
      "shari",
      "Okay",
    ),
    step(
      "മാർക്കറ്റ് സ്റ്റോപ്പ് അടുത്തത് ആണ്.",
      "market stop aduthathaanu.",
      "The market stop is next.",
      "nanni",
      "Thanks",
    ),
    step(
      "വിൻഡോ സീറ്റ് ഒഴിഞ്ഞിട്ടുണ്ട്.",
      "window seat ozhinjittundu.",
      "There is a window seat open.",
      "nanni",
      "Thanks",
    ),
    step(
      "ടൗൺ സമീപം.",
      "town sameepam.",
      "We are near town.",
      "shari",
      "Okay",
    ),
    step(
      "ഇവിടെ നിർത്തണോ?",
      "ivide nirthano?",
      "Should I stop here?",
      "ivide nirthikko",
      "Stop here",
    ),
    step("നന്ദി!", "nanni!", "Thank you!", "nanni", "Thank you"),
  ],
  hospital: [
    step("സുഖമാണോ?", "sukhamano?", "Are you feeling okay?", "sukham, nanni", "Fine, thanks"),
    step(
      "ഡോക്ടർ വന്നോ?",
      "doctor vanno?",
      "Has the doctor come yet?",
      "innum alla",
      "Not yet",
    ),
    step(
      "കുറച്ച് കാത്തിരിക്കാം.",
      "kurachu kaathirikkaam.",
      "We will wait a little longer.",
      "shari",
      "Okay",
    ),
    step(
      "വെള്ളം വേണോ?",
      "vellam veno?",
      "Do you want water?",
      "athe, venam",
      "Yes, please",
    ),
    step(
      "തലവേദന ഉണ്ടോ?",
      "thalavedana undo?",
      "Do you have a headache?",
      "kurachu undu",
      "A little",
    ),
    step(
      "ഡോക്ടറെ കാണണം.",
      "doctore kaananam.",
      "You should see the doctor.",
      "shari",
      "Okay",
    ),
    step("കൂടെ നിന്നതിന് നന്ദി.", "koode ninnathinu nanni.", "Thanks for staying with me.", "nanni", "Thank you"),
    step("പിന്നെ വരും.", "pinne varum.", "I will come again.", "shari", "Okay"),
  ],
  beach: [
    step(
      "നല്ല കാറ്റ് അല്ലേ?",
      "nalla kaattu alle?",
      "Nice breeze, right?",
      "athe, valare nannayi",
      "Yes, very nice",
    ),
    step(
      "ഐസ്ക്രീം വേണോ?",
      "ice cream veno?",
      "Want ice cream?",
      "athe, venam",
      "Yes, I want some",
    ),
    step(
      "കടലിൽ നീന്തിയിട്ട് കുറേ നാളായി അല്ലേ?",
      "kadalil neenthiyittu kure naalaayi alle?",
      "It has been a while since you swam in the sea, right?",
      "mumpu neenthiyittundu",
      "I have swum before",
    ),
    step(
      "സൂര്യാസ്തമയം നന്നായി.",
      "sooryaasthamayam nannayi.",
      "The sunset looks beautiful.",
      "nannayi",
      "It is beautiful",
    ),
    step(
      "ഫോട്ടോ എടുക്കാം?",
      "photo edukkam?",
      "Should we take a photo?",
      "athe",
      "Yes",
    ),
    step(
      "കുറച്ച് നിൽക്കാം.",
      "kurachu nilkkaam.",
      "Let us stay a little longer.",
      "shari",
      "Okay",
    ),
    step("നല്ല സായാഹ്നം.", "nalla saayaahnam.", "Nice evening.", "nanni", "Thanks"),
    step("വാ, മടങ്ങാം.", "vaa, madangaam.", "Come, let us head back.", "varunnu", "I am coming"),
  ],
  monsoon: [
    step(
      "മഴ കൂടുതലാണ്, ഇവിടെ നിൽക്കൂ.",
      "mazha kooduthal aanu, ivide nilkkoo.",
      "Rain is heavy, wait here.",
      "nanni, chaaya veno?",
      "Thanks, can I get tea?",
    ),
    step(
      "ചായ റെഡി ആകും.",
      "chaaya ready aakum.",
      "Tea will be ready soon.",
      "nanni",
      "Thank you",
    ),
    step(
      "കുട ഉണ്ടോ?",
      "kuda undo?",
      "Do you have an umbrella?",
      "illa",
      "No",
    ),
    step(
      "കുറച്ച് കഴിഞ്ഞാൽ മഴ കുറയും.",
      "kurachu kazhinjaal mazha kurayum.",
      "The rain should ease in a little while.",
      "shari",
      "Okay",
    ),
    step(
      "നല്ല മഴ!",
      "nalla mazha!",
      "What heavy rain!",
      "athe",
      "Yes",
    ),
    step(
      "ചായ നന്നായി.",
      "chaaya nannayi.",
      "The tea is good.",
      "nannayi",
      "It is good",
    ),
    step("നന്ദി!", "nanni!", "Thank you!", "nanni", "Thank you"),
    step("പോയി വരാം.", "pooyi varaam.", "Bye, take care.", "pooyi varaam", "Bye"),
  ],
  movie: [
    step(
      "സിനിമ കണ്ടോ?",
      "cinema kando?",
      "Did you watch the movie?",
      "kandu, nannayi",
      "I watched it, it was good",
    ),
    step(
      "ഹീറോ നന്നായി അല്ലേ?",
      "hero nannayi alle?",
      "The hero was great, right?",
      "athe",
      "Yes",
    ),
    step(
      "കഥ മനസ്സിലായോ?",
      "katha manassilaayo?",
      "Did you follow the story?",
      "kurachu manassilaayilla",
      "I did not fully follow it",
    ),
    step(
      "തമാശ കിട്ടിയോ?",
      "thamaasha kittiyo?",
      "Did you catch the jokes?",
      "kurachu manassilaayi",
      "I caught some of them",
    ),
    step(
      "അവസാനം പ്രതീക്ഷിച്ചില്ല അല്ലേ?",
      "avasanam pratheekshichilla alle?",
      "The ending was unexpected, right?",
      "athe",
      "Yes",
    ),
    step(
      "പിന്നെ ഒരു സിനിമ കാണാം.",
      "pinne oru cinema kaanam.",
      "Let us watch another movie sometime.",
      "athe",
      "Yes",
    ),
    step("നന്നായി സംസാരിച്ചു.", "nannayi samsaarichu.", "Good talk after the movie.", "nanni", "Thanks"),
    step("പോയി വരാം.", "pooyi varaam.", "Bye.", "pooyi varaam", "Bye"),
  ],
  cousinsKids: [
    step("വാ കളിക്കാൻ!", "vaa kalikkaan!", "Come play!", "varunnu", "I am coming"),
    step(
      "എന്താ പേര്?",
      "entha peru?",
      "What is your name?",
      "Joel",
      "Joel",
    ),
    step(
      "ക്രിക്കറ്റ് കളിക്കാമോ?",
      "cricket kalikkaamo?",
      "Want to play cricket?",
      "kalikkaam",
      "Let us play",
    ),
    step(
      "ഞാൻ ആദ്യം ബാറ്റ് ചെയ്യാം.",
      "njan aadyam bat cheyyaam.",
      "I bat first!",
      "shari",
      "Okay",
    ),
    step(
      "ചോക്ലേറ്റ് ഉണ്ടോ?",
      "chocolate undo?",
      "Do you have chocolate?",
      "illa ippol",
      "Not right now",
    ),
    step(
      "അവസാന കളി, പിന്നെ വിശ്രമം.",
      "avasana kali, pinne vishramam.",
      "Last game, then we rest.",
      "shari",
      "Okay",
    ),
    step("നന്നായി കളിച്ചു.", "nannayi kalichu.", "That was fun.", "nanni", "Thanks"),
    step("ബൈ!", "bye!", "Bye!", "bye", "Bye"),
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
