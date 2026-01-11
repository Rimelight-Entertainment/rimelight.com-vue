const orientation = [
  "horizontal",
  "vertical"
] as const

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
  "3xs",
  "2xs",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl"
] as const

export default {
  "slots": {
    "root": "flex gap-1.5",
    "item": "group relative flex flex-1 gap-3",
    "container": "relative flex items-center gap-1.5",
    "indicator": "group-data-[state=completed]:text-inverted group-data-[state=active]:text-inverted text-muted",
    "separator": "flex-1 rounded-full bg-elevated",
    "wrapper": "w-full",
    "date": "text-dimmed text-xs/5",
    "title": "font-medium text-highlighted text-sm",
    "description": "text-muted text-wrap text-sm"
  },
  "variants": {
    "orientation": {
      "horizontal": {
        "root": "flex-row w-full",
        "item": "flex-col",
        "separator": "h-0.5"
      },
      "vertical": {
        "root": "flex-col",
        "container": "flex-col",
        "separator": "w-0.5"
      }
    },
    "color": {
      "primary": {
        "indicator": "group-data-[state=completed]:bg-primary group-data-[state=active]:bg-primary"
      },
      "neutral": {
        "indicator": "group-data-[state=completed]:bg-inverted group-data-[state=active]:bg-inverted"
      },
      "secondary": {
        "indicator": "group-data-[state=completed]:bg-secondary group-data-[state=active]:bg-secondary"
      },
      "info": {
        "indicator": "group-data-[state=completed]:bg-info group-data-[state=active]:bg-info"
      },
      "success": {
        "indicator": "group-data-[state=completed]:bg-success group-data-[state=active]:bg-success"
      },
      "warning": {
        "indicator": "group-data-[state=completed]:bg-warning group-data-[state=active]:bg-warning"
      },
      "error": {
        "indicator": "group-data-[state=completed]:bg-error group-data-[state=active]:bg-error"
      },
      "commentary": {
        "indicator": "group-data-[state=completed]:bg-commentary group-data-[state=active]:bg-commentary"
      },
      "ideation": {
        "indicator": "group-data-[state=completed]:bg-ideation group-data-[state=active]:bg-ideation"
      },
      "source": {
        "indicator": "group-data-[state=completed]:bg-source group-data-[state=active]:bg-source"
      }
    },
    "size": {
      "3xs": "",
      "2xs": "",
      "xs": "",
      "sm": "",
      "md": "",
      "lg": "",
      "xl": "",
      "2xl": "",
      "3xl": ""
    },
    "reverse": {
      "true": ""
    }
  },
  "compoundVariants": [
    {
      "color": "primary" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-primary"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-neutral"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-secondary"
      }
    },
    {
      "color": "info" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-info"
      }
    },
    {
      "color": "success" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-success"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-warning"
      }
    },
    {
      "color": "error" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-error"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-commentary"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-ideation"
      }
    },
    {
      "color": "source" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-source"
      }
    },
    {
      "color": "primary" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-primary group-data-[state=completed]:bg-primary"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-neutral group-data-[state=completed]:bg-neutral"
      }
    },
    {
      "color": "secondary" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-secondary group-data-[state=completed]:bg-secondary"
      }
    },
    {
      "color": "info" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-info group-data-[state=completed]:bg-info"
      }
    },
    {
      "color": "success" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-success group-data-[state=completed]:bg-success"
      }
    },
    {
      "color": "warning" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-warning group-data-[state=completed]:bg-warning"
      }
    },
    {
      "color": "error" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-error group-data-[state=completed]:bg-error"
      }
    },
    {
      "color": "commentary" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-commentary group-data-[state=completed]:bg-commentary"
      }
    },
    {
      "color": "ideation" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-ideation group-data-[state=completed]:bg-ideation"
      }
    },
    {
      "color": "source" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-source group-data-[state=completed]:bg-source"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "reverse": false,
      "class": {
        "separator": "group-data-[state=completed]:bg-inverted"
      }
    },
    {
      "color": "neutral" as typeof color[number],
      "reverse": true,
      "class": {
        "separator": "group-data-[state=active]:bg-inverted group-data-[state=completed]:bg-inverted"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "3xs" as typeof size[number],
      "class": {
        "wrapper": "pe-4.5"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "2xs" as typeof size[number],
      "class": {
        "wrapper": "pe-5"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "xs" as typeof size[number],
      "class": {
        "wrapper": "pe-5.5"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "sm" as typeof size[number],
      "class": {
        "wrapper": "pe-6"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "md" as typeof size[number],
      "class": {
        "wrapper": "pe-6.5"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "lg" as typeof size[number],
      "class": {
        "wrapper": "pe-7"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "xl" as typeof size[number],
      "class": {
        "wrapper": "pe-7.5"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "2xl" as typeof size[number],
      "class": {
        "wrapper": "pe-8"
      }
    },
    {
      "orientation": "horizontal" as typeof orientation[number],
      "size": "3xl" as typeof size[number],
      "class": {
        "wrapper": "pe-8.5"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "3xs" as typeof size[number],
      "class": {
        "wrapper": "-mt-0.5 pb-4.5"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "2xs" as typeof size[number],
      "class": {
        "wrapper": "pb-5"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "xs" as typeof size[number],
      "class": {
        "wrapper": "mt-0.5 pb-5.5"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "sm" as typeof size[number],
      "class": {
        "wrapper": "mt-1 pb-6"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "md" as typeof size[number],
      "class": {
        "wrapper": "mt-1.5 pb-6.5"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "lg" as typeof size[number],
      "class": {
        "wrapper": "mt-2 pb-7"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "xl" as typeof size[number],
      "class": {
        "wrapper": "mt-2.5 pb-7.5"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "2xl" as typeof size[number],
      "class": {
        "wrapper": "mt-3 pb-8"
      }
    },
    {
      "orientation": "vertical" as typeof orientation[number],
      "size": "3xl" as typeof size[number],
      "class": {
        "wrapper": "mt-3.5 pb-8.5"
      }
    }
  ],
  "defaultVariants": {
    "size": "md" as typeof size[number],
    "color": "primary" as typeof color[number]
  }
}