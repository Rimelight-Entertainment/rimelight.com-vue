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

const size = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl"
] as const

export default {
  "slots": {
    "content": "min-w-32 bg-default shadow-lg rounded-md ring ring-default overflow-hidden data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-context-menu-content-transform-origin) flex flex-col",
    "viewport": "relative divide-y divide-default scroll-py-1 overflow-y-auto flex-1",
    "group": "p-1 isolate",
    "label": "w-full flex items-center font-semibold text-highlighted",
    "separator": "-mx-1 my-1 h-px bg-border",
    "item": "group relative w-full flex items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75",
    "itemLeadingIcon": "shrink-0",
    "itemLeadingAvatar": "shrink-0",
    "itemLeadingAvatarSize": "",
    "itemTrailing": "ms-auto inline-flex gap-1.5 items-center",
    "itemTrailingIcon": "shrink-0",
    "itemTrailingKbds": "hidden lg:inline-flex items-center shrink-0",
    "itemTrailingKbdsSize": "",
    "itemWrapper": "flex-1 flex flex-col text-start min-w-0",
    "itemLabel": "truncate",
    "itemDescription": "truncate text-muted",
    "itemLabelExternalIcon": "inline-block size-3 align-top text-dimmed"
  },
  "variants": {
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
    "active": {
      "true": {
        "item": "text-highlighted before:bg-elevated",
        "itemLeadingIcon": "text-default"
      },
      "false": {
        "item": [
          "text-default data-highlighted:text-highlighted data-[state=open]:text-highlighted data-highlighted:before:bg-elevated/50 data-[state=open]:before:bg-elevated/50",
          "transition-colors before:transition-colors"
        ],
        "itemLeadingIcon": [
          "text-dimmed group-data-highlighted:text-default group-data-[state=open]:text-default",
          "transition-colors"
        ]
      }
    },
    "loading": {
      "true": {
        "itemLeadingIcon": "animate-spin"
      }
    },
    "size": {
      "xs": {
        "label": "p-1 text-xs gap-1",
        "item": "p-1 text-xs gap-1",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemTrailingIcon": "size-4",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "sm"
      },
      "sm": {
        "label": "p-1.5 text-xs gap-1.5",
        "item": "p-1.5 text-xs gap-1.5",
        "itemLeadingIcon": "size-4",
        "itemLeadingAvatarSize": "3xs",
        "itemTrailingIcon": "size-4",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "sm"
      },
      "md": {
        "label": "p-1.5 text-sm gap-1.5",
        "item": "p-1.5 text-sm gap-1.5",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemTrailingIcon": "size-5",
        "itemTrailingKbds": "gap-0.5",
        "itemTrailingKbdsSize": "md"
      },
      "lg": {
        "label": "p-2 text-sm gap-2",
        "item": "p-2 text-sm gap-2",
        "itemLeadingIcon": "size-5",
        "itemLeadingAvatarSize": "2xs",
        "itemTrailingIcon": "size-5",
        "itemTrailingKbds": "gap-1",
        "itemTrailingKbdsSize": "md"
      },
      "xl": {
        "label": "p-2 text-base gap-2",
        "item": "p-2 text-base gap-2",
        "itemLeadingIcon": "size-6",
        "itemLeadingAvatarSize": "xs",
        "itemTrailingIcon": "size-6",
        "itemTrailingKbds": "gap-1",
        "itemTrailingKbdsSize": "lg"
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-primary data-highlighted:text-primary data-highlighted:before:bg-primary/10 data-[state=open]:before:bg-primary/10",
        "itemLeadingIcon": "text-primary/75 group-data-highlighted:text-primary group-data-[state=open]:text-primary"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-neutral data-highlighted:text-neutral data-highlighted:before:bg-neutral/10 data-[state=open]:before:bg-neutral/10",
        "itemLeadingIcon": "text-neutral/75 group-data-highlighted:text-neutral group-data-[state=open]:text-neutral"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-secondary data-highlighted:text-secondary data-highlighted:before:bg-secondary/10 data-[state=open]:before:bg-secondary/10",
        "itemLeadingIcon": "text-secondary/75 group-data-highlighted:text-secondary group-data-[state=open]:text-secondary"
      }
    },
    {
      "color": "info" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-info data-highlighted:text-info data-highlighted:before:bg-info/10 data-[state=open]:before:bg-info/10",
        "itemLeadingIcon": "text-info/75 group-data-highlighted:text-info group-data-[state=open]:text-info"
      }
    },
    {
      "color": "success" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-success data-highlighted:text-success data-highlighted:before:bg-success/10 data-[state=open]:before:bg-success/10",
        "itemLeadingIcon": "text-success/75 group-data-highlighted:text-success group-data-[state=open]:text-success"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-warning data-highlighted:text-warning data-highlighted:before:bg-warning/10 data-[state=open]:before:bg-warning/10",
        "itemLeadingIcon": "text-warning/75 group-data-highlighted:text-warning group-data-[state=open]:text-warning"
      }
    },
    {
      "color": "error" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-error data-highlighted:text-error data-highlighted:before:bg-error/10 data-[state=open]:before:bg-error/10",
        "itemLeadingIcon": "text-error/75 group-data-highlighted:text-error group-data-[state=open]:text-error"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-commentary data-highlighted:text-commentary data-highlighted:before:bg-commentary/10 data-[state=open]:before:bg-commentary/10",
        "itemLeadingIcon": "text-commentary/75 group-data-highlighted:text-commentary group-data-[state=open]:text-commentary"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-ideation data-highlighted:text-ideation data-highlighted:before:bg-ideation/10 data-[state=open]:before:bg-ideation/10",
        "itemLeadingIcon": "text-ideation/75 group-data-highlighted:text-ideation group-data-[state=open]:text-ideation"
      }
    },
    {
      "color": "source" as typeof color[number],
      "active": false,
      "class": {
        "item": "text-source data-highlighted:text-source data-highlighted:before:bg-source/10 data-[state=open]:before:bg-source/10",
        "itemLeadingIcon": "text-source/75 group-data-highlighted:text-source group-data-[state=open]:text-source"
      }
    },
    {
      "color": "primary" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-primary before:bg-primary/10",
        "itemLeadingIcon": "text-primary"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-neutral before:bg-neutral/10",
        "itemLeadingIcon": "text-neutral"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-secondary before:bg-secondary/10",
        "itemLeadingIcon": "text-secondary"
      }
    },
    {
      "color": "info" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-info before:bg-info/10",
        "itemLeadingIcon": "text-info"
      }
    },
    {
      "color": "success" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-success before:bg-success/10",
        "itemLeadingIcon": "text-success"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-warning before:bg-warning/10",
        "itemLeadingIcon": "text-warning"
      }
    },
    {
      "color": "error" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-error before:bg-error/10",
        "itemLeadingIcon": "text-error"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-commentary before:bg-commentary/10",
        "itemLeadingIcon": "text-commentary"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-ideation before:bg-ideation/10",
        "itemLeadingIcon": "text-ideation"
      }
    },
    {
      "color": "source" as typeof color[number],
      "active": true,
      "class": {
        "item": "text-source before:bg-source/10",
        "itemLeadingIcon": "text-source"
      }
    }
  ],
  "defaultVariants": {
    "size": "md" as typeof size[number]
  }
}