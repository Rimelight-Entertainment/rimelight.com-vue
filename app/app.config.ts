export default defineAppConfig({
  title: "Rimelight Entertainment",
  description: "Tell your story.",
  cdn: "https://cdn.rimelight.com",
  rimelightComponents: {
    logos: {
      logomark: {
        black: "logos:RIMELIGHT_LOGOMARK_BLACK",
        white: "logos:RIMELIGHT_LOGOMARK_WHITE",
        color: "logos:RIMELIGHT_LOGOMARK_COLOR",
      },
      logotype: {
        black: "logos:RIMELIGHT_LOGOTYPE_BLACK",
        white: "logos:RIMELIGHT_LOGOTYPE_WHITE",
        color: "logos:RIMELIGHT_LOGOTYPE_COLOR",
      },
      combomark_horizontal: {
        black: "logos:RIMELIGHT_COMBOMARK_HORIZONTAL_BLACK",
        white: "logos:RIMELIGHT_COMBOMARK_HORIZONTAL_WHITE",
        color: "logos:RIMELIGHT_COMBOMARK_HORIZONTAL_COLOR",
      },
      combomark_vertical: {
        black: "logos:RIMELIGHT_COMBOMARK_VERTICAL_BLACK",
        white: "logos:RIMELIGHT_COMBOMARK_VERTICAL_WHITE",
        color: "logos:RIMELIGHT_COMBOMARK_VERTICAL_COLOR",
      },
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
        "dmarchi",
      ],
    },
    callouts: {
      info: {
        icon: "lucide:shield-alert",
        title: "callout_info_title",
        tooltip: "callout_info_tooltip",
      },
      success: {
        icon: "lucide:circle-alert",
        title: "callout_success_title",
        tooltip: "callout_success_tooltip",
      },
      warning: {
        icon: "lucide:triangle-alert",
        title: "callout_warning_title",
        tooltip: "callout_warning_tooltip",
      },
      error: {
        icon: "lucide:octagon-alert",
        title: "callout_error_title",
        tooltip: "callout_error_tooltip",
      },
      commentary: {
        icon: "lucide:message-circle-warning",
        title: "callout_commentary_title",
        tooltip: "callout_commentary_tooltip",
      },
      ideation: {
        icon: "lucide:badge-alert",
        title: "callout_ideation_title",
        tooltip: "callout_ideation_tooltip",
      },
      source: {
        icon: "lucide:book-alert",
        title: "callout_source_title",
        tooltip: "callout_source_tooltip",
      },
    },
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
      neutral: "zinc",
      grandTalePrimary: "grand-tale-primary",
      grandTaleSecondary: "grand-tale-secondary",
    },
    icons: {
      close: "lucide:x",
      chevronLeft: "lucide:chevron-left",
      chevronRight: "lucide:chevron-right",
    },
    link: {
      variants: {
        active: {
          true: "text-primary-500",
          false: "text-muted",
        },
      },
    },
    formField: {
      slots: {
        description: "text-sm",
        help: "text-xs",
      },
    },
    checkbox: {
      slots: {
        description: "text-sm",
      },
    },
    toast: {
      slots: {
        root: "bg-black border-none ring-0",
      },
    },
    dropdownMenu: {
      slots: {
        content: "ring-0",
      },
    },
    selectMenu: {
      slots: {
        content: "min-w-fit",
      },
    },
    popover: {
      slots: {
        content: "ring-0",
      },
    },
    modal: {
      variants: {
        fullscreen: {
          false: {
            content: "ring-0 bg-muted divide-none",
          },
        },
      },
    },
    slideover: {
      slots: {
        content: "bg-black",
      },
    },
    banner: {
      slots: {
        icon: "text-default",
        title: "text-default",
        close: "text-default",
      },
    },
    page: {
      slots: {
        root: "lg:gap-8",
      },
    },
    pageAside: {
      slots: {
        root: "lg:px-4 lg:pe-0 lg:ps-0 lg:ms-0",
      },
    },
    pageHeader: {
      slots: {
        links: "justify-end",
      },
    },
    pageCTA: {
      slots: {
        root: "rounded-none",
      },
    },
    navigationMenu: {
      slots: {
        separator: "my-2",
        viewport: "ring-0",
      },
      variants: {
        active: {
          true: {
            childLink: "before:bg-elevated text-highlighted",
            childLinkIcon: "text-highlighted",
          },
          false: {
            link: "text-default",
            linkLeadingIcon: "text-dimmed",
          },
        },
      },
      compoundVariants: [
        {
          disabled: false,
          active: false,
          variant: "pill",
          class: {
            link: ["hover:text-toned", "transition-colors"],
            linkLeadingIcon: ["group-hover:text-toned", "transition-colors"],
          },
        },
        {
          disabled: false,
          active: false,
          variant: "link",
          class: {
            link: ["hover:text-toned", "transition-colors"],
            linkLeadingIcon: ["group-hover:text-toned", "transition-colors"],
          },
        },
        {
          orientation: "vertical",
          collapsed: false,
          class: {
            childList: "border-muted",
          },
        },
      ],
    },
    footerColumns: {
      slots: {
        label: "text-white",
      },
      variants: {
        active: {
          true: { link: "text-primary-300 hover:text-primary-200" },
          false: { link: "text-white hover:text-primary-200" },
        },
      },
    },
    dashboardGroup: {
      base: "flex-1 flex overflow-hidden relative",
    },
    dashboardPanel: {
      slots: {
        root: "min-h-full",
      },
    },
    dashboardNavbar: {
      slots: {
        root: "h-12",
        title: "text-xl",
      },
    },
    dashboardSidebar: {
      slots: {
        root: "min-h-full",
      },
    },
    dashboardToolbar: {
      slots: {
        root: "h-12",
      },
    },
    blogPost: {
      slots: {
        root: "rounded-none",
      },
    },
  },
});
