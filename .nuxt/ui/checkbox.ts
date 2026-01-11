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
  "list",
  "card"
] as const

const indicator = [
  "start",
  "end",
  "hidden"
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
    "root": "relative flex items-start",
    "container": "flex items-center",
    "base": "rounded-sm ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2",
    "indicator": "flex items-center justify-center size-full text-inverted" as typeof indicator[number],
    "icon": "shrink-0 size-full",
    "wrapper": "w-full",
    "label": "block font-medium text-default",
    "description": "text-muted"
  },
  "variants": {
    "color": {
      "primary": {
        "base": "focus-visible:outline-primary",
        "indicator": "bg-primary" as typeof indicator[number]
      },
      "neutral": {
        "base": "focus-visible:outline-inverted",
        "indicator": "bg-inverted" as typeof indicator[number]
      },
      "secondary": {
        "base": "focus-visible:outline-secondary",
        "indicator": "bg-secondary" as typeof indicator[number]
      },
      "info": {
        "base": "focus-visible:outline-info",
        "indicator": "bg-info" as typeof indicator[number]
      },
      "success": {
        "base": "focus-visible:outline-success",
        "indicator": "bg-success" as typeof indicator[number]
      },
      "warning": {
        "base": "focus-visible:outline-warning",
        "indicator": "bg-warning" as typeof indicator[number]
      },
      "error": {
        "base": "focus-visible:outline-error",
        "indicator": "bg-error" as typeof indicator[number]
      },
      "commentary": {
        "base": "focus-visible:outline-commentary",
        "indicator": "bg-commentary" as typeof indicator[number]
      },
      "ideation": {
        "base": "focus-visible:outline-ideation",
        "indicator": "bg-ideation" as typeof indicator[number]
      },
      "source": {
        "base": "focus-visible:outline-source",
        "indicator": "bg-source" as typeof indicator[number]
      }
    },
    "variant": {
      "list": {
        "root": ""
      },
      "card": {
        "root": "border border-muted rounded-lg"
      }
    },
    "indicator": {
      "start": {
        "root": "flex-row",
        "wrapper": "ms-2"
      },
      "end": {
        "root": "flex-row-reverse",
        "wrapper": "me-2"
      },
      "hidden": {
        "base": "sr-only",
        "wrapper": "text-center"
      }
    },
    "size": {
      "xs": {
        "base": "size-3",
        "container": "h-4",
        "wrapper": "text-xs"
      },
      "sm": {
        "base": "size-3.5",
        "container": "h-4",
        "wrapper": "text-xs"
      },
      "md": {
        "base": "size-4",
        "container": "h-5",
        "wrapper": "text-sm"
      },
      "lg": {
        "base": "size-4.5",
        "container": "h-5",
        "wrapper": "text-sm"
      },
      "xl": {
        "base": "size-5",
        "container": "h-6",
        "wrapper": "text-base"
      }
    },
    "required": {
      "true": {
        "label": "after:content-['*'] after:ms-0.5 after:text-error"
      }
    },
    "disabled": {
      "true": {
        "root": "opacity-75",
        "base": "cursor-not-allowed",
        "label": "cursor-not-allowed",
        "description": "cursor-not-allowed"
      }
    },
    "checked": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "size": "xs" as typeof size[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "p-2.5"
      }
    },
    {
      "size": "sm" as typeof size[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "p-3"
      }
    },
    {
      "size": "md" as typeof size[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "p-3.5"
      }
    },
    {
      "size": "lg" as typeof size[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "p-4"
      }
    },
    {
      "size": "xl" as typeof size[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "p-4.5"
      }
    },
    {
      "color": "primary" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-primary"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-neutral"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-secondary"
      }
    },
    {
      "color": "info" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-info"
      }
    },
    {
      "color": "success" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-success"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-warning"
      }
    },
    {
      "color": "error" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-error"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-commentary"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-ideation"
      }
    },
    {
      "color": "source" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-source"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "variant": "card" as typeof variant[number],
      "class": {
        "root": "has-data-[state=checked]:border-inverted"
      }
    },
    {
      "variant": "card" as typeof variant[number],
      "disabled": true,
      "class": {
        "root": "cursor-not-allowed"
      }
    }
  ],
  "defaultVariants": {
    "size": "md" as typeof size[number],
    "color": "primary" as typeof color[number],
    "variant": "list" as typeof variant[number],
    "indicator": "start" as typeof indicator[number]
  }
}