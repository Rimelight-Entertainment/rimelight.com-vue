export const BLOCK_EDITOR_COMPONENT_MAP = {
  'CalloutBlock': () => import('rimelight-components/components/blocks/editor/CalloutBlockEditor.vue'),
  'CardBlock': () => import('rimelight-components/components/blocks/editor/CardBlockEditor.vue'),
  'ImageBlock': () => import('rimelight-components/components/blocks/editor/ImageBlockEditor.vue'),
  'ParagraphBlock': () => import('rimelight-components/components/blocks/editor/ParagraphBlockEditor.vue'),
  'SectionBlock': () => import('rimelight-components/components/blocks/editor/SectionBlockEditor.vue'),
}
