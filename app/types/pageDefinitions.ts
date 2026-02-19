import { BLOG_POST_DEFINITION as BASE_BLOG_POST_DEFINITION, DOCUMENT_DEFINITION } from "rimelight-components/types"
import { definePageDefinition } from "#rimelight-components/utils"

export { DOCUMENT_DEFINITION }

export const BLOG_POST_DEFINITION = definePageDefinition({
  ...BASE_BLOG_POST_DEFINITION,
  properties: {
    ...BASE_BLOG_POST_DEFINITION.properties,
    meta: {
      ...BASE_BLOG_POST_DEFINITION.properties["meta"]!,
      fields: {
        ...BASE_BLOG_POST_DEFINITION.properties["meta"]!.fields,
        category: {
          ...BASE_BLOG_POST_DEFINITION.properties["meta"]!.fields["category"]!,
          options: [
            { en: "Company News" },
            { en: "Development Log" },
            { en: "New Release" },
          ]
        }
      }
    }
  }
})

export const PATCH_NOTE_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.patchNote",
  properties: {
    version: {
      label: { en: "Version Info" },
      defaultOpen: true,
      fields: {
        versionNumber: { defaultValue: "1.0.0", label: { en: "Version Number" }, type: "text" },
        releaseDate: {
          defaultValue: { en: "" },
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
        region: { defaultValue: { en: "" }, label: { en: "Region" }, type: "text" },
        climate: { defaultValue: "Temperate", label: { en: "Climate" }, type: "text" },
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
          defaultValue: { en: "" },
          label: { en: "Average Lifespan" },
          type: "text",
        },
        homeworld: {
          defaultValue: "",
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
        name: { defaultValue: { en: "" }, label: { en: "Name" }, type: "text" },
        title: { defaultValue: { en: "" }, label: { en: "Title" }, type: "text" },
        aliases: { defaultValue: [], label: { en: "Aliases" }, type: "text-array" },
        pronouns: {
          defaultValue: { en: "Unknown" },
          label: { en: "Pronouns" },
          type: "enum",
          options: [
            { en: "He/Him" },
            { en: "She/Her" },
            { en: "They/Them" },
            { en: "He/They" },
            { en: "She/They" },
            { en: "Other" },
            { en: "Unknown" }
          ],
        },
        flavourText: { defaultValue: { en: "" }, label: { en: "Flavour Text" }, type: "text" },
      },
    },
    characteristics: {
      label: { en: "Characteristics" },
      defaultOpen: true,
      fields: {
        species: {
          defaultValue: "",
          label: { en: "Species" },
          type: "page",
          allowedPageTypes: ["Species"],
        },
        sex: {
          defaultValue: { en: "Unknown" },
          label: { en: "Sex" },
          type: "enum",
          options: [
            { en: "Male" },
            { en: "Female" },
            { en: "Other" },
            { en: "Unknown" }
          ],
        },
        height: { defaultValue: 0, label: { en: "Height" }, type: "number" },
        weight: { defaultValue: 0, label: { en: "Weight" }, type: "number" },
        dateOfBirth: { defaultValue: { en: "" }, label: { en: "Date of Birth" }, type: "text" },
        placeOfBirth: { defaultValue: { en: "" }, label: { en: "Place of Birth" }, type: "text" },
        dateOfDeath: { defaultValue: { en: "" }, label: { en: "Date of Death" }, type: "text" },
        placeOfDeath: { defaultValue: { en: "" }, label: { en: "Place of Death" }, type: "text" },
      },
    },
    inventory: {
      label: { en: "Inventory & Assets" },
      defaultOpen: false,
      fields: {
        equipment: {
          defaultValue: [],
          label: { en: "Equipment" },
          type: "page-array",
          allowedPageTypes: ["Object"]
        },
        pets: {
          defaultValue: [],
          label: { en: "Pets" },
          type: "page-array",
          allowedPageTypes: ["Character"]
        },
        mounts: {
          defaultValue: [],
          label: { en: "Mounts" },
          type: "page-array",
          allowedPageTypes: ["Character"]
        },
      },
    },
    affiliations: {
      label: { en: "Affiliations" },
      defaultOpen: false,
      fields: {
        currentAffiliations: {
          defaultValue: [],
          label: { en: "Current Affiliations" },
          type: "page-array",
          allowedPageTypes: ["Group"]
        },
        formerAffiliations: {
          defaultValue: [],
          label: { en: "Former Affiliations" },
          type: "page-array",
          allowedPageTypes: ["Group"]
        },
      },
    },
    other: {
      label: { en: "Other" },
      defaultOpen: false,
      fields: {
        favouriteFood: { defaultValue: { en: "" }, label: { en: "Favourite Food" }, type: "text" },
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
        cooldown: { defaultValue: 10, label: { en: "Cooldown (sec)" }, type: "number" },
        manaCost: { defaultValue: 50, label: { en: "Mana Cost" }, type: "number" },
        damageType: {
          defaultValue: { en: "Physical" },
          label: { en: "Damage Type" },
          type: "enum",
          options: [
            { en: "Physical" },
            { en: "Magic" },
            { en: "True" },
            { en: "None" }
          ],
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
          defaultValue: { en: "Common" },
          label: { en: "Rarity" },
          type: "enum",
          options: [
            { en: "Common" },
            { en: "Uncommon" },
            { en: "Rare" },
            { en: "Epic" },
            { en: "Legendary" }
          ],
        },
        price: { defaultValue: 100, label: { en: "Gold Price" }, type: "number" },
        isQuestItem: {
          defaultValue: { en: "No" },
          label: { en: "Quest Item" },
          type: "enum",
          options: [
            { en: "Yes" },
            { en: "No" }
          ],
        },
      },
    },
  },
});

export const OBJECT_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.object",
  properties: {
    details: {
      label: { en: "Object Details" },
      defaultOpen: true,
      fields: {
        category: {
          defaultValue: { en: "Miscellaneous" },
          label: { en: "Category" },
          type: "text"
        }
      }
    }
  }
});

export const GROUP_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.group",
  properties: {
    details: {
      label: { en: "Group Details" },
      defaultOpen: true,
      fields: {
        leader: {
          defaultValue: "",
          label: { en: "Leader" },
          type: "page",
          allowedPageTypes: ["Character"]
        },
        headquarters: {
          defaultValue: "",
          label: { en: "Headquarters" },
          type: "page",
          allowedPageTypes: ["Location"]
        }
      }
    }
  }
});

export const HERO_DEFINITION = definePageDefinition({
  typeLabelKey: "page.type.hero",
  properties: {
    combat: {
      label: { en: "Combat Stats" },
      defaultOpen: true,
      fields: {
        class: {
          defaultValue: { en: "Warrior" },
          label: { en: "Class" },
          type: "enum",
          options: [
            { en: "Warrior" },
            { en: "Mage" },
            { en: "Rogue" },
            { en: "Paladin" }
          ],
        },
        difficulty: { defaultValue: 1, label: { en: "Difficulty" }, type: "number" },
        primaryRole: {
          defaultValue: { en: "Tank" },
          label: { en: "Primary Role" },
          type: "enum",
          options: [
            { en: "Tank" },
            { en: "DPS" },
            { en: "Support" }
          ],
        },
      },
    },
    progression: {
      label: { en: "Progression" },
      defaultOpen: true,
      fields: {
        baseHp: { defaultValue: 500, label: { en: "Base HP" }, type: "number" },
        baseMana: { defaultValue: 100, label: { en: "Base Mana" }, type: "number" },
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
    PatchNote: typeof PATCH_NOTE_DEFINITION.properties;
    Location: typeof LOCATION_DEFINITION.properties;
    Species: typeof SPECIES_DEFINITION.properties;
    Character: typeof CHARACTER_DEFINITION.properties;
    Skill: typeof SKILL_DEFINITION.properties;
    Item: typeof ITEM_DEFINITION.properties;
    Object: typeof OBJECT_DEFINITION.properties;
    Group: typeof GROUP_DEFINITION.properties;
    Card: typeof CARD_DEFINITION.properties;
    Hero: typeof HERO_DEFINITION.properties;
  }
}

export const PAGE_MAP = {
  Document: DOCUMENT_DEFINITION,
  BlogPost: BLOG_POST_DEFINITION,
  PatchNote: PATCH_NOTE_DEFINITION,
  Location: LOCATION_DEFINITION,
  Species: SPECIES_DEFINITION,
  Character: CHARACTER_DEFINITION,
  Skill: SKILL_DEFINITION,
  Item: ITEM_DEFINITION,
  Object: OBJECT_DEFINITION,
  Group: GROUP_DEFINITION,
  Card: CARD_DEFINITION,
  Hero: HERO_DEFINITION,
};
