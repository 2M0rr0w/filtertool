import rule from "../../../rule"
import type { Color, ItemClass, Mixin, NumberRange, Operator, Rarity, Rule, Shape } from "../../../types"
import { filterStyles, soundFile, styleMixin } from "../styles"

// Shared item-class constants
export const ARMOUR_CLASSES = ["Body Armours", "Gloves", "Boots", "Helmets"] as const satisfies readonly ItemClass[]
export const SOCKETABLE_CLASSES = [...ARMOUR_CLASSES, "Shields"] as const satisfies readonly ItemClass[]

const SLOT_SOUND_SUFFIX: Record<(typeof ARMOUR_CLASSES)[number] | "Shields", string> = {
  "Body Armours": "body",
  "Gloves": "gloves",
  "Boots": "boots",
  "Helmets": "helm",
  "Shields": "shield",
}

// Shared config types
export type DefenceBaseType = "armour" | "evasion" | "es" | "armour-evasion" | "armour-es" | "es-evasion"

export type BuildProfile = {
  preferredArmourTypes: readonly DefenceBaseType[]
  earlyShields?: EarlyShieldsConfig
}

export type BuildSpecificOptions = {
  links: LinksConfig
  socketBases?: SocketBasesConfig & BuildProfile
  rareItems?: RareItemsConfig & BuildProfile
  tinctures?: TincturesConfig
  highlightedEquipment?: HighlightedEquipmentConfig
  earlyActs?: EarlyActsConfig
  earlySocketFallbacks?: EarlySocketFallbacksConfig
}

export type SocketPatternConfig = {
  pattern: string
  maxAreaLevel?: number
  itemClasses?: readonly ((typeof ARMOUR_CLASSES)[number] | "Shields")[]
}

export type GenericFourLinkConfig = {
  defenceType: DefenceBaseType
  maxAreaLevel?: number
}

export type LinksConfig = {
  twoLinkPatterns?: readonly (string | SocketPatternConfig)[]
  twoLinkMaxAreaLevel?: number
  threeLinkPatterns?: readonly (string | SocketPatternConfig)[]
  threeLinkMaxAreaLevel?: number
  fourLinkPatterns?: readonly (string | SocketPatternConfig)[]
  genericFourLinks?: readonly (DefenceBaseType | GenericFourLinkConfig)[]
  earlyShields?: EarlyShieldsConfig
}

export type SocketBasesConfig = {
  maxAreaLevel?: number
  goodShieldBaseTypes?: readonly string[]
  goodThreeSocketGroups?: readonly string[]
  goodThreeSocketMaxAreaLevel?: number
  earlyShields?: EarlyShieldsConfig
}

export type RareItemsConfig = {
  weaponItemClasses?: readonly ItemClass[]
  maxAreaLevel?: number
  earlyBootClass?: ItemClass
  earlyBootMaxAreaLevel?: number
  earlyShields?: EarlyShieldsConfig
}

export type ChromaticItemsConfig = {
  areaLevelCap?: number
}

export type WeaponHighlightConfig = {
  baseTypes?: readonly string[]
  itemClasses?: readonly ItemClass[]
  maxAreaLevel?: number
}

export type HighlightedBaseTypeConfig = {
  baseTypes?: readonly string[]
  itemClasses?: readonly ItemClass[]
  rarityOperator?: Operator
  rarity?: Rarity
  maxAreaLevel?: number
  soundId?: NumberRange<1, 17>
  soundFileName?: string
}

export type EarlyActsConfig = {
  weaponHighlights?: readonly WeaponHighlightConfig[]
  earlyShields?: EarlyShieldsConfig
  earlyMaxAreaLevel?: number
  showRustic?: boolean
  includeMomentumColors?: boolean
  momentumSocketGroups?: readonly string[]
  momentumMaxAreaLevel?: number
}

export type HighlightedEquipmentConfig = {
  highlights?: readonly HighlightedBaseTypeConfig[]
}

export type EarlySocketFallbacksConfig = {
  weaponItemClasses?: readonly ItemClass[]
  weaponBaseTypes?: readonly string[]
}

export type EarlyShieldsConfig =
  | boolean
  | {
      enabled?: boolean
      maxAreaLevel?: number
    }

export type TincturesConfig = {
  baseTypes?: readonly string[]
}

// Section composition helpers
export const compileRules = (...rules: Array<Rule | null | undefined | false>) => {
  const activeRules = rules.filter(Boolean) as Rule[]
  if (activeRules.length === 0) return ""
  return rule(...activeRules).compile()
}

export const joinSections = (...sections: string[]) =>
  sections
    .map((section) => section.trim())
    .filter(Boolean)
    .join("\n\n")

export const optionalSection = <T>(config: T | undefined, build: (config: T) => string) => (config ? build(config) : "")

export const comment = (text: string, level: 1 | 2 | 3 = 1) => `${"#".repeat(level)} ${text}`

export const withHeading = (heading: string, ...sections: string[]) => joinSections(comment(heading, 3), ...sections)

export const withSubheading = (heading: string, ...sections: string[]) => joinSections(comment(heading, 1), ...sections)

// Shared lookup data
export const defenceMixinMap: Record<DefenceBaseType, Mixin> = {
  "armour": (target) => target.baseArmour(">=", 1).baseES("==", 0).baseEvasion("==", 0),
  "evasion": (target) => target.baseArmour("==", 0).baseES("==", 0).baseEvasion(">=", 1),
  "es": (target) => target.baseArmour("==", 0).baseES(">=", 1).baseEvasion("==", 0),
  "armour-evasion": (target) => target.baseArmour(">=", 1).baseES("==", 0).baseEvasion(">=", 1),
  "armour-es": (target) => target.baseArmour(">=", 1).baseES(">=", 1).baseEvasion("==", 0),
  "es-evasion": (target) => target.baseArmour("==", 0).baseES(">=", 1).baseEvasion(">=", 1),
}

export const threeLinkSoundMap: Partial<Record<string, string>> = {
  RRG: "2red1g",
  RRB: "2red1b",
  RBB: "2b1red",
  RGB: "chrome",
  GGG: "3green",
  GGB: "2g1blue",
  GBB: "2b1g",
  BBB: "3b",
}

export const shieldThreeLinkSoundMap: Partial<Record<string, string>> = {
  RGG: "2g1red",
}

export const fourLinkSoundMap: Partial<Record<string, string>> = {
  RRRG: "3red1g",
  RRRB: "4_link",
  RRGG: "2red2g",
  RRGB: "4_link",
  RRBB: "4_link",
  RGGG: "3g1red",
  RGGB: "ggrb",
  RGBB: "4_link",
  RBBB: "4_link",
  GGGG: "4green",
  GGGB: "3g1b",
  GGBB: "4_link",
  GBBB: "4_link",
}

export const genericFourLinkSoundMap: Record<DefenceBaseType, string> = {
  "armour": "4_link_armour",
  "armour-evasion": "4_link_armour_evasion",
  "armour-es": "4_link_armour_e_s",
  "evasion": "4_link_evasion",
  "es": "4_link_evasion_e_s",
  "es-evasion": "4_link_evasion_e_s",
}

// Config normalizers
export const normalizeSocketPatternConfig = (entry: string | SocketPatternConfig): SocketPatternConfig =>
  typeof entry === "string" ? { pattern: entry } : entry

export const normalizeGenericFourLinkConfig = (entry: DefenceBaseType | GenericFourLinkConfig): GenericFourLinkConfig =>
  typeof entry === "string" ? { defenceType: entry } : entry

export const normalizeEarlyShieldsConfig = (earlyShields?: EarlyShieldsConfig) => {
  if (!earlyShields) {
    return { enabled: false, maxAreaLevel: 13 }
  }

  if (typeof earlyShields === "boolean") {
    return { enabled: earlyShields, maxAreaLevel: 13 }
  }

  return {
    enabled: earlyShields.enabled ?? true,
    maxAreaLevel: earlyShields.maxAreaLevel ?? 13,
  }
}

// Generic rule builders
export const applyHighlightTargets = (
  target: Rule,
  { baseTypes, itemClasses }: { baseTypes?: readonly string[]; itemClasses?: readonly ItemClass[] },
) => {
  if (baseTypes && baseTypes.length > 0) {
    target.baseType(...baseTypes)
  }

  if (itemClasses && itemClasses.length > 0) {
    target.itemClass(...itemClasses)
  }

  return target
}

export const buildItemClassSocketRules = ({
  linkedSockets,
  pattern,
  itemClasses = ARMOUR_CLASSES,
  soundPrefix,
  iconColor,
  maxAreaLevel,
  style = styleMixin(filterStyles.fourLink),
}: {
  linkedSockets?: 2 | 3 | 4
  pattern: string
  itemClasses?: readonly ((typeof ARMOUR_CLASSES)[number] | "Shields")[]
  soundPrefix?: string
  iconColor: Color
  maxAreaLevel?: number
  style?: Mixin
}) =>
  itemClasses.map((itemClass) => {
    const builtRule = rule().itemClass(itemClass).socketGroup("==", pattern).icon(iconColor, "Diamond").mixin(style)

    if (maxAreaLevel !== undefined) {
      builtRule.areaLevel("<=", maxAreaLevel)
    }

    if (linkedSockets !== undefined) {
      builtRule.linkedSockets("==", linkedSockets)
    }

    if (!soundPrefix) {
      return builtRule
    }

    return builtRule.customSound(soundFile(`${soundPrefix}_${SLOT_SOUND_SUFFIX[itemClass]}.mp3`))
  })

export const buildGenericFourLinkRules = ({ defenceType, maxAreaLevel = 53 }: GenericFourLinkConfig) =>
  ARMOUR_CLASSES.map((itemClass) =>
    rule()
      .itemClass(itemClass)
      .linkedSockets("==", 4)
      .areaLevel("<=", maxAreaLevel)
      .mixin(defenceMixinMap[defenceType])
      .icon("Cyan", "Diamond")
      .mixin(styleMixin(filterStyles.fourLink))
      .customSound(soundFile(`${genericFourLinkSoundMap[defenceType]}_${SLOT_SOUND_SUFFIX[itemClass]}.mp3`)),
  )

export const buildHighlightedBaseTypeRule = ({
  baseTypes,
  itemClasses,
  rarityOperator,
  rarity,
  maxAreaLevel,
  soundId,
  soundFileName,
}: HighlightedBaseTypeConfig) => {
  const builtRule = applyHighlightTargets(rule().icon("Cyan", "UpsideDownHouse").mixin(styleMixin(filterStyles.highlightedEquipment)), {
    baseTypes,
    itemClasses,
  })

  if (rarityOperator && rarity) {
    builtRule.rarity(rarityOperator, rarity)
  }

  if (maxAreaLevel !== undefined) {
    builtRule.areaLevel("<=", maxAreaLevel)
  }

  if (soundFileName) {
    builtRule.customSound(soundFile(soundFileName))
  } else if (soundId !== undefined) {
    builtRule.sound(soundId)
  }

  return builtRule
}

// Section-specific data builders
export const buildTierCurrency = (
  style: keyof typeof filterStyles,
  entries: Array<{ baseTypes: string[]; iconColor: Color; iconShape: Shape; soundId?: NumberRange<1, 17>; soundFileName?: string }>,
) =>
  compileRules(
    rule(
      ...entries.map(({ baseTypes, iconColor, iconShape, soundId, soundFileName }) => {
        const builtRule = rule()
          .baseType(...baseTypes)
          .icon(iconColor, iconShape)

        if (soundFileName) {
          builtRule.customSound(soundFile(soundFileName))
        } else if (soundId !== undefined) {
          builtRule.sound(soundId)
        }

        return builtRule
      }),
    ).mixin(styleMixin(filterStyles[style])),
  )

// Flask builders
export const buildFlaskRule = ({
  baseTypes,
  itemClass,
  maxAreaLevel,
  iconColor,
  sound,
  style,
}: {
  baseTypes: readonly string[]
  itemClass: "Life Flasks" | "Mana Flasks"
  maxAreaLevel?: number
  iconColor: Color
  sound: string
  style: Mixin
}) => {
  const builtRule = rule()
    .itemClass(itemClass)
    .baseType(...baseTypes)
    .rarity("<=", "Magic")
    .icon(iconColor, "Raindrop")
    .mixin(style)

  if (maxAreaLevel !== undefined) {
    builtRule.areaLevel("<=", maxAreaLevel)
  }

  return builtRule.customSound(soundFile(sound))
}

export const buildFlaskSeries = ({
  itemClass,
  iconColor,
  style,
  entries,
}: {
  itemClass: "Life Flasks" | "Mana Flasks"
  iconColor: Color
  style: "lifeFlask" | "manaFlask"
  entries: Array<{ baseTypes: string[]; maxAreaLevel?: number; soundFileName: string }>
}) =>
  entries.map(({ baseTypes, maxAreaLevel, soundFileName }) =>
    buildFlaskRule({
      itemClass,
      baseTypes,
      maxAreaLevel,
      iconColor,
      sound: soundFileName,
      style: styleMixin(filterStyles[style]),
    }),
  )

export const buildUtilityFlaskRules = (entries: Array<{ baseType: string; soundFileName: string }>) =>
  entries.map(({ baseType, soundFileName }) =>
    rule()
      .itemClass("Utility Flasks")
      .baseType(baseType)
      .icon("Green", "Raindrop")
      .mixin(styleMixin(filterStyles.utilityFlask))
      .customSound(soundFile(soundFileName)),
  )
