export const DOCUMENT_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.document",
  properties: {
    meta: {
      label: { en: "Document Metadata" },
      defaultOpen: true,
      fields: {
        category: {
          value: "News",
          label: { en: "Category" },
          type: "enum",
          options: ["News", "Guide", "Update", "Community"],
        },
        readingTime: { value: 5, label: { en: "Est. Reading Time" }, type: "number" },
      },
    },
  },
});

export const BLOG_POST_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.blogPost",
  properties: {
    meta: {
      label: { en: "Post Metadata" },
      defaultOpen: true,
      fields: {
        category: {
          value: "News",
          label: { en: "Category" },
          type: "enum",
          options: ["News", "Guide", "Update", "Community"],
        },
        readingTime: { value: 5, label: { en: "Est. Reading Time" }, type: "number" },
      },
    },
  },
});

export const PROJECT_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.project",
  properties: {
    version: {
      label: { en: "Version Info" },
      defaultOpen: true,
      fields: {
        versionNumber: { value: "1.0.0", label: { en: "Version Number" }, type: "text" },
        releaseDate: { value: "", label: { en: "Release Date" }, type: "text" },
      },
    },
  },
});

export const PATCH_NOTE_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.patchNote",
  properties: {
    version: {
      label: { en: "Version Info" },
      defaultOpen: true,
      fields: {
        versionNumber: { value: "1.0.0", label: { en: "Version Number" }, type: "text" },
        releaseDate: {
          value: { en: "" },
          label: { en: "Release Date" },
          type: "text",
        },
      },
    },
  },
});

export const LOCATION_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.location",
  properties: {
    geography: {
      label: { en: "Geography" },
      defaultOpen: true,
      fields: {
        region: { value: { en: "" }, label: { en: "Region" }, type: "text" },
        climate: { value: "Temperate", label: { en: "Climate" }, type: "text" },
      },
    },
  },
});

export const SPECIES_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.species",
  properties: {
    biology: {
      label: { en: "Biology" },
      defaultOpen: true,
      fields: {
        lifespan: {
          value: { en: "" },
          label: { en: "Average Lifespan" },
          type: "text",
        },
        homeworld: {
          value: "",
          label: { en: "Homeworld" },
          type: "page",
          allowedPageTypes: ["Location"],
        },
      },
    },
  },
});

export const CHARACTER_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.character",
  properties: {
    identity: {
      label: { en: "Identity" },
      defaultOpen: true,
      fields: {
        name: { value: { en: "" }, label: { en: "Name" }, type: "text" },
        title: { value: { en: "" }, label: { en: "Social Title" }, type: "text" },
        aliases: { value: [], label: { en: "Aliases" }, type: "text-array" },
      },
    },
    characteristics: {
      label: { en: "Characteristics" },
      defaultOpen: true,
      fields: {
        species: {
          value: "",
          label: { en: "Species" },
          type: "page",
          allowedPageTypes: ["Species"],
        },
        sex: {
          value: "Unknown",
          label: { en: "Sex" },
          type: "enum",
          options: ["Male", "Female", "Other", "Unknown"],
        },
        height: { value: 0, label: { en: "Height" }, type: "number" },
        weight: { value: 0, label: { en: "Weight" }, type: "number" },
      },
    },
  },
  initialBlocks: () => [
    {
      id: "appearance",
      type: "SectionBlock",
      props: { level: 2, title: "Appearance", children: [] },
      isTemplated: true,
    },
    {
      id: "abilities",
      type: "SectionBlock",
      props: { level: 2, title: "Abilities", children: [] },
      isTemplated: true,
    },
    {
      id: "history",
      type: "SectionBlock",
      props: { level: 2, title: "History", children: [] },
      isTemplated: true,
    },
  ],
});

export const SKILL_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.skill",
  properties: {
    mechanics: {
      label: { en: "Mechanics" },
      defaultOpen: true,
      fields: {
        cooldown: { value: 10, label: { en: "Cooldown (sec)" }, type: "number" },
        manaCost: { value: 50, label: { en: "Mana Cost" }, type: "number" },
        damageType: {
          value: "Physical",
          label: { en: "Damage Type" },
          type: "enum",
          options: ["Physical", "Magic", "True", "None"],
        },
      },
    },
  },
});

export const ITEM_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.item",
  properties: {
    details: {
      label: { en: "Item Details" },
      defaultOpen: true,
      fields: {
        rarity: {
          value: "Common",
          label: { en: "Rarity" },
          type: "enum",
          options: ["Common", "Uncommon", "Rare", "Epic", "Legendary"],
        },
        price: { value: 100, label: { en: "Gold Price" }, type: "number" },
        isQuestItem: {
          value: "No",
          label: { en: "Quest Item" },
          type: "enum",
          options: ["Yes", "No"],
        },
      },
    },
  },
});

export const HERO_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.hero",
  properties: {
    combat: {
      label: { en: "Combat Stats" },
      defaultOpen: true,
      fields: {
        class: {
          value: "Warrior",
          label: { en: "Class" },
          type: "enum",
          options: ["Warrior", "Mage", "Rogue", "Paladin"],
        },
        difficulty: { value: 1, label: { en: "Difficulty" }, type: "number" },
        primaryRole: {
          value: "Tank",
          label: { en: "Primary Role" },
          type: "enum",
          options: ["Tank", "DPS", "Support"],
        },
      },
    },
    progression: {
      label: { en: "Progression" },
      defaultOpen: true,
      fields: {
        baseHp: { value: 500, label: { en: "Base HP" }, type: "number" },
        baseMana: { value: 100, label: { en: "Base Mana" }, type: "number" },
      },
    },
  },
  initialBlocks: () => [
    {
      id: "playstyle",
      type: "SectionBlock",
      props: { level: 2, title: "Playstyle", children: [] },
      isTemplated: true,
    },
    {
      id: "lore",
      type: "SectionBlock",
      props: { level: 2, title: "Background Lore", children: [] },
      isTemplated: true,
    },
  ],
});

export const CARD_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.card",
  properties: {},
  initialBlocks: () => [],
});

declare global {
  interface RimelightRegisterPageTypes {
    Document: typeof DOCUMENT_DEFINITION.properties;
    BlogPost: typeof BLOG_POST_DEFINITION.properties;
    Project: typeof PROJECT_DEFINITION.properties;
    PatchNote: typeof PATCH_NOTE_DEFINITION.properties;
    Location: typeof LOCATION_DEFINITION.properties;
    Species: typeof SPECIES_DEFINITION.properties;
    Character: typeof CHARACTER_DEFINITION.properties;
    Skill: typeof SKILL_DEFINITION.properties;
    Item: typeof ITEM_DEFINITION.properties;
    Card: typeof CARD_DEFINITION.properties;
    Hero: typeof HERO_DEFINITION.properties;
  }
}

export const PAGE_MAP = {
  Document: DOCUMENT_DEFINITION,
  BlogPost: BLOG_POST_DEFINITION,
  Project: PROJECT_DEFINITION,
  PatchNote: PATCH_NOTE_DEFINITION,
  Location: LOCATION_DEFINITION,
  Species: SPECIES_DEFINITION,
  Character: CHARACTER_DEFINITION,
  Skill: SKILL_DEFINITION,
  Item: ITEM_DEFINITION,
  Card: CARD_DEFINITION,
  Hero: HERO_DEFINITION,
};
