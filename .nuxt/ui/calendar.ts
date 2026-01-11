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
  "subtle"
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
    "root": "",
    "header": "flex items-center justify-between",
    "body": "flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0",
    "heading": "text-center font-medium truncate mx-auto",
    "grid": "w-full border-collapse select-none space-y-1 focus:outline-none",
    "gridRow": "grid grid-cols-7 place-items-center",
    "gridWeekDaysRow": "mb-1 grid w-full grid-cols-7",
    "gridBody": "grid",
    "headCell": "rounded-md",
    "cell": "relative text-center",
    "cellTrigger": [
      "m-0.5 relative flex items-center justify-center rounded-full whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-muted data-unavailable:line-through data-unavailable:text-muted data-unavailable:pointer-events-none data-today:font-semibold data-[outside-view]:text-muted",
      "transition"
    ]
  },
  "variants": {
    "color": {
      "primary": {
        "headCell": "text-primary",
        "cellTrigger": "focus-visible:ring-primary"
      },
      "neutral": {
        "headCell": "text-highlighted",
        "cellTrigger": "focus-visible:ring-inverted"
      },
      "secondary": {
        "headCell": "text-secondary",
        "cellTrigger": "focus-visible:ring-secondary"
      },
      "info": {
        "headCell": "text-info",
        "cellTrigger": "focus-visible:ring-info"
      },
      "success": {
        "headCell": "text-success",
        "cellTrigger": "focus-visible:ring-success"
      },
      "warning": {
        "headCell": "text-warning",
        "cellTrigger": "focus-visible:ring-warning"
      },
      "error": {
        "headCell": "text-error",
        "cellTrigger": "focus-visible:ring-error"
      },
      "commentary": {
        "headCell": "text-commentary",
        "cellTrigger": "focus-visible:ring-commentary"
      },
      "ideation": {
        "headCell": "text-ideation",
        "cellTrigger": "focus-visible:ring-ideation"
      },
      "source": {
        "headCell": "text-source",
        "cellTrigger": "focus-visible:ring-source"
      }
    },
    "variant": {
      "solid": "",
      "outline": "",
      "soft": "",
      "subtle": ""
    },
    "size": {
      "xs": {
        "heading": "text-xs",
        "cell": "text-xs",
        "headCell": "text-[10px]",
        "cellTrigger": "size-7",
        "body": "space-y-2 pt-2"
      },
      "sm": {
        "heading": "text-xs",
        "headCell": "text-xs",
        "cell": "text-xs",
        "cellTrigger": "size-7"
      },
      "md": {
        "heading": "text-sm",
        "headCell": "text-xs",
        "cell": "text-sm",
        "cellTrigger": "size-8"
      },
      "lg": {
        "heading": "text-md",
        "headCell": "text-md",
        "cellTrigger": "size-9 text-md"
      },
      "xl": {
        "heading": "text-lg",
        "headCell": "text-lg",
        "cellTrigger": "size-10 text-lg"
      }
    }
  },
  "compoundVariants": [
    {
      "color": "primary" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-primary data-[selected]:text-inverted data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-neutral data-[selected]:text-inverted data-today:not-data-[selected]:text-neutral data-[highlighted]:bg-neutral/20 hover:not-data-[selected]:bg-neutral/20"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-secondary data-[selected]:text-inverted data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20"
      }
    },
    {
      "color": "info" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-info data-[selected]:text-inverted data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20"
      }
    },
    {
      "color": "success" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-success data-[selected]:text-inverted data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-warning data-[selected]:text-inverted data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20"
      }
    },
    {
      "color": "error" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-error data-[selected]:text-inverted data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-commentary data-[selected]:text-inverted data-today:not-data-[selected]:text-commentary data-[highlighted]:bg-commentary/20 hover:not-data-[selected]:bg-commentary/20"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-ideation data-[selected]:text-inverted data-today:not-data-[selected]:text-ideation data-[highlighted]:bg-ideation/20 hover:not-data-[selected]:bg-ideation/20"
      }
    },
    {
      "color": "source" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-source data-[selected]:text-inverted data-today:not-data-[selected]:text-source data-[highlighted]:bg-source/20 hover:not-data-[selected]:bg-source/20"
      }
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-primary/50 data-[selected]:text-primary data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/10 hover:not-data-[selected]:bg-primary/10"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-neutral/50 data-[selected]:text-neutral data-today:not-data-[selected]:text-neutral data-[highlighted]:bg-neutral/10 hover:not-data-[selected]:bg-neutral/10"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-secondary/50 data-[selected]:text-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/10 hover:not-data-[selected]:bg-secondary/10"
      }
    },
    {
      "color": "info" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-info/50 data-[selected]:text-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/10 hover:not-data-[selected]:bg-info/10"
      }
    },
    {
      "color": "success" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-success/50 data-[selected]:text-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/10 hover:not-data-[selected]:bg-success/10"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-warning/50 data-[selected]:text-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/10 hover:not-data-[selected]:bg-warning/10"
      }
    },
    {
      "color": "error" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-error/50 data-[selected]:text-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/10 hover:not-data-[selected]:bg-error/10"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-commentary/50 data-[selected]:text-commentary data-today:not-data-[selected]:text-commentary data-[highlighted]:bg-commentary/10 hover:not-data-[selected]:bg-commentary/10"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-ideation/50 data-[selected]:text-ideation data-today:not-data-[selected]:text-ideation data-[highlighted]:bg-ideation/10 hover:not-data-[selected]:bg-ideation/10"
      }
    },
    {
      "color": "source" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-source/50 data-[selected]:text-source data-today:not-data-[selected]:text-source data-[highlighted]:bg-source/10 hover:not-data-[selected]:bg-source/10"
      }
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-primary/10 data-[selected]:text-primary data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-neutral/10 data-[selected]:text-neutral data-today:not-data-[selected]:text-neutral data-[highlighted]:bg-neutral/20 hover:not-data-[selected]:bg-neutral/20"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-secondary/10 data-[selected]:text-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20"
      }
    },
    {
      "color": "info" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-info/10 data-[selected]:text-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20"
      }
    },
    {
      "color": "success" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-success/10 data-[selected]:text-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-warning/10 data-[selected]:text-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20"
      }
    },
    {
      "color": "error" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-error/10 data-[selected]:text-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-commentary/10 data-[selected]:text-commentary data-today:not-data-[selected]:text-commentary data-[highlighted]:bg-commentary/20 hover:not-data-[selected]:bg-commentary/20"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-ideation/10 data-[selected]:text-ideation data-today:not-data-[selected]:text-ideation data-[highlighted]:bg-ideation/20 hover:not-data-[selected]:bg-ideation/20"
      }
    },
    {
      "color": "source" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-source/10 data-[selected]:text-source data-today:not-data-[selected]:text-source data-[highlighted]:bg-source/20 hover:not-data-[selected]:bg-source/20"
      }
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-primary/10 data-[selected]:text-primary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-primary/25 data-today:not-data-[selected]:text-primary data-[highlighted]:bg-primary/20 hover:not-data-[selected]:bg-primary/20"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-neutral/10 data-[selected]:text-neutral data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-neutral/25 data-today:not-data-[selected]:text-neutral data-[highlighted]:bg-neutral/20 hover:not-data-[selected]:bg-neutral/20"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-secondary/10 data-[selected]:text-secondary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-secondary/25 data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20"
      }
    },
    {
      "color": "info" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-info/10 data-[selected]:text-info data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-info/25 data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20"
      }
    },
    {
      "color": "success" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-success/10 data-[selected]:text-success data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-success/25 data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-warning/10 data-[selected]:text-warning data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-warning/25 data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20"
      }
    },
    {
      "color": "error" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-error/10 data-[selected]:text-error data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-error/25 data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-commentary/10 data-[selected]:text-commentary data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-commentary/25 data-today:not-data-[selected]:text-commentary data-[highlighted]:bg-commentary/20 hover:not-data-[selected]:bg-commentary/20"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-ideation/10 data-[selected]:text-ideation data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-ideation/25 data-today:not-data-[selected]:text-ideation data-[highlighted]:bg-ideation/20 hover:not-data-[selected]:bg-ideation/20"
      }
    },
    {
      "color": "source" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-source/10 data-[selected]:text-source data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-source/25 data-today:not-data-[selected]:text-source data-[highlighted]:bg-source/20 hover:not-data-[selected]:bg-source/20"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "solid" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-inverted data-[selected]:text-inverted data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "outline" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-[selected]:text-default data-[selected]:bg-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/10 hover:not-data-[selected]:bg-inverted/10"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "soft" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-elevated data-[selected]:text-default data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "subtle" as typeof variant[number],
      "class": {
        "cellTrigger": "data-[selected]:bg-elevated data-[selected]:text-default data-[selected]:ring data-[selected]:ring-inset data-[selected]:ring-accented data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10"
      }
    }
  ],
  "defaultVariants": {
    "size": "md" as typeof size[number],
    "color": "primary" as typeof color[number],
    "variant": "solid" as typeof variant[number]
  }
}