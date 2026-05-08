import { type BlockType } from "../../app/types";

export interface BlockDefinition {
  type: BlockType;
  label: string;
  icon: string;
  category: string;
  description?: string;
}

export const CATEGORY_ORDER = ["Layout", "Text", "Media", "Special"];

export const BLOCK_DEFINITIONS: BlockDefinition[] = [
  {
    type: "SectionBlock",
    label: "blocks.SectionBlock.label",
    icon: "lucide:heading",
    category: "Layout",
    description: "blocks.SectionBlock.description",
  },

  {
    type: "ParagraphBlock",
    label: "blocks.ParagraphBlock.label",
    icon: "lucide:pilcrow",
    category: "Text",
    description: "blocks.ParagraphBlock.description",
  },
  {
    type: "ImageBlock",
    label: "blocks.ImageBlock.label",
    icon: "lucide:image",
    category: "Media",
    description: "blocks.ImageBlock.description",
  },
  {
    type: "CalloutBlock",
    label: "blocks.CalloutBlock.label",
    icon: "lucide:info",
    category: "Special",
    description: "blocks.CalloutBlock.description",
  },
];
