export type Question = {
  id: string;
  text: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

export type TrueFalseQuestion = {
  id: string;
  type: "truefalse";
  statement: string;
  correct: boolean;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

export type FillBlankQuestion = {
  id: string;
  type: "fillblank";
  sentence: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

export type WordScrambleQuestion = {
  id: string;
  type: "scramble";
  words: string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
};

export type QuizQuestion = Question | TrueFalseQuestion | FillBlankQuestion | WordScrambleQuestion;

export type ExplanationText = {
  id: string;
  title: string;
  content: string;
  questions: QuizQuestion[];
};

export const EXPLANATION_TEXTS: ExplanationText[] = [
  {
    id: "photosynthesis",
    title: "Photosynthesis",
    content:
      "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy stored in glucose. This process occurs mainly in the leaves of plants, specifically in the chloroplasts, which contain a green pigment called chlorophyll. During photosynthesis, plants absorb carbon dioxide from the air through tiny pores called stomata and water from the soil through their roots. Using sunlight, they transform these raw materials into glucose and oxygen. The oxygen is released into the atmosphere as a byproduct, making photosynthesis essential for life on Earth.",
    questions: [
      {
        id: "p1",
        text: "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy into chemical energy stored in glucose.",
        question: "Where does photosynthesis mainly occur in plants?",
        options: ["In the roots", "In the flowers", "In the chloroplasts of leaves", "In the stem"],
        correct: 2,
        explanation: "Photosynthesis occurs mainly in the chloroplasts of leaves, which contain chlorophyll.",
        difficulty: "easy",
      },
      {
        id: "p2",
        text: "Photosynthesis is the process by which green plants convert light energy into chemical energy.",
        question: "What green pigment in chloroplasts absorbs sunlight for photosynthesis?",
        options: ["Carotene", "Chlorophyll", "Anthocyanin", "Melanin"],
        correct: 1,
        explanation: "Chlorophyll is the green pigment found in chloroplasts that absorbs sunlight.",
        difficulty: "easy",
      },
      {
        id: "p3",
        text: "During photosynthesis, plants absorb carbon dioxide and water to produce glucose and oxygen.",
        question: "What byproduct of photosynthesis is released into the atmosphere?",
        options: ["Carbon dioxide", "Nitrogen", "Oxygen", "Hydrogen"],
        correct: 2,
        explanation: "Oxygen is released as a byproduct during photosynthesis.",
        difficulty: "easy",
      },
      {
        id: "p4",
        text: "Plants absorb carbon dioxide from the air through tiny pores called stomata.",
        question: "Through which structure do plants absorb carbon dioxide?",
        options: ["Roots", "Stomata", "Xylem", "Phloem"],
        correct: 1,
        explanation: "Plants absorb carbon dioxide through tiny pores called stomata.",
        difficulty: "medium",
      },
      {
        id: "p5",
        text: "Photosynthesis converts light energy into chemical energy stored as glucose.",
        question: "Why is photosynthesis essential for life on Earth?",
        options: [
          "It produces nitrogen for the atmosphere",
          "It releases oxygen and provides food energy",
          "It removes excess water from the environment",
          "It creates soil nutrients for plants",
        ],
        correct: 1,
        explanation: "Photosynthesis releases oxygen and converts light into glucose, supporting life on Earth.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "water_cycle",
    title: "The Water Cycle",
    content:
      "The water cycle, also known as the hydrological cycle, describes the continuous movement of water on, above, and below the surface of the Earth. Water evaporates from oceans, lakes, and rivers when heated by the sun, turning into water vapor. This vapor rises into the atmosphere, cools, and condenses to form clouds through a process called condensation. When clouds become heavy enough, water falls back to Earth as precipitation in the form of rain, snow, or hail. This water flows into rivers, lakes, and oceans, or seeps into the ground as groundwater, eventually evaporating again to continue the cycle.",
    questions: [
      {
        id: "wc1",
        text: "The water cycle describes the continuous movement of water on, above, and below Earth's surface.",
        question: "What process turns liquid water into water vapor?",
        options: ["Condensation", "Precipitation", "Evaporation", "Transpiration"],
        correct: 2,
        explanation: "Evaporation turns liquid water into water vapor when heated by the sun.",
        difficulty: "easy",
      },
      {
        id: "wc2",
        text: "Water vapor rises and cools to form clouds through condensation.",
        question: "What is the process called when water vapor cools and forms clouds?",
        options: ["Evaporation", "Condensation", "Precipitation", "Infiltration"],
        correct: 1,
        explanation: "Condensation is when water vapor cools and transforms into liquid water droplets, forming clouds.",
        difficulty: "easy",
      },
      {
        id: "wc3",
        text: "Water falls back to Earth as precipitation in the form of rain, snow, or hail.",
        question: "Which of the following is NOT a form of precipitation?",
        options: ["Rain", "Snow", "Hail", "Fog"],
        correct: 3,
        explanation: "Fog is water vapor condensed near the ground, not precipitation falling from clouds.",
        difficulty: "medium",
      },
      {
        id: "wc4",
        text: "Water flows into rivers, lakes, and oceans, or seeps into the ground as groundwater.",
        question: "What happens to water that seeps into the ground?",
        options: ["It immediately evaporates", "It becomes groundwater", "It turns into ice", "It creates rivers"],
        correct: 1,
        explanation: "Water that seeps into the ground becomes groundwater, stored in underground reservoirs.",
        difficulty: "medium",
      },
      {
        id: "wc5",
        text: "The water cycle is a continuous process driven by solar energy.",
        question: "What is the primary energy source that drives the water cycle?",
        options: ["Wind energy", "Geothermal energy", "Solar energy", "Nuclear energy"],
        correct: 2,
        explanation: "The sun (solar energy) drives the water cycle by providing heat for evaporation.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "volcanoes",
    title: "Volcanoes",
    content:
      "A volcano is an opening in Earth's crust through which molten rock, gas, and ash can escape. Volcanoes form when magma from deep within the Earth pushes up through cracks in the crust. When magma reaches the surface, it is called lava. Volcanic eruptions can be explosive or gentle, depending on the composition of the magma. Explosive eruptions occur when magma contains large amounts of dissolved gases. Volcanoes can be found along tectonic plate boundaries or over hotspots in the mantle. Famous volcanoes include Mount Vesuvius, Krakatau, and Mauna Loa. Despite their destructive power, volcanic soils are extremely fertile for agriculture.",
    questions: [
      {
        id: "v1",
        text: "A volcano is an opening in Earth's crust through which molten rock, gas, and ash escape.",
        question: "What is magma called when it reaches Earth's surface?",
        options: ["Ash", "Lava", "Pumice", "Obsidian"],
        correct: 1,
        explanation: "When magma reaches Earth's surface through a volcano, it is called lava.",
        difficulty: "easy",
      },
      {
        id: "v2",
        text: "Volcanic eruptions can be explosive or gentle depending on magma composition.",
        question: "What causes explosive volcanic eruptions?",
        options: [
          "Cool temperatures",
          "Large amounts of dissolved gases in magma",
          "Thin magma with low viscosity",
          "Presence of water near the volcano",
        ],
        correct: 1,
        explanation: "Explosive eruptions occur when magma contains large amounts of dissolved gases.",
        difficulty: "medium",
      },
      {
        id: "v3",
        text: "Volcanoes form along tectonic plate boundaries or over mantle hotspots.",
        question: "Where are volcanoes commonly found?",
        options: [
          "Only in polar regions",
          "Only in the middle of continents",
          "Along tectonic plate boundaries or over hotspots",
          "Only underwater",
        ],
        correct: 2,
        explanation: "Volcanoes are found along tectonic plate boundaries or over hotspots in the mantle.",
        difficulty: "medium",
      },
      {
        id: "v4",
        text: "Despite their destructive power, volcanic soils are extremely fertile.",
        question: "Why are volcanic soils considered beneficial for agriculture?",
        options: [
          "They retain too much water",
          "They are extremely fertile",
          "They prevent plant diseases",
          "They have no nutrients",
        ],
        correct: 1,
        explanation: "Volcanic soils are extremely fertile, making them excellent for agriculture.",
        difficulty: "easy",
      },
      {
        id: "v5",
        text: "Magma pushes up through cracks in Earth's crust to form volcanoes.",
        question: "What is the term for molten rock beneath Earth's surface?",
        options: ["Lava", "Magma", "Ash", "Pumice"],
        correct: 1,
        explanation: "Magma is the term for molten rock beneath Earth's surface; it becomes lava when it erupts.",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "greenhouse",
    title: "The Greenhouse Effect",
    content:
      "The greenhouse effect is a natural process that warms Earth's surface. When the sun's energy reaches Earth, some is absorbed by the surface and some is reflected back toward space. Greenhouse gases in the atmosphere, including carbon dioxide, methane, and water vapor, trap some of this reflected energy, preventing it from escaping into space. This keeps Earth warm enough to support life. However, human activities such as burning fossil fuels, deforestation, and industrial processes have increased the concentration of greenhouse gases, enhancing the greenhouse effect and causing global warming. This leads to climate change, rising sea levels, and extreme weather events.",
    questions: [
      {
        id: "g1",
        text: "The greenhouse effect is a natural process that warms Earth's surface.",
        question: "Which gases are considered greenhouse gases?",
        options: [
          "Oxygen and nitrogen",
          "Carbon dioxide, methane, and water vapor",
          "Hydrogen and helium",
          "Argon and neon",
        ],
        correct: 1,
        explanation: "Carbon dioxide, methane, and water vapor are the main greenhouse gases.",
        difficulty: "easy",
      },
      {
        id: "g2",
        text: "Greenhouse gases trap reflected energy and prevent it from escaping into space.",
        question: "What is the primary role of greenhouse gases in Earth's atmosphere?",
        options: [
          "To block incoming sunlight",
          "To trap heat and keep Earth warm",
          "To reflect all sunlight back to space",
          "To produce oxygen for breathing",
        ],
        correct: 1,
        explanation: "Greenhouse gases trap heat (reflected energy) and keep Earth at a temperature that supports life.",
        difficulty: "easy",
      },
      {
        id: "g3",
        text: "Human activities have increased greenhouse gas concentrations, enhancing the greenhouse effect.",
        question: "Which human activity contributes MOST to increasing greenhouse gases?",
        options: ["Swimming", "Burning fossil fuels", "Growing food", "Reading books"],
        correct: 1,
        explanation: "Burning fossil fuels releases large amounts of carbon dioxide, a major greenhouse gas.",
        difficulty: "medium",
      },
      {
        id: "g4",
        text: "Enhanced greenhouse effect leads to global warming, rising sea levels, and extreme weather.",
        question: "What is one consequence of the enhanced greenhouse effect?",
        options: [
          "Colder global temperatures",
          "Decreased sea levels",
          "Rising sea levels",
          "More rainfall in deserts only",
        ],
        correct: 2,
        explanation: "The enhanced greenhouse effect causes global warming, which leads to rising sea levels.",
        difficulty: "medium",
      },
      {
        id: "g5",
        text: "The greenhouse effect is necessary for life but becomes dangerous when enhanced by human activity.",
        question: "Without any greenhouse effect, what would happen to Earth?",
        options: [
          "Earth would be too hot for life",
          "Earth would be too cold for life",
          "Earth would have perfect temperatures",
          "Nothing would change",
        ],
        correct: 1,
        explanation: "Without the greenhouse effect, Earth would be too cold (about -18°C) to support life.",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "digestive",
    title: "The Human Digestive System",
    content:
      "The human digestive system is responsible for breaking down food into nutrients that the body can absorb and use for energy, growth, and repair. Digestion begins in the mouth, where teeth chew food and saliva begins breaking down carbohydrates. The food travels down the esophagus to the stomach, where acid and enzymes break it down further. The partially digested food, called chyme, then moves into the small intestine, where most nutrients are absorbed into the bloodstream. The remaining material passes into the large intestine, where water is absorbed, and the solid waste is eventually expelled through the rectum and anus.",
    questions: [
      {
        id: "d1",
        text: "The digestive system breaks down food into nutrients the body can absorb.",
        question: "Where does digestion begin?",
        options: ["In the stomach", "In the small intestine", "In the mouth", "In the esophagus"],
        correct: 2,
        explanation: "Digestion begins in the mouth, where teeth chew food and saliva breaks down carbohydrates.",
        difficulty: "easy",
      },
      {
        id: "d2",
        text: "Saliva in the mouth begins breaking down carbohydrates during digestion.",
        question: "What does saliva primarily help to digest?",
        options: ["Proteins", "Fats", "Carbohydrates", "Vitamins"],
        correct: 2,
        explanation: "Saliva contains enzymes that begin breaking down carbohydrates in the mouth.",
        difficulty: "medium",
      },
      {
        id: "d3",
        text: "The stomach uses acid and enzymes to break down food further.",
        question: "What is the partially digested food in the stomach called?",
        options: ["Bolus", "Chyme", "Mucus", "Bile"],
        correct: 1,
        explanation: "The partially digested food in the stomach is called chyme.",
        difficulty: "medium",
      },
      {
        id: "d4",
        text: "Most nutrients are absorbed into the bloodstream in the small intestine.",
        question: "Where does most nutrient absorption occur?",
        options: ["In the mouth", "In the stomach", "In the small intestine", "In the large intestine"],
        correct: 2,
        explanation: "Most nutrients are absorbed into the bloodstream through the walls of the small intestine.",
        difficulty: "easy",
      },
      {
        id: "d5",
        text: "The large intestine absorbs water from remaining material before waste is expelled.",
        question: "What is the main function of the large intestine?",
        options: [
          "Breaking down proteins",
          "Absorbing water from remaining material",
          "Producing digestive enzymes",
          "Storing bile",
        ],
        correct: 1,
        explanation: "The large intestine mainly absorbs water from the remaining undigested material.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "earthquakes",
    title: "Earthquakes",
    content:
      "An earthquake is the shaking of Earth's surface caused by the sudden release of energy stored in Earth's lithosphere. This energy release creates seismic waves that travel through the Earth. Most earthquakes occur along fault lines, which are fractures in Earth's crust where tectonic plates meet and interact. When the stress built up between plates is suddenly released, it sends out waves of energy in all directions. The point within Earth where the earthquake originates is called the focus (or hypocenter), while the point on the surface directly above it is the epicenter. Earthquakes are measured using the Richter scale or the moment magnitude scale.",
    questions: [
      {
        id: "e1",
        text: "Earthquakes are caused by the sudden release of energy in Earth's lithosphere.",
        question: "What are the waves of energy released by an earthquake called?",
        options: ["Sound waves", "Light waves", "Seismic waves", "Electromagnetic waves"],
        correct: 2,
        explanation: "Earthquakes create seismic waves that travel through the Earth.",
        difficulty: "easy",
      },
      {
        id: "e2",
        text: "Most earthquakes occur along fault lines where tectonic plates meet.",
        question: "What is a fault line?",
        options: [
          "A type of mountain",
          "A fracture in Earth's crust where plates interact",
          "A deep ocean trench",
          "A volcanic opening",
        ],
        correct: 1,
        explanation: "A fault line is a fracture in Earth's crust where tectonic plates meet and interact.",
        difficulty: "easy",
      },
      {
        id: "e3",
        text: "The focus is where the earthquake originates within Earth; the epicenter is directly above on the surface.",
        question: "What is the epicenter of an earthquake?",
        options: [
          "The point inside Earth where the earthquake starts",
          "The point on the surface directly above the focus",
          "The area of greatest destruction",
          "The center of a tectonic plate",
        ],
        correct: 1,
        explanation: "The epicenter is the point on Earth's surface directly above the earthquake's focus.",
        difficulty: "medium",
      },
      {
        id: "e4",
        text: "Earthquakes are measured using the Richter scale or moment magnitude scale.",
        question: "Which scale is used to measure the magnitude of earthquakes?",
        options: ["Beaufort scale", "Richter scale", "Celsius scale", "Decibel scale"],
        correct: 1,
        explanation: "The Richter scale (or moment magnitude scale) measures earthquake magnitude.",
        difficulty: "easy",
      },
      {
        id: "e5",
        text: "Stress builds up between tectonic plates and is suddenly released, causing earthquakes.",
        question: "Why do earthquakes occur more frequently at plate boundaries?",
        options: [
          "Because there is more water there",
          "Because stress builds up where plates interact",
          "Because of volcanic activity only",
          "Because the crust is thicker there",
        ],
        correct: 1,
        explanation: "Stress builds up between interacting plates at boundaries and is suddenly released as an earthquake.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "solar_system",
    title: "The Solar System",
    content:
      "The solar system consists of the Sun and everything that orbits around it, including eight planets, their moons, dwarf planets, asteroids, comets, and interplanetary dust. The Sun, a star, contains about 99.86% of the total mass of the solar system. The eight planets, in order from the Sun, are Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. The first four are called terrestrial planets because they have rocky surfaces, while the outer four are gas giants. Jupiter is the largest planet in the solar system. The asteroid belt lies between Mars and Jupiter, and beyond Neptune lies the Kuiper Belt.",
    questions: [
      {
        id: "ss1",
        text: "The solar system consists of the Sun and everything that orbits it, including eight planets.",
        question: "How many planets are in our solar system?",
        options: ["Seven", "Eight", "Nine", "Ten"],
        correct: 1,
        explanation: "Our solar system has eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune.",
        difficulty: "easy",
      },
      {
        id: "ss2",
        text: "The first four planets are terrestrial (rocky) while the outer four are gas giants.",
        question: "Which of the following is a terrestrial (rocky) planet?",
        options: ["Jupiter", "Saturn", "Mars", "Neptune"],
        correct: 2,
        explanation: "Mars is a terrestrial planet with a rocky surface. Jupiter, Saturn, and Neptune are gas giants.",
        difficulty: "easy",
      },
      {
        id: "ss3",
        text: "The Sun contains about 99.86% of the total mass of the solar system.",
        question: "What is the largest object in the solar system?",
        options: ["Jupiter", "Saturn", "The Sun", "Earth"],
        correct: 2,
        explanation: "The Sun is by far the largest object, containing 99.86% of the solar system's mass.",
        difficulty: "easy",
      },
      {
        id: "ss4",
        text: "The asteroid belt lies between Mars and Jupiter.",
        question: "Where is the asteroid belt located?",
        options: [
          "Between Earth and Mars",
          "Between Mars and Jupiter",
          "Between Jupiter and Saturn",
          "Beyond Neptune",
        ],
        correct: 1,
        explanation: "The asteroid belt is located between Mars and Jupiter.",
        difficulty: "medium",
      },
      {
        id: "ss5",
        text: "Beyond Neptune lies the Kuiper Belt.",
        question: "What lies beyond Neptune in our solar system?",
        options: ["The asteroid belt", "Another galaxy", "The Kuiper Belt", "The Sun's corona"],
        correct: 2,
        explanation: "The Kuiper Belt lies beyond Neptune, containing dwarf planets and icy bodies.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "rainforests",
    title: "Rainforests",
    content:
      "Rainforests are dense forests characterized by high rainfall of at least 1,750–2,000 mm per year. They are found near the equator in regions of South America, Central Africa, Southeast Asia, and Australia. Rainforests cover only about 6% of Earth's surface but are home to more than half of the world's plant and animal species. They are often called the 'lungs of the Earth' because they absorb large amounts of carbon dioxide and produce oxygen through photosynthesis. The Amazon Rainforest in South America is the world's largest tropical rainforest. Deforestation threatens these vital ecosystems, leading to biodiversity loss and climate change.",
    questions: [
      {
        id: "r1",
        text: "Rainforests are dense forests with high annual rainfall found near the equator.",
        question: "What minimum annual rainfall characterizes a rainforest?",
        options: ["500 mm", "1,000 mm", "1,750-2,000 mm", "3,000 mm"],
        correct: 2,
        explanation: "Rainforests receive at least 1,750–2,000 mm of rain per year.",
        difficulty: "medium",
      },
      {
        id: "r2",
        text: "Rainforests cover 6% of Earth's surface but house more than half of all species.",
        question: "What percentage of Earth's species live in rainforests?",
        options: ["Less than 10%", "About 25%", "More than half", "Almost all"],
        correct: 2,
        explanation: "Although covering only 6% of Earth's surface, rainforests are home to more than half of all species.",
        difficulty: "medium",
      },
      {
        id: "r3",
        text: "Rainforests are called the 'lungs of the Earth' because they absorb CO2 and produce oxygen.",
        question: "Why are rainforests called the 'lungs of the Earth'?",
        options: [
          "They breathe like animals",
          "They absorb CO2 and produce oxygen through photosynthesis",
          "They store water underground",
          "They regulate wind patterns",
        ],
        correct: 1,
        explanation: "Rainforests absorb CO2 and produce oxygen, much like lungs exchange gases in our body.",
        difficulty: "easy",
      },
      {
        id: "r4",
        text: "The Amazon Rainforest is the world's largest tropical rainforest.",
        question: "Where is the world's largest tropical rainforest located?",
        options: ["Central Africa", "Southeast Asia", "Australia", "South America"],
        correct: 3,
        explanation: "The Amazon Rainforest in South America is the world's largest tropical rainforest.",
        difficulty: "easy",
      },
      {
        id: "r5",
        text: "Deforestation threatens rainforests, causing biodiversity loss and climate change.",
        question: "What is the main threat to rainforests today?",
        options: ["Earthquakes", "Deforestation", "Volcanic eruptions", "Flooding"],
        correct: 1,
        explanation: "Deforestation (clearing trees) is the main threat to rainforests worldwide.",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "lightning",
    title: "Lightning and Thunder",
    content:
      "Lightning is a powerful electrical discharge that occurs during thunderstorms. It is caused by the buildup of static electricity within storm clouds. As ice crystals and water droplets collide inside a cumulonimbus cloud, positive charges accumulate at the top and negative charges at the bottom. When the electrical potential difference between the cloud and the ground becomes large enough, a massive discharge of electricity occurs — this is lightning. Thunder is the sound produced by the rapid expansion of heated air around a lightning bolt. Since light travels faster than sound, we see lightning before we hear thunder. You can estimate the distance of a storm by counting seconds between lightning and thunder.",
    questions: [
      {
        id: "l1",
        text: "Lightning is a powerful electrical discharge caused by static electricity buildup in storm clouds.",
        question: "What type of cloud produces lightning and thunder?",
        options: ["Cirrus", "Stratus", "Cumulus", "Cumulonimbus"],
        correct: 3,
        explanation: "Cumulonimbus clouds are the tall storm clouds that produce lightning and thunder.",
        difficulty: "medium",
      },
      {
        id: "l2",
        text: "Positive charges accumulate at the top and negative charges at the bottom of storm clouds.",
        question: "Where do negative charges accumulate in a thunderstorm cloud?",
        options: ["At the top", "In the middle", "At the bottom", "Outside the cloud"],
        correct: 2,
        explanation: "Negative charges accumulate at the bottom of storm clouds during a thunderstorm.",
        difficulty: "medium",
      },
      {
        id: "l3",
        text: "Thunder is the sound produced by the rapid expansion of heated air around a lightning bolt.",
        question: "What causes thunder?",
        options: [
          "Clouds colliding together",
          "Rapid expansion of heated air around lightning",
          "Rain hitting the ground",
          "Wind blowing through mountains",
        ],
        correct: 1,
        explanation: "Thunder is caused by the rapid expansion of air heated by the lightning bolt.",
        difficulty: "easy",
      },
      {
        id: "l4",
        text: "We see lightning before we hear thunder because light travels faster than sound.",
        question: "Why do we see lightning before hearing thunder?",
        options: [
          "Lightning is closer to us",
          "Thunder travels underground",
          "Light travels faster than sound",
          "Our eyes react faster than our ears",
        ],
        correct: 2,
        explanation: "Light travels at 300,000 km/s while sound travels at 340 m/s, so we see lightning first.",
        difficulty: "easy",
      },
      {
        id: "l5",
        text: "You can estimate storm distance by counting seconds between lightning and thunder.",
        question: "How can you estimate the distance of a thunderstorm?",
        options: [
          "By measuring rainfall",
          "By counting seconds between lightning and thunder",
          "By checking wind speed",
          "By looking at cloud color",
        ],
        correct: 1,
        explanation: "Counting seconds between lightning and thunder (and dividing by 3) gives approximate distance in km.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "tides",
    title: "Ocean Tides",
    content:
      "Tides are the regular rise and fall of ocean water levels, primarily caused by the gravitational pull of the Moon and, to a lesser extent, the Sun. The Moon's gravity pulls ocean water toward it, creating a bulge of water on the side of Earth facing the Moon. Another bulge forms on the opposite side due to inertial forces. As Earth rotates, different areas pass through these bulges, experiencing high tide, then low tide. When the Sun, Moon, and Earth are aligned, their combined gravitational effects create especially high and low tides called spring tides. When the Sun and Moon are at right angles to Earth, the gravitational forces partially cancel, creating neap tides.",
    questions: [
      {
        id: "t1",
        text: "Tides are caused by the gravitational pull of the Moon and Sun on ocean water.",
        question: "What is the PRIMARY cause of ocean tides?",
        options: ["Wind patterns", "Earth's rotation", "Moon's gravitational pull", "Sun's heat"],
        correct: 2,
        explanation: "The Moon's gravitational pull is the primary cause of ocean tides.",
        difficulty: "easy",
      },
      {
        id: "t2",
        text: "The Moon's gravity creates a water bulge on the side facing the Moon and another on the opposite side.",
        question: "How many tidal bulges exist on Earth at the same time?",
        options: ["One", "Two", "Three", "Four"],
        correct: 1,
        explanation: "There are two tidal bulges — one facing the Moon and one on the opposite side of Earth.",
        difficulty: "medium",
      },
      {
        id: "t3",
        text: "Spring tides occur when the Sun, Moon, and Earth are aligned.",
        question: "When do spring tides occur?",
        options: [
          "Every spring season",
          "When Sun, Moon, and Earth are aligned",
          "When Sun and Moon are at right angles",
          "Only during storms",
        ],
        correct: 1,
        explanation: "Spring tides occur when the Sun, Moon, and Earth are aligned, combining gravitational forces.",
        difficulty: "medium",
      },
      {
        id: "t4",
        text: "Neap tides form when the Sun and Moon are at right angles to Earth.",
        question: "What causes neap tides?",
        options: [
          "When Sun, Moon, and Earth are aligned",
          "When Sun and Moon are at right angles to Earth",
          "During full moon only",
          "During earthquakes",
        ],
        correct: 1,
        explanation: "Neap tides form when the Sun and Moon are at right angles, partially canceling each other's pull.",
        difficulty: "hard",
      },
      {
        id: "t5",
        text: "As Earth rotates, different areas experience high and low tides.",
        question: "Why do different areas of Earth experience high and low tides at different times?",
        options: [
          "Because oceans have different depths",
          "Because Earth rotates through tidal bulges",
          "Because the Moon moves very fast",
          "Because continents block tidal waves",
        ],
        correct: 1,
        explanation: "As Earth rotates, different coastal areas pass through the tidal bulges, experiencing high then low tide.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "migration",
    title: "Bird Migration",
    content:
      "Migration is the seasonal movement of animals from one region to another, typically in response to changes in food availability, temperature, or daylight hours. Birds are the most well-known migratory animals. They travel between breeding grounds in summer and warmer wintering areas in winter. Birds navigate using various cues including the position of the sun and stars, Earth's magnetic field, landmarks, and even smell. Some birds, like the Arctic Tern, migrate from the Arctic to the Antarctic and back — a round trip of about 70,000 kilometers. Migration is an energy-intensive process; birds build up fat reserves before migrating to fuel their journeys.",
    questions: [
      {
        id: "m1",
        text: "Migration is the seasonal movement of animals in response to changes in food, temperature, or daylight.",
        question: "What is one main reason birds migrate?",
        options: [
          "To escape predators permanently",
          "In response to changes in food availability and temperature",
          "To find new nesting materials",
          "Because they enjoy traveling",
        ],
        correct: 1,
        explanation: "Birds migrate mainly due to changes in food availability and temperature through the seasons.",
        difficulty: "easy",
      },
      {
        id: "m2",
        text: "Birds navigate using the sun, stars, Earth's magnetic field, and landmarks.",
        question: "How do birds navigate during migration?",
        options: [
          "They follow roads and highways",
          "They use sun, stars, magnetic field, and landmarks",
          "They only follow other birds",
          "They use GPS technology",
        ],
        correct: 1,
        explanation: "Birds use multiple navigation tools: sun position, stars, Earth's magnetic field, and landmarks.",
        difficulty: "medium",
      },
      {
        id: "m3",
        text: "The Arctic Tern migrates about 70,000 km round trip from Arctic to Antarctic.",
        question: "Which bird is known for the longest migration journey?",
        options: ["Eagle", "Penguin", "Arctic Tern", "Sparrow"],
        correct: 2,
        explanation: "The Arctic Tern makes the longest migration of about 70,000 km round trip.",
        difficulty: "medium",
      },
      {
        id: "m4",
        text: "Birds build up fat reserves before migrating to fuel their long journeys.",
        question: "How do birds prepare their bodies for migration?",
        options: [
          "They drink extra water",
          "They shed their feathers",
          "They build up fat reserves",
          "They sleep extra hours",
        ],
        correct: 2,
        explanation: "Birds build up fat reserves before migration to use as energy fuel during the journey.",
        difficulty: "medium",
      },
      {
        id: "m5",
        text: "Birds travel between breeding grounds in summer and warmer wintering areas in winter.",
        question: "To what kind of area do birds typically migrate in winter?",
        options: [
          "Colder polar regions",
          "Higher altitude mountains",
          "Warmer wintering areas",
          "Deeper ocean shores",
        ],
        correct: 2,
        explanation: "Birds migrate to warmer areas in winter where food is more readily available.",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "tornadoes",
    title: "Tornadoes",
    content:
      "A tornado is a violently rotating column of air that extends from a thunderstorm cloud to the ground. Tornadoes form when warm, moist air collides with cool, dry air, creating atmospheric instability. Wind shear — the change in wind speed and direction at different altitudes — causes the air to begin rotating. This rotating air can be sucked into a thunderstorm and tilted vertically to form a tornado funnel. The Fujita scale (or Enhanced Fujita scale) rates tornadoes from F0 to F5 based on wind speeds and damage. The central United States, known as Tornado Alley, experiences the most tornadoes in the world due to the frequent meeting of warm Gulf air and cold Arctic air.",
    questions: [
      {
        id: "tor1",
        text: "A tornado is a violently rotating column of air extending from a thunderstorm to the ground.",
        question: "What is a tornado?",
        options: [
          "A type of hurricane",
          "A rotating column of water",
          "A violently rotating column of air from thunderstorm to ground",
          "A type of blizzard",
        ],
        correct: 2,
        explanation: "A tornado is a violently rotating column of air extending from a thunderstorm to the ground.",
        difficulty: "easy",
      },
      {
        id: "tor2",
        text: "Tornadoes form when warm moist air collides with cool dry air creating atmospheric instability.",
        question: "What atmospheric condition leads to tornado formation?",
        options: [
          "Cold moist air meeting warm dry air",
          "Warm moist air meeting cool dry air",
          "Two cold air masses colliding",
          "High pressure meeting low pressure in winter",
        ],
        correct: 1,
        explanation: "Tornadoes form when warm, moist air collides with cool, dry air, creating instability.",
        difficulty: "medium",
      },
      {
        id: "tor3",
        text: "Wind shear causes air to begin rotating and can form a tornado funnel.",
        question: "What is wind shear?",
        options: [
          "Strong downward winds",
          "Change in wind speed and direction at different altitudes",
          "Horizontal winds above 200 km/h",
          "Circular ocean currents",
        ],
        correct: 1,
        explanation: "Wind shear is the change in wind speed and direction at different altitudes, enabling tornado rotation.",
        difficulty: "hard",
      },
      {
        id: "tor4",
        text: "Tornadoes are rated F0 to F5 on the Fujita scale based on wind speeds and damage.",
        question: "What scale rates tornado intensity?",
        options: ["Richter scale", "Beaufort scale", "Fujita scale", "Celsius scale"],
        correct: 2,
        explanation: "The Fujita (or Enhanced Fujita) scale rates tornadoes F0–F5 based on wind speed and damage.",
        difficulty: "medium",
      },
      {
        id: "tor5",
        text: "Tornado Alley in the central United States experiences the most tornadoes due to air mass collisions.",
        question: "Why does 'Tornado Alley' experience so many tornadoes?",
        options: [
          "It is near the ocean",
          "Warm Gulf air frequently meets cold Arctic air there",
          "It has many mountains that create wind",
          "It gets the most rainfall in the world",
        ],
        correct: 1,
        explanation: "Tornado Alley experiences frequent collisions of warm Gulf air and cold Arctic air, ideal for tornadoes.",
        difficulty: "medium",
      },
    ],
  },
  {
    id: "coral_reefs",
    title: "Coral Reefs",
    content:
      "Coral reefs are underwater ecosystems built by colonies of tiny animals called coral polyps, which secrete calcium carbonate to form hard skeletons. These skeletons accumulate over thousands of years to form the reef structure. Coral reefs are often called the 'rainforests of the sea' because they support an extraordinary diversity of marine life — about 25% of all marine species. Reef-building corals require warm, clear, shallow, and clean water. The Great Barrier Reef off the coast of Australia is the world's largest coral reef system. Coral reefs face severe threats from rising ocean temperatures, ocean acidification, overfishing, and pollution, leading to coral bleaching.",
    questions: [
      {
        id: "cr1",
        text: "Coral reefs are built by coral polyps that secrete calcium carbonate to form hard skeletons.",
        question: "What do coral polyps secrete to build the reef structure?",
        options: ["Salt", "Calcium carbonate", "Silica", "Iron oxide"],
        correct: 1,
        explanation: "Coral polyps secrete calcium carbonate, which accumulates to form the reef's hard skeleton.",
        difficulty: "medium",
      },
      {
        id: "cr2",
        text: "Coral reefs are called the 'rainforests of the sea' because they support 25% of all marine species.",
        question: "What percentage of all marine species do coral reefs support?",
        options: ["5%", "10%", "25%", "50%"],
        correct: 2,
        explanation: "Coral reefs support about 25% of all marine species despite covering less than 1% of the ocean floor.",
        difficulty: "medium",
      },
      {
        id: "cr3",
        text: "Reef-building corals need warm, clear, shallow, and clean water.",
        question: "What conditions do reef-building corals require to thrive?",
        options: [
          "Cold, deep, murky water",
          "Warm, clear, shallow, clean water",
          "Freshwater rivers",
          "Extremely cold polar water",
        ],
        correct: 1,
        explanation: "Reef-building corals require warm, clear, shallow, and clean saltwater to survive.",
        difficulty: "easy",
      },
      {
        id: "cr4",
        text: "The Great Barrier Reef is the world's largest coral reef system.",
        question: "Where is the Great Barrier Reef located?",
        options: ["Near Brazil", "Near Indonesia", "Off the coast of Australia", "In the Caribbean Sea"],
        correct: 2,
        explanation: "The Great Barrier Reef is located off the northeastern coast of Australia.",
        difficulty: "easy",
      },
      {
        id: "cr5",
        text: "Coral bleaching is caused by rising temperatures, acidification, overfishing, and pollution.",
        question: "What is coral bleaching caused by?",
        options: [
          "Too much sunlight reaching deep water",
          "Rising ocean temperatures and acidification",
          "Excessive reef fishing",
          "Natural aging of coral",
        ],
        correct: 1,
        explanation: "Coral bleaching is primarily caused by rising ocean temperatures that stress the coral, causing them to expel algae.",
        difficulty: "hard",
      },
    ],
  },
  {
    id: "moon",
    title: "The Moon",
    content:
      "The Moon is Earth's only natural satellite and the fifth-largest moon in the solar system. It orbits Earth at an average distance of about 384,400 km, completing one orbit every 27.3 days — called the sidereal period. The Moon's gravitational pull on Earth causes ocean tides and stabilizes Earth's axial tilt. The Moon has no atmosphere, so it experiences extreme temperature variations and has no weather. Its surface is covered with craters, mountains, and large flat plains called maria, formed by ancient volcanic activity. The Moon always shows the same face to Earth due to synchronous rotation. Humans first walked on the Moon in 1969 during NASA's Apollo 11 mission.",
    questions: [
      {
        id: "mo1",
        text: "The Moon is Earth's only natural satellite, orbiting at about 384,400 km.",
        question: "How long does the Moon take to complete one orbit around Earth?",
        options: ["7 days", "14 days", "27.3 days", "30 days"],
        correct: 2,
        explanation: "The Moon completes one orbit around Earth in about 27.3 days (the sidereal period).",
        difficulty: "medium",
      },
      {
        id: "mo2",
        text: "The Moon's gravity causes ocean tides and stabilizes Earth's axial tilt.",
        question: "Besides causing tides, what does the Moon's gravity do for Earth?",
        options: [
          "It creates Earth's magnetic field",
          "It stabilizes Earth's axial tilt",
          "It generates Earth's heat",
          "It controls Earth's rotation speed",
        ],
        correct: 1,
        explanation: "The Moon's gravity stabilizes Earth's axial tilt, helping maintain stable seasons.",
        difficulty: "hard",
      },
      {
        id: "mo3",
        text: "The Moon has no atmosphere, so it experiences extreme temperatures and no weather.",
        question: "Why does the Moon have no weather?",
        options: [
          "It is too close to Earth",
          "It has no atmosphere",
          "It is too cold",
          "It has no water",
        ],
        correct: 1,
        explanation: "Without an atmosphere, the Moon has no weather, wind, rain, or temperature moderation.",
        difficulty: "easy",
      },
      {
        id: "mo4",
        text: "The Moon always shows the same face to Earth due to synchronous rotation.",
        question: "Why do we always see the same side of the Moon from Earth?",
        options: [
          "The Moon does not rotate",
          "Because of synchronous rotation matching its orbital period",
          "The dark side is always facing away",
          "Because Earth's shadow covers the other side",
        ],
        correct: 1,
        explanation: "The Moon's rotation period equals its orbital period (synchronous rotation), so we always see the same face.",
        difficulty: "hard",
      },
      {
        id: "mo5",
        text: "Humans first walked on the Moon in 1969 during Apollo 11.",
        question: "When did humans first walk on the Moon?",
        options: ["1959", "1965", "1969", "1972"],
        correct: 2,
        explanation: "Astronauts Neil Armstrong and Buzz Aldrin first walked on the Moon in 1969 (Apollo 11).",
        difficulty: "easy",
      },
    ],
  },
  {
    id: "sound_waves",
    title: "Sound Waves",
    content:
      "Sound is a type of mechanical wave that travels through a medium such as air, water, or solids, by creating alternating regions of compression and rarefaction (expansion) in the medium. Sound cannot travel through a vacuum because there are no particles to vibrate and transmit the wave. The speed of sound depends on the medium it travels through — it moves faster through denser materials. In air at room temperature, sound travels at about 343 meters per second. The pitch of a sound is determined by its frequency (number of vibrations per second, measured in Hertz), while the loudness is determined by its amplitude. Ultrasound (above 20,000 Hz) is used in medical imaging and sonar.",
    questions: [
      {
        id: "sw1",
        text: "Sound is a mechanical wave that travels through a medium by creating compressions and rarefactions.",
        question: "Through which of these can sound NOT travel?",
        options: ["Air", "Water", "Steel", "A vacuum"],
        correct: 3,
        explanation: "Sound cannot travel through a vacuum because there are no particles to vibrate and transmit waves.",
        difficulty: "easy",
      },
      {
        id: "sw2",
        text: "Sound moves faster through denser materials.",
        question: "In which medium does sound travel fastest?",
        options: ["Air", "Water", "Steel", "A vacuum"],
        correct: 2,
        explanation: "Sound travels fastest through dense solids like steel, where particles are closely packed.",
        difficulty: "medium",
      },
      {
        id: "sw3",
        text: "The pitch of sound is determined by its frequency, measured in Hertz.",
        question: "What determines the PITCH of a sound?",
        options: ["Amplitude", "Frequency (Hz)", "Speed", "Wavelength in cm"],
        correct: 1,
        explanation: "Pitch is determined by frequency — higher frequency means higher pitch.",
        difficulty: "medium",
      },
      {
        id: "sw4",
        text: "Loudness of sound is determined by its amplitude.",
        question: "What property of a sound wave determines its loudness?",
        options: ["Frequency", "Speed", "Amplitude", "Wavelength"],
        correct: 2,
        explanation: "Amplitude (the height of the wave) determines loudness — greater amplitude means louder sound.",
        difficulty: "medium",
      },
      {
        id: "sw5",
        text: "Ultrasound (above 20,000 Hz) is used in medical imaging and sonar.",
        question: "What is ultrasound used for?",
        options: [
          "Amplifying music",
          "Medical imaging and sonar",
          "Blocking noise pollution",
          "Measuring temperature",
        ],
        correct: 1,
        explanation: "Ultrasound (>20,000 Hz) is used in medical imaging (like pregnancy scans) and sonar technology.",
        difficulty: "easy",
      },
    ],
  },
];

import { EXTRA_QUESTIONS } from "./gameDataExtra";

const MERGED_TEXTS: ExplanationText[] = EXPLANATION_TEXTS.map((text) => ({
  ...text,
  questions: [...text.questions, ...(EXTRA_QUESTIONS[text.id] ?? [])] as QuizQuestion[],
}));

export const LEVEL1_QUESTIONS = MERGED_TEXTS;

export const LEVEL2_QUESTIONS: ExplanationText[] = MERGED_TEXTS.map((text) => ({
  ...text,
  questions: text.questions.map((q) => ({
    ...q,
    difficulty: q.difficulty === "easy" ? ("medium" as const) : q.difficulty === "medium" ? ("hard" as const) : ("hard" as const),
  } as QuizQuestion)),
}));

export function getRandomText(level: number, usedIds: string[]): ExplanationText {
  const pool = level === 1 ? LEVEL1_QUESTIONS : LEVEL2_QUESTIONS;
  const available = pool.filter((t) => !usedIds.includes(t.id));
  if (available.length === 0) return pool[Math.floor(Math.random() * pool.length)];
  return available[Math.floor(Math.random() * available.length)];
}

export function getRandomLevel3Text(usedIds: string[]): Level3ExplanationText {
  const available = LEVEL3_TEXTS.filter((t) => !usedIds.includes(t.id));
  const pool = available.length === 0 ? LEVEL3_TEXTS : available;
  return pool[Math.floor(Math.random() * pool.length)];
}

export type MatchingPair = { left: string; right: string };
export type MatchingQuestion = {
  id: string;
  type: "matching";
  instruction: string;
  pairs: MatchingPair[];
  explanation: string;
  difficulty: "expert";
};
export type AnyQuestion = QuizQuestion | MatchingQuestion;
export type Level3ExplanationText = {
  id: string;
  title: string;
  content: string;
  questions: MatchingQuestion[];
};

export const LEVEL3_TEXTS: Level3ExplanationText[] = [
  {
    id: "cellular-respiration",
    title: "Cellular Respiration",
    content:
      "Cellular respiration is the multi-stage biochemical process by which cells extract energy from organic molecules, primarily glucose, to synthesize ATP. It proceeds through four integrated stages: glycolysis in the cytosol converts glucose into two pyruvate molecules, yielding 2 net ATP and 2 NADH; pyruvate oxidation in the mitochondrial matrix converts pyruvate to acetyl-CoA with the release of CO₂; the Krebs (citric acid) cycle in the matrix generates electron carriers (NADH, FADH₂) and 2 ATP per glucose; and oxidative phosphorylation at the inner mitochondrial membrane uses the electron transport chain and ATP synthase to produce 28–32 ATP via chemiosmosis. Each stage is tightly regulated by allosteric enzymes that respond to the cell's energy status.",
    questions: [
      {
        id: "cr1",
        type: "matching",
        instruction: "Match each metabolic stage to its primary NET output per glucose molecule.",
        pairs: [
          { left: "Glycolysis", right: "2 net ATP + 2 NADH (cytosol)" },
          { left: "Pyruvate Oxidation", right: "2 acetyl-CoA + 2 CO₂ + 2 NADH" },
          { left: "Krebs Cycle", right: "2 ATP + 6 NADH + 2 FADH₂ + 4 CO₂" },
          { left: "Oxidative Phosphorylation", right: "28–32 ATP via proton chemiosmosis" },
        ],
        explanation: "Each stage has a distinct location, inputs, and outputs. Oxidative phosphorylation accounts for the vast majority of ATP, using the NADH and FADH₂ produced upstream.",
        difficulty: "expert",
      },
      {
        id: "cr2",
        type: "matching",
        instruction: "Match each key enzyme to its precise function in cellular respiration.",
        pairs: [
          { left: "Hexokinase", right: "Phosphorylates glucose to glucose-6-phosphate, trapping it in the cell" },
          { left: "Pyruvate dehydrogenase", right: "Converts pyruvate to acetyl-CoA, releasing CO₂ and generating NADH" },
          { left: "Isocitrate dehydrogenase", right: "Catalyses first CO₂-releasing oxidation step in the Krebs cycle" },
          { left: "ATP synthase", right: "Uses H⁺ electrochemical gradient to phosphorylate ADP → ATP" },
        ],
        explanation: "These enzymes act at critical regulatory checkpoints. Hexokinase commits glucose to glycolysis; ATP synthase is the final energy-harvesting step.",
        difficulty: "expert",
      },
      {
        id: "cr3",
        type: "matching",
        instruction: "Match each electron carrier or complex to its specific role in the ETC.",
        pairs: [
          { left: "NADH", right: "Donates electrons to Complex I (NADH dehydrogenase)" },
          { left: "FADH₂", right: "Donates electrons to Complex II (succinate dehydrogenase), bypassing Complex I" },
          { left: "Ubiquinone (CoQ)", right: "Lipid-soluble mobile carrier shuttling e⁻ from Complex I/II to Complex III" },
          { left: "Cytochrome c", right: "Water-soluble mobile carrier shuttling e⁻ from Complex III to Complex IV" },
        ],
        explanation: "The ETC consists of protein complexes and mobile carriers. FADH₂ entering at Complex II pumps fewer protons, yielding less ATP than NADH.",
        difficulty: "expert",
      },
      {
        id: "cr4",
        type: "matching",
        instruction: "Match each metabolic condition to its direct biochemical consequence.",
        pairs: [
          { left: "Anaerobic conditions", right: "Pyruvate → lactate via fermentation, regenerating NAD⁺ for glycolysis" },
          { left: "Cyanide poisoning", right: "Blocks Complex IV; proton gradient collapses; ATP synthesis stops immediately" },
          { left: "Uncoupling protein (UCP1) activation", right: "Proton gradient dissipated as heat without ATP synthesis" },
          { left: "High AMP:ATP ratio", right: "Allosterically activates PFK-1, accelerating glycolysis to restore ATP" },
        ],
        explanation: "Metabolic flexibility allows cells to respond to energy crises. Cyanide is lethal because it eliminates the cell's main ATP source instantly.",
        difficulty: "expert",
      },
      {
        id: "cr5",
        type: "matching",
        instruction: "Match each subcellular location to the metabolic process occurring there.",
        pairs: [
          { left: "Cytosol", right: "Glycolysis: glucose → 2 pyruvate + 2 ATP + 2 NADH" },
          { left: "Mitochondrial matrix", right: "Pyruvate oxidation + Krebs cycle producing NADH and FADH₂" },
          { left: "Inner mitochondrial membrane", right: "Electron transport chain complexes and ATP synthase" },
          { left: "Intermembrane space", right: "Proton accumulation creating the electrochemical gradient (Δψ + ΔpH)" },
        ],
        explanation: "Compartmentalisation is essential: glycolysis occurs outside the mitochondria, while the most efficient ATP production is coupled to the inner membrane's proton gradient.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "dna-protein-synthesis",
    title: "DNA Replication & Protein Synthesis",
    content:
      "Genetic information flows from DNA to RNA to protein — Crick's Central Dogma. During replication, the double helix is unwound by helicase; primase lays RNA primers; DNA polymerase III elongates new strands 5'→3'; ligase seals Okazaki fragments on the lagging strand. In transcription, RNA polymerase reads the template strand 3'→5' to produce pre-mRNA; introns are spliced out by snRNP complexes. During translation, ribosomes read mRNA codons in the 5'→3' direction; aminoacyl-tRNAs deliver amino acids; peptidyl transferase catalyses peptide bond formation at the ribosome's P-site. Gene expression is regulated at multiple levels: chromatin remodelling, transcription initiation, RNA processing, translation initiation, and post-translational modification all fine-tune protein output.",
    questions: [
      {
        id: "dps1",
        type: "matching",
        instruction: "Match each replication enzyme to its precise molecular role.",
        pairs: [
          { left: "Helicase", right: "Breaks H-bonds between base pairs, unwinding the double helix ahead of the fork" },
          { left: "Primase", right: "Synthesises short RNA primers to provide a 3'-OH for DNA polymerase" },
          { left: "DNA Polymerase III", right: "Adds deoxyribonucleotides 5'→3' using the template; also has 3'→5' proofreading" },
          { left: "DNA Ligase", right: "Seals phosphodiester bonds between Okazaki fragments on the lagging strand" },
        ],
        explanation: "DNA polymerase cannot start de novo — it needs a primer. The lagging strand is synthesised discontinuously as Okazaki fragments, later joined by ligase.",
        difficulty: "expert",
      },
      {
        id: "dps2",
        type: "matching",
        instruction: "Match each RNA type to its distinct function in gene expression.",
        pairs: [
          { left: "mRNA", right: "Encodes the amino acid sequence of a protein as triplet codons" },
          { left: "tRNA", right: "Anticodon matches mRNA codon; carries specific amino acid to ribosome A-site" },
          { left: "rRNA", right: "Structural scaffold and catalytic ribozyme component of the ribosome" },
          { left: "snRNA", right: "Component of spliceosome; excises introns from pre-mRNA in the nucleus" },
        ],
        explanation: "RNA has diverse structural and catalytic roles. The discovery that rRNA catalyses peptide bond formation (ribozyme) challenged the protein-only enzyme dogma.",
        difficulty: "expert",
      },
      {
        id: "dps3",
        type: "matching",
        instruction: "Match each mutation type to its specific molecular consequence.",
        pairs: [
          { left: "Missense mutation", right: "Single nucleotide change → different amino acid; may alter protein conformation or activity" },
          { left: "Nonsense mutation", right: "Point mutation creates premature stop codon → truncated, usually nonfunctional protein" },
          { left: "Frameshift insertion", right: "Addition of nucleotide(s) shifts reading frame → completely different downstream amino acid sequence" },
          { left: "Silent mutation", right: "Synonymous codon substitution → same amino acid; typically no phenotypic effect" },
        ],
        explanation: "Frameshift mutations are generally most damaging because they affect every subsequent codon. Nonsense mutations produce truncated proteins that are usually degraded by nonsense-mediated decay.",
        difficulty: "expert",
      },
      {
        id: "dps4",
        type: "matching",
        instruction: "Match each ribosome site or component to its function during translation.",
        pairs: [
          { left: "A site (aminoacyl)", right: "Accepts incoming charged aminoacyl-tRNA with matching anticodon" },
          { left: "P site (peptidyl)", right: "Holds tRNA carrying the growing polypeptide chain" },
          { left: "E site (exit)", right: "Releases uncharged tRNA after peptide bond transfer" },
          { left: "Peptidyl transferase centre", right: "Catalyses peptide bond formation between A-site amino acid and P-site chain (ribozyme activity)" },
        ],
        explanation: "Translocation moves the ribosome 3 nucleotides along mRNA after each cycle: A→P→E. The catalytic centre is rRNA, not protein.",
        difficulty: "expert",
      },
      {
        id: "dps5",
        type: "matching",
        instruction: "Match each gene regulation mechanism to its specific molecular effect.",
        pairs: [
          { left: "CpG methylation", right: "Silences gene expression; prevents transcription factor and RNA polymerase access" },
          { left: "Histone acetylation", right: "Neutralises histone charge; loosens nucleosome packing; permits transcription" },
          { left: "miRNA binding to 3'-UTR", right: "Post-transcriptional silencing; blocks translation or triggers mRNA degradation" },
          { left: "Lac operon repressor (no inducer)", right: "Occupies operator site; physically blocks RNA polymerase progression" },
        ],
        explanation: "Gene regulation is multilayered. Epigenetic modifications (methylation, acetylation) can be heritable without changing the DNA sequence — fundamental to development and disease.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "plate-tectonics",
    title: "Plate Tectonics & Earth Dynamics",
    content:
      "Earth's lithosphere is divided into large tectonic plates that move atop the semi-plastic asthenosphere driven by mantle convection, ridge push, and slab pull. At divergent boundaries, plates separate and new oceanic crust forms at mid-ocean ridges by seafloor spreading, evidenced by symmetric palaeomagnetic stripes. At convergent boundaries, oceanic crust subducts beneath less-dense plates, generating deep-sea trenches, volcanic arcs, and Wadati–Benioff seismic zones. Continental collisions build mountain ranges through crustal thickening (orogeny). Transform boundaries produce lateral faulting and frequent shallow earthquakes without volcanism. Hotspots — stationary mantle plumes — leave linear volcanic island chains as plates pass overhead. These processes drive the Wilson cycle of supercontinent assembly and dispersal.",
    questions: [
      {
        id: "pt1",
        type: "matching",
        instruction: "Match each plate boundary type to its characteristic geological feature.",
        pairs: [
          { left: "Divergent boundary", right: "Mid-ocean ridges and continental rift valleys form as crust is created" },
          { left: "Oceanic-continental convergent", right: "Deep trench + volcanic arc + Wadati-Benioff seismic zone" },
          { left: "Transform boundary", right: "Strike-slip faults with frequent shallow earthquakes; no magma production" },
          { left: "Hotspot (intraplate)", right: "Linear volcanic island chain forms as plate moves over stationary mantle plume" },
        ],
        explanation: "Boundary type determines the tectonic and volcanic character of a region. Transform boundaries lack magmatism because no crust is created or destroyed — only sheared.",
        difficulty: "expert",
      },
      {
        id: "pt2",
        type: "matching",
        instruction: "Match each geological process to its primary driving mechanism.",
        pairs: [
          { left: "Seafloor spreading", right: "Convective upwelling pushes plates apart; new basaltic crust intrudes at ridge axis" },
          { left: "Subduction", right: "Denser, colder oceanic lithosphere sinks due to negative buoyancy (slab pull)" },
          { left: "Continental orogeny", right: "Collision of two buoyant continental plates forces crustal thickening and uplift" },
          { left: "Ridge push", right: "Elevated ridge exerts gravitational force on adjacent plate, contributing to plate motion" },
        ],
        explanation: "Slab pull is thought to dominate plate motion energy. Ridge push contributes but is secondary — slabs are the primary 'engine' in the system.",
        difficulty: "expert",
      },
      {
        id: "pt3",
        type: "matching",
        instruction: "Match each rock type or metamorphic facies to its tectonic formation context.",
        pairs: [
          { left: "Basalt", right: "Rapid cooling of mafic lava at ocean ridges; forms new oceanic crust" },
          { left: "Granite (batholith)", right: "Slow cooling of felsic magma deep in continental crust above subduction zones" },
          { left: "Blueschist", right: "High-pressure, low-temperature metamorphism in subducting oceanic slab" },
          { left: "Eclogite", right: "Extreme pressure metamorphism of basalt deeper in subduction zone; dense garnet-pyroxene rock" },
        ],
        explanation: "Metamorphic facies record the pressure-temperature path of rocks. Blueschist and eclogite are diagnostic of subduction and are rare at Earth's surface.",
        difficulty: "expert",
      },
      {
        id: "pt4",
        type: "matching",
        instruction: "Match each seismic event type to its specific characteristics.",
        pairs: [
          { left: "Megathrust earthquake", right: "Convergent subduction zone; can exceed Mw 9.0; generates tsunamis" },
          { left: "Deep-focus earthquake", right: "300–700 km depth in subducting slab (Wadati-Benioff zone); not felt at surface" },
          { left: "Volcanic tremor", right: "Sustained low-frequency seismic signal from fluid/magma movement; not fault rupture" },
          { left: "Intraplate earthquake", right: "Stress release on ancient faults within plate interior; unexpected and often damaging" },
        ],
        explanation: "Megathrust zones (Cascadia, Japan, Chile) represent the greatest seismic hazard globally because they can store centuries of accumulated strain.",
        difficulty: "expert",
      },
      {
        id: "pt5",
        type: "matching",
        instruction: "Match each type of evidence to what it directly supports in tectonic theory.",
        pairs: [
          { left: "Symmetric palaeomagnetic stripes on ocean floor", right: "Confirms seafloor spreading and records geomagnetic pole reversals" },
          { left: "Matching Glossopteris fossils on separated continents", right: "Supports Wegener's continental drift hypothesis and former Gondwana supercontinent" },
          { left: "Real-time GPS measurements", right: "Directly confirms current plate velocities (cm/year) and boundary types" },
          { left: "Ophiolite sequences on continents", right: "Ancient oceanic crust accreted during collision; confirms subduction and Wilson cycle" },
        ],
        explanation: "Multiple independent lines of evidence converged to establish plate tectonics in the 1960s. GPS has since transformed it from a geological inference to a measured physical reality.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "electromagnetic-spectrum",
    title: "The Electromagnetic Spectrum",
    content:
      "Electromagnetic (EM) radiation is self-propagating oscillating electric and magnetic fields that travel at c ≈ 3×10⁸ m/s in a vacuum. The EM spectrum spans radio waves (wavelengths >1 m) through microwaves, infrared, visible light (380–700 nm), ultraviolet, X-rays, and gamma rays (<0.01 nm). Photon energy E = hf = hc/λ, so shorter wavelength means higher frequency and greater energy. Low-energy radio waves induce oscillating currents in conductors; microwaves excite molecular rotations; infrared drives vibrational modes; UV causes photoionisation and DNA damage; X-rays and gamma rays ionise atoms and penetrate tissue. Wave-particle duality governs EM radiation: phenomena like the photoelectric effect and Compton scattering require the particle (photon) model, while diffraction and interference require the wave model.",
    questions: [
      {
        id: "em1",
        type: "matching",
        instruction: "Match each EM radiation type to its primary interaction with matter.",
        pairs: [
          { left: "Microwaves", right: "Excite rotational and vibrational modes of polar molecules (e.g. water); used in heating" },
          { left: "Ultraviolet (UV-B)", right: "Excites electrons; causes formation of thymine dimers, damaging DNA" },
          { left: "X-rays", right: "Ionise atoms; penetrate soft tissue; absorbed by denser materials (Ca in bone)" },
          { left: "Gamma rays", right: "Deeply penetrating ionising radiation; causes nuclear excitation and strand breaks in DNA" },
        ],
        explanation: "Energy determines the type of interaction. Gamma rays and X-rays are both ionising; the distinction is origin (nuclear vs. electron transitions) rather than wavelength overlap.",
        difficulty: "expert",
      },
      {
        id: "em2",
        type: "matching",
        instruction: "Match each EM wave property to its defining mathematical relationship.",
        pairs: [
          { left: "Frequency (f) and wavelength (λ)", right: "f = c/λ; inversely proportional at constant speed of light" },
          { left: "Photon energy (E)", right: "E = hf = hc/λ; proportional to frequency (Planck-Einstein relation)" },
          { left: "Refractive index (n)", right: "n = c/v; ratio of light speed in vacuum to speed in the medium" },
          { left: "Intensity (I) vs. distance (r)", right: "I ∝ 1/r²; inverse square law for point source in 3D space" },
        ],
        explanation: "These equations are the mathematical backbone of optics and quantum physics. The inverse square law explains why distant stars appear dim despite enormous luminosity.",
        difficulty: "expert",
      },
      {
        id: "em3",
        type: "matching",
        instruction: "Match each EM phenomenon to its correct physical explanation.",
        pairs: [
          { left: "Blue sky (Rayleigh scattering)", right: "Short wavelengths scatter ∝ 1/λ⁴ more efficiently in atmosphere" },
          { left: "Photoelectric effect", right: "Photons above threshold frequency eject electrons; supports particle model of light" },
          { left: "Total internal reflection", right: "Light striking interface below critical angle is completely reflected; basis of fibre optics" },
          { left: "Compton scattering", right: "X-ray photon transfers momentum to electron; wavelength increases; confirms photon momentum" },
        ],
        explanation: "Each phenomenon reveals a different facet of EM radiation. The photoelectric effect, explained by Einstein (1905), showed light must be quantised, earning him the Nobel Prize.",
        difficulty: "expert",
      },
      {
        id: "em4",
        type: "matching",
        instruction: "Match each technological application to the EM wave responsible.",
        pairs: [
          { left: "MRI (Magnetic Resonance Imaging)", right: "Radio waves flip proton spin alignment in hydrogen atoms within magnetic field" },
          { left: "Greenhouse effect", right: "Infrared radiation emitted by Earth's surface is absorbed and re-emitted by CO₂ and H₂O" },
          { left: "Sterilisation of surgical equipment", right: "Gamma radiation or UV-C destroys microbial DNA and proteins" },
          { left: "Night-vision cameras", right: "Near-infrared radiation emitted by warm bodies detected by IR-sensitive sensors" },
        ],
        explanation: "Applied EM technology exploits specific wave-matter interactions. MRI uses low-energy radio waves, making it safer than X-ray-based imaging.",
        difficulty: "expert",
      },
      {
        id: "em5",
        type: "matching",
        instruction: "Match each EM spectrum region to its approximate wavelength range.",
        pairs: [
          { left: "X-rays", right: "0.01–10 nm; between gamma rays and UV; used in medical imaging" },
          { left: "Visible light", right: "380–700 nm; narrow band detectable by human photoreceptors" },
          { left: "Infrared", right: "700 nm – 1 mm; emitted by warm objects as thermal radiation" },
          { left: "Microwaves", right: "1 mm – 1 m; used in radar, satellite communication, and microwave ovens" },
        ],
        explanation: "The boundaries between EM regions are defined by interaction type, not sharp lines. Visible light is a tiny fraction — human eyes evolved to detect the peak output of the Sun.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "ecological-relationships",
    title: "Ecological Relationships & Ecosystem Dynamics",
    content:
      "Ecosystems are structured by complex biotic and abiotic interactions. Species relationships include mutualism (both benefit), commensalism (one benefits, one unaffected), parasitism (one benefits at the other's expense), and predation. Competitive exclusion (Gause's principle) states that two species occupying identical ecological niches cannot coexist indefinitely. Energy flows through trophic levels with approximately 10% efficiency, limiting food chain length. Keystone species have disproportionately large ecosystem impacts; their removal triggers trophic cascades. Biogeochemical cycles — carbon, nitrogen, phosphorus — sustain ecosystem productivity. Ecological succession moves communities from pioneer species to climax communities, interrupted by disturbances. Ecosystem services (provisioning, regulating, supporting, cultural) underpin human well-being.",
    questions: [
      {
        id: "er1",
        type: "matching",
        instruction: "Match each species interaction type to its defining fitness outcome.",
        pairs: [
          { left: "Mutualism", right: "Both species gain fitness; interaction can be obligatory (neither can survive alone) or facultative" },
          { left: "Commensalism", right: "One species benefits (e.g. epiphyte on tree); host is neither helped nor harmed" },
          { left: "Parasitism", right: "Parasite increases fitness; host fitness reduced but not immediately killed (unlike predation)" },
          { left: "Competitive exclusion", right: "Two species with identical niches cannot coexist; inferior competitor is excluded or goes extinct locally" },
        ],
        explanation: "Mutualism and parasitism are endpoints of a continuum. Some relationships (e.g., gut bacteria) shift along this continuum depending on environmental conditions.",
        difficulty: "expert",
      },
      {
        id: "er2",
        type: "matching",
        instruction: "Match each trophic ecology concept to its precise ecological significance.",
        pairs: [
          { left: "10% energy transfer rule", right: "~90% of energy lost as heat at each trophic level; limits realistic food chain length to 4–5 links" },
          { left: "Trophic cascade", right: "Removal of apex predator triggers population explosion at lower levels, altering vegetation" },
          { left: "Keystone species", right: "Disproportionate ecosystem effect relative to biomass; removal causes fundamental community change" },
          { left: "Ecological niche", right: "Multidimensional hypervolume describing all biotic and abiotic conditions a species requires" },
        ],
        explanation: "Sea otters are a classic keystone species: their removal allowed sea urchin populations to explode, decimating kelp forests — a three-level trophic cascade.",
        difficulty: "expert",
      },
      {
        id: "er3",
        type: "matching",
        instruction: "Match each biogeochemical cycle component to the specific process it describes.",
        pairs: [
          { left: "Nitrogen fixation", right: "Atmospheric N₂ converted to NH₃ by diazotrophic bacteria (Rhizobium, Azotobacter, cyanobacteria)" },
          { left: "Denitrification", right: "Nitrate (NO₃⁻) reduced back to N₂ gas by anaerobic bacteria in waterlogged soils" },
          { left: "Phosphorus weathering", right: "Rocks dissolve releasing PO₄³⁻; phosphorus has no significant atmospheric reservoir unlike C or N" },
          { left: "Carbon sequestration", right: "Long-term CO₂ storage in deep ocean sediment, permafrost, or biomass; decouples C from short cycle" },
        ],
        explanation: "Nitrogen is often the limiting nutrient in terrestrial ecosystems because atmospheric N₂ is chemically inert — only biological or industrial fixation makes it bioavailable.",
        difficulty: "expert",
      },
      {
        id: "er4",
        type: "matching",
        instruction: "Match each succession concept to its defining ecological characteristic.",
        pairs: [
          { left: "Primary succession", right: "Begins on bare substrate (lava, glacial till) with no soil; progresses over centuries" },
          { left: "Secondary succession", right: "Occurs after disturbance (fire, agriculture) where soil intact; faster than primary" },
          { left: "Climax community", right: "Self-sustaining stable endpoint in equilibrium with regional climate; concept now debated" },
          { left: "Facilitation model", right: "Early species modify environment, making it favourable for later species that eventually replace them" },
        ],
        explanation: "The facilitation model explains why pioneer species disappear: lichens breaking down rock create soil that allows mosses to outcompete them, then grasses outcompete mosses.",
        difficulty: "expert",
      },
      {
        id: "er5",
        type: "matching",
        instruction: "Match each ecosystem service to its classification and example.",
        pairs: [
          { left: "Pollination of crop plants", right: "Provisioning service — directly enables food production for human consumption" },
          { left: "Flood attenuation by wetlands", right: "Regulating service — mitigates natural hazards by absorbing and slowly releasing water" },
          { left: "Nutrient cycling by decomposers", right: "Supporting service — underpins all other services; without it, nutrients would be locked in dead matter" },
          { left: "Spiritual significance of ancient forests", right: "Cultural service — provides aesthetic, religious, and psychological value to communities" },
        ],
        explanation: "Supporting services are foundational: without decomposition and nutrient cycling, provisioning and regulating services would collapse. All four categories are interdependent.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "human-immune-system",
    title: "The Human Immune System",
    content:
      "The immune system operates through two interconnected arms. The innate immune system provides immediate, non-specific defence: physical barriers (skin, mucosa), phagocytes (neutrophils, macrophages), natural killer cells, complement proteins, and pattern-recognition receptors (TLRs) that detect pathogen-associated molecular patterns (PAMPs). The adaptive immune system provides specific, memory-forming defence via lymphocytes: B cells produce antibodies after activation and differentiation; cytotoxic T cells (CD8⁺) kill infected/cancerous cells presenting foreign peptides on MHC class I; helper T cells (CD4⁺) coordinate responses via cytokines. Immunological memory — long-lived plasma cells and memory lymphocytes — enables faster, stronger secondary responses, the basis of vaccination. Regulatory T cells prevent autoimmunity by suppressing excessive responses.",
    questions: [
      {
        id: "im1",
        type: "matching",
        instruction: "Match each immune cell type to its primary effector function.",
        pairs: [
          { left: "Neutrophils", right: "First-responding phagocytes; release antimicrobial granules (oxidative burst); short-lived" },
          { left: "Natural killer (NK) cells", right: "Destroy virus-infected and tumour cells without prior sensitisation; part of innate immunity" },
          { left: "Helper T cells (CD4⁺)", right: "Activate B cells and cytotoxic T cells via cytokines; central coordinator of adaptive response" },
          { left: "Regulatory T cells (Treg)", right: "Suppress excessive immune activation; prevent autoimmunity and maintain self-tolerance" },
        ],
        explanation: "Helper T cells are 'conductors' of adaptive immunity. HIV targets CD4⁺ T cells, which is why AIDS causes immunodeficiency — the entire adaptive system loses its coordinator.",
        difficulty: "expert",
      },
      {
        id: "im2",
        type: "matching",
        instruction: "Match each adaptive immunity process to its precise molecular mechanism.",
        pairs: [
          { left: "Clonal selection", right: "Antigen binds specific receptor on one lymphocyte clone → rapid proliferation of that specific clone" },
          { left: "Somatic hypermutation", right: "Random mutations in B-cell variable region genes during germinal centre reaction; drives antibody diversity" },
          { left: "Class switching (isotype switching)", right: "B cell changes antibody constant region (IgM→IgG/IgA/IgE) while retaining same antigen specificity" },
          { left: "Affinity maturation", right: "Progressive selection of B cells with highest-affinity BCRs; antibody quality improves over infection" },
        ],
        explanation: "Germinal centres are critical sites where B cells undergo both somatic hypermutation and selection — only those with improved antigen affinity survive, progressively sharpening the antibody response.",
        difficulty: "expert",
      },
      {
        id: "im3",
        type: "matching",
        instruction: "Match each antibody isotype to its specific biological role.",
        pairs: [
          { left: "IgA", right: "Secretory antibody in mucous membranes, saliva, tears, and breast milk; first line of mucosal defence" },
          { left: "IgE", right: "Triggers mast cell and basophil degranulation in allergies; anti-parasitic (helminth) responses" },
          { left: "IgM", right: "First antibody produced in primary response; pentameric structure; potent complement activator" },
          { left: "IgG", right: "Most abundant serum antibody; crosses placenta to confer maternal immunity; opsonises pathogens" },
        ],
        explanation: "IgE levels are normally very low but dramatically elevated in atopic individuals. IgG's ability to cross the placenta explains why newborns have passive immunity during their first months.",
        difficulty: "expert",
      },
      {
        id: "im4",
        type: "matching",
        instruction: "Match each MHC molecule or component to its antigen presentation function.",
        pairs: [
          { left: "MHC class I", right: "Presents intracellular peptides (viral proteins, tumour antigens) to CD8⁺ cytotoxic T cells" },
          { left: "MHC class II", right: "Presents extracellular/endosomal antigens processed by APCs to CD4⁺ helper T cells" },
          { left: "β₂-microglobulin", right: "Non-covalently stabilises MHC class I structure; not encoded within the MHC locus" },
          { left: "Dendritic cells", right: "Most potent professional APC; only cell that can prime naive T cells in secondary lymphoid organs" },
        ],
        explanation: "All nucleated cells express MHC class I — this allows cytotoxic T cells to survey every cell. Only professional APCs express MHC class II, restricting helper T cell activation.",
        difficulty: "expert",
      },
      {
        id: "im5",
        type: "matching",
        instruction: "Match each vaccine type to its immunological mechanism.",
        pairs: [
          { left: "Live-attenuated vaccine", right: "Weakened pathogen replicates briefly; elicits strong T-cell and B-cell memory; risk in immunocompromised" },
          { left: "mRNA vaccine", right: "Lipid nanoparticles deliver mRNA; host cells produce antigen; triggers B- and T-cell responses" },
          { left: "Conjugate vaccine", right: "Polysaccharide antigen linked to protein carrier; enables T-cell help for B-cell response to weak antigens" },
          { left: "Toxoid vaccine", right: "Chemically inactivated bacterial toxin; generates neutralising antibodies without disease risk" },
        ],
        explanation: "Conjugate vaccines were a landmark innovation for Hib, pneumococcal, and meningococcal diseases — polysaccharide alone cannot activate T cells in infants, but conjugation to a protein enables T-dependent responses.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "evolution-natural-selection",
    title: "Evolution & Natural Selection",
    content:
      "Evolution is the change in heritable characteristics of biological populations over successive generations. Darwin and Wallace independently identified natural selection as the primary mechanism: heritable variation exists in populations; individuals with traits better suited to their environment survive and reproduce more; favourable alleles increase in frequency over generations. Additional mechanisms include genetic drift (random allele frequency changes, stronger in small populations), gene flow (movement of alleles between populations), and mutation (ultimate source of new variation). The Hardy-Weinberg principle defines the null expectation — allele frequencies remain constant in a large, randomly mating, isolated population with no selection or mutation. Speciation occurs when reproductive isolation accumulates between populations, either through geographic separation (allopatric) or within a shared range (sympatric). Molecular evolution, comparative genomics, and the fossil record all corroborate common descent.",
    questions: [
      {
        id: "ev1",
        type: "matching",
        instruction: "Match each evolutionary mechanism to its precise definition.",
        pairs: [
          { left: "Natural selection", right: "Differential reproductive success due to heritable phenotypic variation; directional, stabilising, or disruptive" },
          { left: "Genetic drift", right: "Random changes in allele frequency not due to fitness; strongest in small or bottlenecked populations" },
          { left: "Gene flow", right: "Movement of alleles between populations via migration; reduces genetic divergence between populations" },
          { left: "Mutation", right: "Random change in DNA sequence; ultimate source of all new alleles; raw material for evolution" },
        ],
        explanation: "Natural selection is directional — it acts on existing variation. Genetic drift is random — it can fix neutral or even slightly deleterious alleles, especially after a bottleneck.",
        difficulty: "expert",
      },
      {
        id: "ev2",
        type: "matching",
        instruction: "Match each speciation mechanism to its geographic and reproductive context.",
        pairs: [
          { left: "Allopatric speciation", right: "Geographic barrier (mountain, ocean) prevents gene flow; populations diverge independently" },
          { left: "Sympatric speciation", right: "Within same geographic area; ecological differentiation or polyploidy causes reproductive isolation" },
          { left: "Peripatric speciation", right: "Small peripheral population isolated from large ancestral population; drift accelerates divergence" },
          { left: "Reinforcement (secondary contact)", right: "Hybrid disadvantage selects for stronger pre-zygotic isolation when partially diverged populations meet" },
        ],
        explanation: "Sympatric speciation is controversial because gene flow should homogenise populations — it requires strong disruptive selection or polyploidy to overcome this.",
        difficulty: "expert",
      },
      {
        id: "ev3",
        type: "matching",
        instruction: "Match each Hardy-Weinberg assumption violation to its evolutionary consequence.",
        pairs: [
          { left: "Non-random mating (inbreeding)", right: "Alters genotype frequencies (increases homozygosity) without changing allele frequencies" },
          { left: "Small population size", right: "Genetic drift increases; alleles fix or disappear randomly; loss of genetic diversity" },
          { left: "Natural selection", right: "Directionally changes allele frequencies based on differential reproductive fitness" },
          { left: "Mutation pressure", right: "Introduces new alleles at low rate; shifts allele frequency equilibrium very slowly" },
        ],
        explanation: "The Hardy-Weinberg equilibrium is never truly achieved in nature — it is a null model used to detect which evolutionary forces are acting on a population.",
        difficulty: "expert",
      },
      {
        id: "ev4",
        type: "matching",
        instruction: "Match each type of adaptation to its defining example.",
        pairs: [
          { left: "Physiological adaptation", right: "Desert mammals produce highly concentrated urine via long loop of Henle to conserve water" },
          { left: "Behavioural adaptation", right: "Arctic terns migrate 70,000 km annually to exploit continuous daylight at both poles" },
          { left: "Morphological adaptation", right: "Dolphin streamlined body shape reduces drag coefficient; convergently evolved with sharks and ichthyosaurs" },
          { left: "Co-evolution", right: "Orchid flower morphology and moth proboscis length evolve in synchrony (reciprocal selection)" },
        ],
        explanation: "Co-evolution can produce extreme specificity (Darwin's star orchid and its predicted pollinator, found 40 years later). Convergent morphology in dolphins and sharks illustrates selection's power to independently produce similar solutions.",
        difficulty: "expert",
      },
      {
        id: "ev5",
        type: "matching",
        instruction: "Match each type of evidence to what it demonstrates in evolutionary theory.",
        pairs: [
          { left: "Comparative genomics", right: "Shared orthologous genes and synteny reveal common ancestry and divergence timescales" },
          { left: "Transitional fossil forms", right: "Documents gradual anatomical changes over geological time (e.g. Tiktaalik, Archaeopteryx)" },
          { left: "Biogeography", right: "Distribution of taxa reflects evolutionary history of landmasses and dispersal events" },
          { left: "Molecular clock", right: "Neutral mutation rate calibrated to known divergence events estimates timing of speciation" },
        ],
        explanation: "The molecular clock assumes a roughly constant neutral mutation rate. Calibrated against fossils, it can date evolutionary events that left no fossil record (e.g. the divergence of humans and chimpanzees ~6–7 mya).",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "thermodynamics-biology",
    title: "Thermodynamics in Biological Systems",
    content:
      "Living organisms are open thermodynamic systems that maintain order by consuming free energy and exporting entropy. The First Law of Thermodynamics states energy is conserved; the Second Law states entropy of a closed system increases spontaneously. Gibbs free energy (ΔG = ΔH – TΔS) predicts whether a reaction is spontaneous under constant temperature and pressure: ΔG < 0 is exergonic (spontaneous); ΔG > 0 is endergonic (requires energy input). Cells couple endergonic reactions to ATP hydrolysis (ΔG° = –30.5 kJ/mol). Enzymes lower activation energy without changing ΔG; they are not consumed in reactions. Enzyme activity is regulated by competitive inhibitors (bind active site), non-competitive inhibitors (bind allosteric site), and feedback inhibition (product inhibits upstream enzyme). Cells operate far from equilibrium — sustained by constant energy input — maintaining the concentration gradients and ordered structures essential for life.",
    questions: [
      {
        id: "th1",
        type: "matching",
        instruction: "Match each thermodynamic quantity to its biological significance.",
        pairs: [
          { left: "Gibbs free energy (ΔG)", right: "Determines reaction spontaneity at constant T and P; negative ΔG = spontaneous in cells" },
          { left: "Entropy (ΔS)", right: "Measure of disorder; cells locally decrease entropy by consuming free energy and exporting heat" },
          { left: "Activation energy (Ea)", right: "Energy barrier enzymes lower; determines reaction rate without affecting thermodynamic spontaneity" },
          { left: "Standard free energy (ΔG°')", right: "ΔG at pH 7, 25°C, 1M concentrations; reference point for biochemical reactions" },
        ],
        explanation: "Cells operate far from thermodynamic equilibrium. ΔG in cells differs from ΔG° because actual metabolite concentrations are far from 1 M standard conditions.",
        difficulty: "expert",
      },
      {
        id: "th2",
        type: "matching",
        instruction: "Match each reaction type to its thermodynamic and cellular characteristic.",
        pairs: [
          { left: "Exergonic reaction", right: "ΔG < 0; spontaneous; releases free energy usable for cellular work" },
          { left: "Endergonic reaction", right: "ΔG > 0; non-spontaneous; driven by coupling to exergonic reactions like ATP hydrolysis" },
          { left: "Coupled reaction pair", right: "Exergonic reaction (ATP hydrolysis) directly drives endergonic process; total ΔG must be negative" },
          { left: "Chemical equilibrium", right: "Forward and reverse rates equal; ΔG = 0; cells avoid this state — it means death" },
        ],
        explanation: "Life requires disequilibrium. ATP coupling is a universal strategy: its hydrolysis (ΔG° = –30.5 kJ/mol) is used to drive ~80% of cellular biosynthetic and transport reactions.",
        difficulty: "expert",
      },
      {
        id: "th3",
        type: "matching",
        instruction: "Match each enzyme inhibition type to its mechanism and kinetic effect.",
        pairs: [
          { left: "Competitive inhibitor", right: "Binds active site; increases apparent Km; overcome by excess substrate; Vmax unchanged" },
          { left: "Non-competitive inhibitor", right: "Binds allosteric site; reduces Vmax; cannot be overcome by substrate; Km unchanged" },
          { left: "Uncompetitive inhibitor", right: "Binds only enzyme-substrate complex; decreases both Km and Vmax simultaneously" },
          { left: "Irreversible inhibitor", right: "Covalently modifies active site; permanently inactivates enzyme (e.g. nerve agents on acetylcholinesterase)" },
        ],
        explanation: "Kinetic analysis (Lineweaver-Burk plots) distinguishes inhibitor types by whether Km and Vmax change. Irreversible inhibitors include many drugs (aspirin on COX) and poisons.",
        difficulty: "expert",
      },
      {
        id: "th4",
        type: "matching",
        instruction: "Match each thermodynamic law or principle to its biological implication.",
        pairs: [
          { left: "First Law of Thermodynamics", right: "Energy neither created nor destroyed; metabolic energy converted from food, not generated" },
          { left: "Second Law of Thermodynamics", right: "No conversion is 100% efficient; metabolic reactions generate heat, warming the body" },
          { left: "Le Chatelier's principle", right: "Cells remove products (via further reactions) to pull thermodynamically unfavourable reactions forward" },
          { left: "Steady state (not equilibrium)", right: "Constant metabolite concentrations maintained far from equilibrium by continuous energy input" },
        ],
        explanation: "Steady state is a critical concept: a living cell at true equilibrium is dead. Le Chatelier's principle explains how downstream reactions can 'pull' otherwise unfavourable upstream reactions.",
        difficulty: "expert",
      },
      {
        id: "th5",
        type: "matching",
        instruction: "Match each metabolic condition to its direct thermodynamic consequence.",
        pairs: [
          { left: "High [ATP]/[ADP] ratio", right: "Inhibits PFK-1 and other catabolic enzymes; signals energy sufficiency; slows catabolism" },
          { left: "Proton-motive force (Δp)", right: "Stores chemiosmotic potential energy (Δψ + ΔpH); drives ATP synthase rotor" },
          { left: "Enzyme denaturation", right: "Loss of tertiary structure destroys active site geometry; cannot lower Ea; reaction rate collapses" },
          { left: "Uncoupler (e.g. DNP, UCP1)", right: "Dissipates Δp as heat without ATP synthesis; used in thermogenesis; dangerous if unregulated" },
        ],
        explanation: "Brown adipose tissue uses uncoupling protein UCP1 to intentionally waste the proton gradient as body heat — essential for neonatal and hibernating mammals.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "genetics-inheritance",
    title: "Genetics & Inheritance Patterns",
    content:
      "Genetics explains how traits are transmitted across generations. Mendel's Law of Segregation states alleles separate during gamete formation (meiosis I); his Law of Independent Assortment states non-homologous chromosomes assort randomly — violated when genes are linked. Dominance relationships vary: complete dominance, incomplete dominance (blended phenotype), codominance (both alleles expressed), and multiple alleles (e.g. ABO blood group). Sex-linked inheritance differs between X-linked (affected males more common in recessive) and Y-linked (only males, paternal transmission). Chromosomal abnormalities arise from non-disjunction (trisomy/monosomy), translocations, inversions, and deletions. Epigenetic mechanisms — DNA methylation, histone modification, non-coding RNA — modulate gene expression without altering sequence. Polygenic traits (height, skin pigmentation) produce continuous phenotypic distributions influenced by both genotype and environment.",
    questions: [
      {
        id: "ge1",
        type: "matching",
        instruction: "Match each inheritance pattern to its defining genotypic characteristic.",
        pairs: [
          { left: "Autosomal dominant", right: "One mutant allele sufficient; affected individual appears in every generation; 50% offspring risk" },
          { left: "Autosomal recessive", right: "Two mutant alleles required; carrier parents often unaffected; higher risk with consanguinity" },
          { left: "X-linked recessive", right: "Males (XY) affected more frequently; carrier females have one functional allele; no father-to-son transmission" },
          { left: "Codominance", right: "Both alleles expressed simultaneously in heterozygote; neither masks the other (e.g. AB blood type)" },
        ],
        explanation: "X-linked recessive traits skip generations in females because they can be heterozygous carriers. The Y chromosome has very few functional genes, explaining the pattern.",
        difficulty: "expert",
      },
      {
        id: "ge2",
        type: "matching",
        instruction: "Match each Mendel's law or its exception to its modern chromosomal explanation.",
        pairs: [
          { left: "Law of Segregation", right: "Homologous chromosomes separate at meiosis I; each gamete receives exactly one allele per locus" },
          { left: "Law of Independent Assortment", right: "Non-homologous chromosomes align randomly at metaphase I; genes on different chromosomes assort independently" },
          { left: "Linkage (violation of assortment)", right: "Genes on same chromosome tend to be inherited together unless separated by crossing over" },
          { left: "Crossing over (recombination)", right: "Physical exchange between non-sister chromatids at chiasmata; creates new allele combinations (recombinants)" },
        ],
        explanation: "Recombination frequency is used to map gene distances — genes farther apart recombine more often (up to 50% = independent assortment). Recombination frequency > 50% is impossible.",
        difficulty: "expert",
      },
      {
        id: "ge3",
        type: "matching",
        instruction: "Match each chromosomal abnormality to its mechanism and clinical consequence.",
        pairs: [
          { left: "Non-disjunction at meiosis I", right: "Both homologues go to same pole → gametes with 2 copies or 0 copies → trisomy or monosomy" },
          { left: "Translocation", right: "Segment of one chromosome moves to non-homologous chromosome (e.g. BCR-ABL in CML — Philadelphia chromosome)" },
          { left: "Pericentric inversion", right: "Chromosomal segment including centromere inverted 180°; disrupts gene order; crossing over produces unbalanced gametes" },
          { left: "Deletion (large)", right: "Loss of chromosomal segment; severity depends on genes lost (e.g. del(5p) causes cri du chat syndrome)" },
        ],
        explanation: "The Philadelphia chromosome (t(9;22)) creates the BCR-ABL fusion oncogene, driving chronic myeloid leukaemia — a landmark in cancer genetics and targeted therapy (imatinib).",
        difficulty: "expert",
      },
      {
        id: "ge4",
        type: "matching",
        instruction: "Match each epigenetic mechanism to its molecular effect on gene expression.",
        pairs: [
          { left: "CpG island methylation", right: "Transcriptional silencing; blocks transcription factor binding; heritable through mitosis (genomic imprinting)" },
          { left: "Histone H3K9 acetylation", right: "Neutralises positive histone charge; loosens nucleosome contacts; promotes transcription (euchromatin)" },
          { left: "miRNA (22 nt)", right: "Base-pairs with 3'-UTR of target mRNA; blocks translation or triggers RISC-mediated degradation" },
          { left: "Polycomb repressive complex", right: "Methylates H3K27; compacts chromatin into repressive state; maintains cell identity during development" },
        ],
        explanation: "Epigenetic mechanisms allow one genome to produce 200+ cell types. Imprinting — where maternal or paternal allele is silenced by methylation — causes disorders like Prader-Willi and Angelman syndromes.",
        difficulty: "expert",
      },
      {
        id: "ge5",
        type: "matching",
        instruction: "Match each population genetics concept to its evolutionary significance.",
        pairs: [
          { left: "Bottleneck effect", right: "Sudden population reduction dramatically reduces genetic diversity; skews allele frequencies randomly" },
          { left: "Founder effect", right: "Small group colonises new area; allele frequencies reflect founders, not source population" },
          { left: "Heterozygote advantage (overdominance)", right: "Heterozygotes have higher fitness than either homozygote (sickle-cell Hb: malaria resistance in HbAHbS)" },
          { left: "Polygenic inheritance", right: "Multiple loci each contribute small additive effects; produces continuous distribution (e.g. human height)" },
        ],
        explanation: "Heterozygote advantage explains why deleterious alleles can persist at high frequency. The sickle-cell allele reaches ~20% in some malaria-endemic African populations — far above mutation-selection equilibrium.",
        difficulty: "expert",
      },
    ],
  },
  {
    id: "redox-chemistry",
    title: "Oxidation-Reduction (Redox) Reactions",
    content:
      "Oxidation-reduction (redox) reactions involve the transfer of electrons between chemical species. Oxidation is the loss of electrons (increase in oxidation state); reduction is the gain of electrons (decrease in oxidation state) — remembered as OIL RIG. The tendency of a species to gain electrons is measured by its standard reduction potential (E°) versus the standard hydrogen electrode (SHE, defined as 0.00 V). In galvanic (voltaic) cells, oxidation occurs at the anode and reduction at the cathode; a salt bridge maintains electrical neutrality. Cell potential ΔE°cell = E°cathode – E°anode; a positive ΔE°cell indicates a spontaneous reaction (ΔG° = –nFΔE°cell). Biological redox is central to metabolism: NAD⁺/NADH, FAD/FADH₂, and the cytochrome chain transfer electrons in stepwise fashion, conserving energy as the proton-motive force. Corrosion, electroplating, and cathodic protection are practical redox applications.",
    questions: [
      {
        id: "rx1",
        type: "matching",
        instruction: "Match each redox concept to its precise electrochemical definition.",
        pairs: [
          { left: "Oxidation", right: "Loss of electrons; increase in oxidation state; occurs at the anode of an electrochemical cell" },
          { left: "Standard reduction potential (E°)", right: "Tendency to gain electrons relative to SHE (0 V) at 25°C, 1 atm, 1 M; more positive = stronger oxidiser" },
          { left: "Spontaneous redox reaction", right: "Positive ΔE°cell; negative ΔG° (ΔG° = –nFΔE°cell); exergonic process in galvanic cell" },
          { left: "Disproportionation", right: "Same species simultaneously oxidised and reduced (e.g. 2H₂O₂ → 2H₂O + O₂)" },
        ],
        explanation: "The sign of ΔE°cell immediately tells you spontaneity. Species with high positive E° (fluorine, oxygen) are powerful oxidisers; those with very negative E° (Li, Na) are powerful reducers.",
        difficulty: "expert",
      },
      {
        id: "rx2",
        type: "matching",
        instruction: "Match each electrochemical cell component to its specific function.",
        pairs: [
          { left: "Anode", right: "Site of oxidation; electrons flow from anode through external circuit toward cathode" },
          { left: "Cathode", right: "Site of reduction; species gains electrons arriving from the external circuit" },
          { left: "Salt bridge", right: "Allows ion flow (not electron flow) between half-cells; maintains electrical neutrality" },
          { left: "Standard hydrogen electrode (SHE)", right: "H₂(g) | H⁺(aq) at pH 0; defined as exactly 0.00 V; universal reference electrode" },
        ],
        explanation: "A common mnemonic: 'An Ox, Red Cat' (anode = oxidation, cathode = reduction). In electrolytic cells (non-spontaneous), the cathode is the negative terminal — opposite to galvanic cells.",
        difficulty: "expert",
      },
      {
        id: "rx3",
        type: "matching",
        instruction: "Match each biological redox carrier to its specific metabolic function.",
        pairs: [
          { left: "NAD⁺/NADH", right: "Two-electron carrier in glycolysis and Krebs cycle; transfers hydride (H⁻) to Complex I of ETC" },
          { left: "FAD/FADH₂", right: "Covalently bound to succinate dehydrogenase; accepts electrons in Krebs cycle; donates to Complex II" },
          { left: "Ubiquinone (CoQ10)", right: "Lipid-soluble mobile carrier in inner mitochondrial membrane; collects e⁻ from Complex I and II → Complex III" },
          { left: "Thioredoxin", right: "Small redox protein; reduces disulfide bonds in other proteins; part of antioxidant defence system" },
        ],
        explanation: "NADH and FADH₂ differ in entry point: NADH at Complex I yields 2.5 ATP; FADH₂ at Complex II yields 1.5 ATP — fewer protons pumped, less ATP per molecule.",
        difficulty: "expert",
      },
      {
        id: "rx4",
        type: "matching",
        instruction: "Match each redox reaction to the oxidation state change it involves.",
        pairs: [
          { left: "Fe²⁺ → Fe³⁺ (iron oxidation in rust)", right: "Iron loses one electron; oxidation state increases from +2 to +3" },
          { left: "Cu²⁺ + 2e⁻ → Cu⁰ (copper plating)", right: "Copper gains two electrons; oxidation state decreases from +2 to 0 (reduction at cathode)" },
          { left: "CH₄ combustion → CO₂ + H₂O", right: "Carbon oxidised from –4 in methane to +4 in CO₂; complete oxidation releases maximum energy" },
          { left: "Photosynthesis: H₂O → O₂", right: "Oxygen oxidised from –2 in water to 0 in O₂; water is the electron donor for photosystems" },
        ],
        explanation: "Photosynthesis is a reverse-combustion in terms of redox: carbon is reduced (gaining electrons/hydrogen) and oxygen is oxidised. The O₂ we breathe comes from water-splitting.",
        difficulty: "expert",
      },
      {
        id: "rx5",
        type: "matching",
        instruction: "Match each corrosion control method to its electrochemical principle.",
        pairs: [
          { left: "Galvanic corrosion", right: "Less noble metal oxidises preferentially when in direct electrical contact with nobler metal in electrolyte" },
          { left: "Cathodic protection", right: "Sacrificial anode (Mg or Zn) oxidises instead of the protected structure; structure acts as cathode" },
          { left: "Passivation", right: "Metal forms dense adherent oxide layer (Al₂O₃, Cr₂O₃) that prevents O₂ and H₂O access to surface" },
          { left: "Electroplating", right: "Electrolytic cell deposits noble metal (Au, Ag, Cr) onto surface, providing barrier to oxidation" },
        ],
        explanation: "Zinc galvanising of steel uses both cathodic protection (Zn oxidises preferentially) and passivation (ZnO layer). Ship hulls use sacrificial Mg/Zn anodes replaced periodically.",
        difficulty: "expert",
      },
    ],
  },
];

export const SNAKES_LEVEL3: Record<number, number> = {
  8: 1,
  15: 3,
  22: 5,
  31: 9,
  37: 14,
  44: 18,
  50: 21,
  57: 28,
  62: 34,
  68: 42,
  74: 33,
  81: 47,
  86: 52,
  91: 58,
  96: 67,
  98: 62,
  99: 41,
};

export const LADDERS_LEVEL3: Record<number, { to: number; reward: { type: string; value: number; description: string } }> = {
  6: { to: 19, reward: { type: "points", value: 5, description: "+5 points — a small mercy!" } },
  26: { to: 38, reward: { type: "snake", value: -5, description: "Trap ladder! Fall back 5!" } },
  53: { to: 65, reward: { type: "bonus_roll", value: 1, description: "1 bonus roll earned!" } },
  72: { to: 85, reward: { type: "snake", value: -8, description: "Trapdoor! Drop 8 squares!" } },
  83: { to: 97, reward: { type: "points", value: 15, description: "+15 points! Almost there!" } },
};

export const SNAKES_LEVEL1: Record<number, number> = {
  16: 6,
  47: 26,
  49: 11,
  56: 53,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  99: 78,
};

export const LADDERS_LEVEL1: Record<number, number> = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91,
};

export const SNAKES_LEVEL2: Record<number, number> = {
  17: 7,
  24: 5,
  34: 16,
  46: 25,
  48: 10,
  55: 52,
  61: 18,
  64: 60,
  87: 24,
  92: 72,
  95: 75,
  99: 78,
  76: 43,
  82: 44,
};

export const LADDERS_LEVEL2: Record<number, { to: number; reward: { type: string; value: number; description: string } }> = {
  4: { to: 14, reward: { type: "points", value: 10, description: "+10 bonus points!" } },
  9: { to: 31, reward: { type: "bonus_roll", value: 1, description: "Bonus roll!" } },
  20: { to: 38, reward: { type: "points", value: 15, description: "+15 bonus points!" } },
  28: { to: 84, reward: { type: "bonus_roll", value: 1, description: "Extra roll!" } },
  36: { to: 57, reward: { type: "points", value: 20, description: "+20 bonus points!" } },
  40: { to: 59, reward: { type: "snake", value: -2, description: "Surprise snake! -2 squares!" } },
  51: { to: 67, reward: { type: "points", value: 25, description: "+25 bonus points!" } },
  63: { to: 81, reward: { type: "bonus_roll", value: 2, description: "2 bonus rolls!" } },
  71: { to: 91, reward: { type: "snake", value: -3, description: "Hidden trap! -3 squares!" } },
  77: { to: 98, reward: { type: "points", value: 30, description: "+30 bonus points!" } },
};
