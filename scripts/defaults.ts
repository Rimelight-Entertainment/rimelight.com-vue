export interface CalloutOptions {
  icon: string;
  title: string;
  tooltip: string;
}

export const defaultOptions = {
  enabled: true,
  prefix: "RC",
  logos: {
    mark: "",
    type: "",
    classic: "",
    symbol: "",
  } as Record<string, any>,
  callouts: {
    info: {
      icon: "lucide:info",
      title: "callout_info_title",
      tooltip: "callout_info_description",
    },
    success: {
      icon: "lucide:circle-check",
      title: "callout_success_title",
      tooltip: "callout_success_description",
    },
    warning: {
      icon: "lucide:triangle-alert",
      title: "callout_warning_title",
      tooltip: "callout_warning_description",
    },
    error: {
      icon: "lucide:octagon-alert",
      title: "callout_error_title",
      tooltip: "callout_error_description",
    },
    commentary: {
      icon: "lucide:message-circle",
      title: "callout_commentary_title",
      tooltip: "callout_commentary_description",
    },
    ideation: {
      icon: "lucide:lightbulb",
      title: "callout_ideation_title",
      tooltip: "callout_ideation_description",
    },
    source: {
      icon: "lucide:book",
      title: "callout_source_title",
      tooltip: "callout_source_description",
    },
  },
};
