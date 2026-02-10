export default defineAppConfig({
  title: "Rimelight Entertainment",
  description: "Tell your story.",
  cdn: "https://cdn.rimelight.com",
  logomark: "first-party:logomark-white",
  logotype: "first-party:logotype-white",
  rimelightComponents: {
    logos: {
      mark: {
        light: "first-party:logomark-white",
        dark: "first-party:logomark-white"
      },
      type: {
        light: "first-party:logotype-white",
        dark: "first-party:logotype-white"
      },
      classic: {
        light: "i-first-party:logo-classic-black",
        dark: "i-first-party:logo-classic-white"
      },
      symbol: "i-lucide:sparkles",
      monochrome: "i-first-party:logomark-white"
    },
    auth: {
      adminEmailDomain: "@rimelight.com",
      restrictedUsernames: [
        // Brand-specific
        "rimelight",
        "rimelightent",
        "rimelightentertainment",
        "rimelightofficial",
        "grandtale",
        "playgrandtale",
        // Founder
        "danielmarchi",
        "dmarchi"
      ]
    },
    callouts: {
      info: {
        icon: "lucide:shield-alert",
        title: "callout_info_title",
        tooltip: "callout_info_tooltip"
      },
      success: {
        icon: "lucide:circle-alert",
        title: "callout_success_title",
        tooltip: "callout_success_tooltip"
      },
      warning: {
        icon: "lucide:triangle-alert",
        title: "callout_warning_title",
        tooltip: "callout_warning_tooltip"
      },
      error: {
        icon: "lucide:octagon-alert",
        title: "callout_error_title",
        tooltip: "callout_error_tooltip"
      },
      commentary: {
        icon: "lucide:message-circle-warning",
        title: "callout_commentary_title",
        tooltip: "callout_commentary_tooltip"
      },
      ideation: {
        icon: "lucide:badge-alert",
        title: "callout_ideation_title",
        tooltip: "callout_ideation_tooltip"
      },
      source: {
        icon: "lucide:book-alert",
        title: "callout_source_title",
        tooltip: "callout_source_tooltip"
      }
    }
  },
  ui: {
    colors: {
      primary: "primary",
      secondary: "secondary",
      info: "info",
      success: "success",
      warning: "warning",
      error: "error",
      commentary: "commentary",
      ideation: "ideation",
      source: "source",
      neutral: "neutrals"
    },
    icons: {
      close: "lucide:x",
      chevronLeft: "lucide:chevron-left",
      chevronRight: "lucide:chevron-right"
    },
    link: {
      variants: {
        active: {
          true: "text-primary-500",
          false: "text-muted"
        }
      }
    },
    button: {
      slots: {
        base: "rounded-none"
      },
      compoundVariants: [
        {
          color: "primary",
          variant: "solid",
          class: "bg-primary-500 text-white hover:bg-primary-600 disabled:bg-primary-700"
        },
        {
          color: "primary",
          variant: "outline",
          class: "ring-primary-500 hover:bg-primary/25"
        }
      ]
    },
    formField: {
      slots: {
        description: "text-sm",
        help: "text-xs"
      }
    },
    input: {
      slots: {
        base: "rounded-none"
      }
    },
    checkbox: {
      slots: {
        base: "rounded-none",
        description: "text-sm"
      }
    },
    card: {
      slots: {
        root: "rounded-none"
      }
    },
    alert: {
      slots: {
        root: "rounded-none"
      }
    },
    toast: {
      slots: {
        root: "rounded-none"
      }
    },
    tooltip: {
      slots: {
        content: "rounded-none"
      }
    },
    dropdownMenu: {
      slots: {
        content: "z-[100] rounded-none"
      }
    },
    selectMenu: {
      slots: {
        content: "min-w-fit"
      }
    },
    popover: {
      slots: {
        content: "z-[100] rounded-none ring-0"
      }
    },
    modal: {
      variants: {
        fullscreen: {
          false: {
            content: "rounded-none ring-0 bg-muted divide-none"
          }
        }
      }
    },
    banner: {
      slots: {
        icon: "text-default",
        title: "text-default",
        close: "text-default"
      }
    },
    page: {
      slots: {
        root: "lg:gap-8"
      }
    },
    pageAside: {
      slots: {
        root: "lg:px-4 lg:pe-0 lg:ps-0 lg:ms-0"
      }
    },
    pageHeader: {
      slots: {
        links: "justify-end"
      }
    },
    pageCTA: {
      slots: {
        root: "rounded-none"
      }
    },
    navigationMenu: {
      slots: {
        separator: "my-2"
      },
      variants: {
        active: {
          true: {
            childLink: "before:bg-elevated text-highlighted",
            childLinkIcon: "text-highlighted"
          },
          false: {
            link: "text-default",
            linkLeadingIcon: "text-dimmed"
          }
        }
      },
      compoundVariants: [
        {
          disabled: false,
          active: false,
          variant: "pill",
          class: {
            link: ["hover:text-toned", "transition-colors"],
            linkLeadingIcon: ["group-hover:text-toned", "transition-colors"]
          }
        },
        {
          disabled: false,
          active: false,
          variant: "link",
          class: {
            link: ["hover:text-toned", "transition-colors"],
            linkLeadingIcon: ["group-hover:text-toned", "transition-colors"]
          }
        },
        {
          orientation: "vertical",
          collapsed: false,
          class: {
            childList: "border-muted"
          }
        }
      ]
    },
    footerColumns: {
      slots: {
        label: "text-white"
      },
      variants: {
        active: {
          true: { link: "text-primary-300 hover:text-primary-200" },
          false: { link: "text-white hover:text-primary-200" }
        }
      }
    },
    dashboardGroup: {
      base: "flex-1 flex overflow-hidden relative"
    },
    dashboardPanel: {
      slots: {
        root: "min-h-full"
      }
    },
    dashboardSidebar: {
      slots: {
        root: "min-h-full"
      }
    },
    blogPost: {
      slots: {
        root: "rounded-none"
      }
    }
  }
})
