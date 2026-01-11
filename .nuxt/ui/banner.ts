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

export default {
  "slots": {
    "root": [
      "relative z-50 w-full",
      "transition-colors"
    ],
    "container": "flex items-center justify-between gap-3 h-12",
    "left": "hidden lg:flex-1 lg:flex lg:items-center",
    "center": "flex items-center gap-1.5 min-w-0",
    "right": "lg:flex-1 flex items-center justify-end",
    "icon": "size-5 shrink-0 text-inverted pointer-events-none",
    "title": "text-sm text-inverted font-medium truncate",
    "actions": "flex gap-1.5 shrink-0 isolate",
    "close": "text-inverted hover:bg-default/10 focus-visible:bg-default/10 -me-1.5 lg:me-0"
  },
  "variants": {
    "color": {
      "primary": {
        "root": "bg-primary"
      },
      "neutral": {
        "root": "bg-inverted"
      },
      "secondary": {
        "root": "bg-secondary"
      },
      "info": {
        "root": "bg-info"
      },
      "success": {
        "root": "bg-success"
      },
      "warning": {
        "root": "bg-warning"
      },
      "error": {
        "root": "bg-error"
      },
      "commentary": {
        "root": "bg-commentary"
      },
      "ideation": {
        "root": "bg-ideation"
      },
      "source": {
        "root": "bg-source"
      }
    },
    "to": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "color": "primary" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-primary/90"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-neutral/90"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-secondary/90"
      }
    },
    {
      "color": "info" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-info/90"
      }
    },
    {
      "color": "success" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-success/90"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-warning/90"
      }
    },
    {
      "color": "error" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-error/90"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-commentary/90"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-ideation/90"
      }
    },
    {
      "color": "source" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-source/90"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "to": true,
      "class": {
        "root": "hover:bg-inverted/90"
      }
    }
  ],
  "defaultVariants": {
    "color": "primary" as typeof color[number]
  }
}