const color = [
  "primary",
  "neutral",
  "secondary",
  "info",
  "success",
  "warning",
  "error",
  "commentary",
  "ideation",
  "source"
] as const

const variant = [
  "solid",
  "outline",
  "soft",
  "subtle",
  "ghost",
  "link"
] as const

const size = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl"
] as const

export default {
  "slots": {
    "base": [
      "rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75",
      "transition-colors"
    ],
    "label": "truncate",
    "leadingIcon": "shrink-0",
    "leadingAvatar": "shrink-0",
    "leadingAvatarSize": "",
    "trailingIcon": "shrink-0"
  },
  "variants": {
    "fieldGroup": {
      "horizontal": "not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]",
      "vertical": "not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]"
    },
    "color": {
      "primary": "",
      "neutral": "",
      "secondary": "",
      "info": "",
      "success": "",
      "warning": "",
      "error": "",
      "commentary": "",
      "ideation": "",
      "source": ""
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": "",
      "ghost": "",
      "link": ""
    },
    "size": {
      "xs": {
        "base": "px-2 py-1 text-xs gap-1",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "sm": {
        "base": "px-2.5 py-1.5 text-xs gap-1.5",
        "leadingIcon": "size-4",
        "leadingAvatarSize": "3xs",
        "trailingIcon": "size-4"
      },
      "md": {
        "base": "px-2.5 py-1.5 text-sm gap-1.5",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "lg": {
        "base": "px-3 py-2 text-sm gap-2",
        "leadingIcon": "size-5",
        "leadingAvatarSize": "2xs",
        "trailingIcon": "size-5"
      },
      "xl": {
        "base": "px-3 py-2 text-base gap-2",
        "leadingIcon": "size-6",
        "leadingAvatarSize": "xs",
        "trailingIcon": "size-6"
      }
    },
    "block": {
      "true": {
        "base": "w-full justify-center",
        "trailingIcon": "ms-auto"
      }
    },
    "square": {
      "true": ""
    },
    "leading": {
      "true": ""
    },
    "trailing": {
      "true": ""
    },
    "loading": {
      "true": ""
    },
    "active": {
      "true": {
        "base": ""
      },
      "false": {
        "base": ""
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-neutral hover:bg-neutral/75 active:bg-neutral/75 disabled:bg-neutral aria-disabled:bg-neutral focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral"
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-secondary hover:bg-secondary/75 active:bg-secondary/75 disabled:bg-secondary aria-disabled:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
    },
    {
      "color": "info" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-info hover:bg-info/75 active:bg-info/75 disabled:bg-info aria-disabled:bg-info focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info"
    },
    {
      "color": "success" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-success hover:bg-success/75 active:bg-success/75 disabled:bg-success aria-disabled:bg-success focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success"
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-warning hover:bg-warning/75 active:bg-warning/75 disabled:bg-warning aria-disabled:bg-warning focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning"
    },
    {
      "color": "error" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-error hover:bg-error/75 active:bg-error/75 disabled:bg-error aria-disabled:bg-error focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-error"
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-commentary hover:bg-commentary/75 active:bg-commentary/75 disabled:bg-commentary aria-disabled:bg-commentary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-commentary"
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-ideation hover:bg-ideation/75 active:bg-ideation/75 disabled:bg-ideation aria-disabled:bg-ideation focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ideation"
    },
    {
      "color": "source" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-source hover:bg-source/75 active:bg-source/75 disabled:bg-source aria-disabled:bg-source focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-source"
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-primary/50 text-primary hover:bg-primary/10 active:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-neutral/50 text-neutral hover:bg-neutral/10 active:bg-neutral/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral"
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-secondary/50 text-secondary hover:bg-secondary/10 active:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    },
    {
      "color": "info" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-info/50 text-info hover:bg-info/10 active:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-info"
    },
    {
      "color": "success" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-success/50 text-success hover:bg-success/10 active:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-success"
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-warning/50 text-warning hover:bg-warning/10 active:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-warning"
    },
    {
      "color": "error" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-error/50 text-error hover:bg-error/10 active:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-commentary/50 text-commentary hover:bg-commentary/10 active:bg-commentary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-commentary"
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-ideation/50 text-ideation hover:bg-ideation/10 active:bg-ideation/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-ideation"
    },
    {
      "color": "source" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-source/50 text-source hover:bg-source/10 active:bg-source/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-source"
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-primary bg-primary/10 hover:bg-primary/15 active:bg-primary/15 focus:outline-none focus-visible:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-neutral bg-neutral/10 hover:bg-neutral/15 active:bg-neutral/15 focus:outline-none focus-visible:bg-neutral/15 disabled:bg-neutral/10 aria-disabled:bg-neutral/10"
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 focus:outline-none focus-visible:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10"
    },
    {
      "color": "info" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-info bg-info/10 hover:bg-info/15 active:bg-info/15 focus:outline-none focus-visible:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10"
    },
    {
      "color": "success" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-success bg-success/10 hover:bg-success/15 active:bg-success/15 focus:outline-none focus-visible:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10"
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 focus:outline-none focus-visible:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10"
    },
    {
      "color": "error" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-error bg-error/10 hover:bg-error/15 active:bg-error/15 focus:outline-none focus-visible:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10"
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-commentary bg-commentary/10 hover:bg-commentary/15 active:bg-commentary/15 focus:outline-none focus-visible:bg-commentary/15 disabled:bg-commentary/10 aria-disabled:bg-commentary/10"
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-ideation bg-ideation/10 hover:bg-ideation/15 active:bg-ideation/15 focus:outline-none focus-visible:bg-ideation/15 disabled:bg-ideation/10 aria-disabled:bg-ideation/10"
    },
    {
      "color": "source" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-source bg-source/10 hover:bg-source/15 active:bg-source/15 focus:outline-none focus-visible:bg-source/15 disabled:bg-source/10 aria-disabled:bg-source/10"
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-neutral ring ring-inset ring-neutral/25 bg-neutral/10 hover:bg-neutral/15 active:bg-neutral/15 disabled:bg-neutral/10 aria-disabled:bg-neutral/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral"
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
    },
    {
      "color": "info" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-info"
    },
    {
      "color": "success" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-success"
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-warning"
    },
    {
      "color": "error" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-error"
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-commentary ring ring-inset ring-commentary/25 bg-commentary/10 hover:bg-commentary/15 active:bg-commentary/15 disabled:bg-commentary/10 aria-disabled:bg-commentary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-commentary"
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-ideation ring ring-inset ring-ideation/25 bg-ideation/10 hover:bg-ideation/15 active:bg-ideation/15 disabled:bg-ideation/10 aria-disabled:bg-ideation/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-ideation"
    },
    {
      "color": "source" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "text-source ring ring-inset ring-source/25 bg-source/10 hover:bg-source/15 active:bg-source/15 disabled:bg-source/10 aria-disabled:bg-source/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-source"
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-primary hover:bg-primary/10 active:bg-primary/10 focus:outline-none focus-visible:bg-primary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-neutral hover:bg-neutral/10 active:bg-neutral/10 focus:outline-none focus-visible:bg-neutral/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-secondary hover:bg-secondary/10 active:bg-secondary/10 focus:outline-none focus-visible:bg-secondary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "info" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-info hover:bg-info/10 active:bg-info/10 focus:outline-none focus-visible:bg-info/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "success" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-success hover:bg-success/10 active:bg-success/10 focus:outline-none focus-visible:bg-success/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-warning hover:bg-warning/10 active:bg-warning/10 focus:outline-none focus-visible:bg-warning/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "error" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-error hover:bg-error/10 active:bg-error/10 focus:outline-none focus-visible:bg-error/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-commentary hover:bg-commentary/10 active:bg-commentary/10 focus:outline-none focus-visible:bg-commentary/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-ideation hover:bg-ideation/10 active:bg-ideation/10 focus:outline-none focus-visible:bg-ideation/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "source" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-source hover:bg-source/10 active:bg-source/10 focus:outline-none focus-visible:bg-source/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent"
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-neutral hover:text-neutral/75 active:text-neutral/75 disabled:text-neutral aria-disabled:text-neutral focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral"
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-secondary"
    },
    {
      "color": "info" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-info"
    },
    {
      "color": "success" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-success"
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-warning"
    },
    {
      "color": "error" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-error"
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-commentary hover:text-commentary/75 active:text-commentary/75 disabled:text-commentary aria-disabled:text-commentary focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-commentary"
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-ideation hover:text-ideation/75 active:text-ideation/75 disabled:text-ideation aria-disabled:text-ideation focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ideation"
    },
    {
      "color": "source" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-source hover:text-source/75 active:text-source/75 disabled:text-source aria-disabled:text-source focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-source"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": "text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-inverted"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": "ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": "text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 focus:outline-none focus-visible:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": "ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "ghost" as typeof variant[number],
      "class": "text-default hover:bg-elevated active:bg-elevated focus:outline-none focus-visible:bg-elevated hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent"
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "link" as typeof variant[number],
      "class": "text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted focus:outline-none focus-visible:ring-inset focus-visible:ring-2 focus-visible:ring-inverted"
    },
    {
      "size": "xs" as typeof size[number],
      "square": true,
      "class": "p-1"
    },
    {
      "size": "sm" as typeof size[number],
      "square": true,
      "class": "p-1.5"
    },
    {
      "size": "md" as typeof size[number],
      "square": true,
      "class": "p-1.5"
    },
    {
      "size": "lg" as typeof size[number],
      "square": true,
      "class": "p-2"
    },
    {
      "size": "xl" as typeof size[number],
      "square": true,
      "class": "p-2"
    },
    {
      "loading": true,
      "leading": true,
      "class": {
        "leadingIcon": "animate-spin"
      }
    },
    {
      "loading": true,
      "leading": false,
      "trailing": true,
      "class": {
        "trailingIcon": "animate-spin"
      }
    }
  ],
  "defaultVariants": {
    "color": "primary" as typeof color[number],
    "variant": "solid" as typeof variant[number],
    "size": "md" as typeof size[number]
  }
}