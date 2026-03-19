import rule from "../../rule"
import {
  chromaticItems,
  currency,
  divinationCards,
  earlyActs,
  earlySocketFallbacks,
  flasks,
  gems,
  highlightedEquipment,
  jewellery,
  joinSections,
  links,
  misc,
  optionalSection,
  questItems,
  rareItems,
  scrolls,
  sixSockets,
  socketBases,
  tinctures,
  twilightStrand,
  uniques,
  type BuildProfile,
  type BuildSpecificOptions,
} from "../shared"

const buildProfile = {
  preferredArmourTypes: ["armour", "evasion"] as const,
  earlyShields: {
    enabled: true,
    maxAreaLevel: 13,
  },
} as const satisfies BuildProfile

const buildSpecificOptions = {
  links: {
    earlyShields: buildProfile.earlyShields,
    twoLinkPatterns: [
      // Early 2-links you want to see.
      "RG",
      "GG",
    ],
    threeLinkPatterns: [
      // Main 3-links for your build.
      "RRG",
      "RGG",
      "RGB",
    ],
    fourLinkPatterns: [
      // Main 4-links for your build.
      "RRRG",
      "RRGG",
      "RGGG",
    ],
    genericFourLinks: [
      // Defence-type-based generic 4-links.
      "armour",
      "armour-evasion",
      "evasion",
    ],
  },
  socketBases: {
    ...buildProfile,
    goodThreeSocketGroups: [
      // Good early 3-socket base colors on armour slots.
      "RG",
      "GG",
    ],
  },
  rareItems: {
    ...buildProfile,
    weaponItemClasses: [
      // Optional rare weapon classes to specially highlight.
      // "Two Hand Axes",
      // "Two Hand Maces",
    ],
  },
  tinctures: {
    baseTypes: [
      // Optional tinctures for your build.
      "Prismatic Tincture",
    ],
  },
  highlightedEquipment: {
    highlights: [
      // Specific base types you always want highlighted.
      { baseTypes: ["Rusted Hatchet", "Boarding Axe"] },
      // You can also highlight an entire item class.
      { itemClasses: ["One Hand Axes"] },
      // Optional rarity-specific highlight.
      {
        baseTypes: ["Stone Axe", "Jade Chopper"],
        rarityOperator: "==",
        rarity: "Rare",
      },
    ],
  },
  earlyActs: {
    earlyShields: buildProfile.earlyShields,
    weaponHighlights: [
      // Strong early weapon bases
      { baseTypes: ["Stone Axe", "Driftwood Maul", "Corroded Blade"] },
      // You can also highlight a whole weapon class.
      { itemClasses: ["Two Hand Maces"] },
    ],
    showRustic: true,
    includeMomentumColors: true,
  },
  earlySocketFallbacks: {
    weaponItemClasses: [
      // Weapon classes to include in very early fallback socket rules.
      "Two Hand Axes",
      "Two Hand Maces",
    ],
  },
} as const satisfies BuildSpecificOptions

// Copy this file into a new filter folder and mainly adjust:
// - buildProfile.preferredArmourTypes
// - buildProfile.earlyShields
// - links patterns
// - rareItems weaponItemClasses
// - highlightedEquipment base types
// - earlyActs early bases
// - earlySocketFallbacks weapon classes
export const getFilter = () =>
  joinSections(
    twilightStrand(),
    currency(),
    scrolls(),
    uniques(),
    gems(),
    links(buildSpecificOptions.links),
    sixSockets(),
    optionalSection(buildSpecificOptions.highlightedEquipment, highlightedEquipment),
    optionalSection(buildSpecificOptions.socketBases, socketBases),
    optionalSection(buildSpecificOptions.rareItems, rareItems),
    jewellery(),
    chromaticItems(),
    flasks(),
    optionalSection(buildSpecificOptions.tinctures, tinctures),
    optionalSection(buildSpecificOptions.earlyActs, earlyActs),
    optionalSection(buildSpecificOptions.earlySocketFallbacks, earlySocketFallbacks),
    questItems(),
    divinationCards(),
    misc(),
    rule().hide().compile(),
  )
