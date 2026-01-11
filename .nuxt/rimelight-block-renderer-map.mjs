export const BLOCK_RENDERER_COMPONENT_MAP = {
  'CalloutBlock': () => import('rimelight-components/components/blocks/renderer/CalloutBlockRenderer.vue'),
  'CardBlock': () => import('rimelight-components/components/blocks/renderer/CardBlockRenderer.vue'),
  'ImageBlock': () => import('rimelight-components/components/blocks/renderer/ImageBlockRenderer.vue'),
  'ParagraphBlock': () => import('rimelight-components/components/blocks/renderer/ParagraphBlockRenderer.vue'),
  'SectionBlock': () => import('rimelight-components/components/blocks/renderer/SectionBlockRenderer.vue'),
}
