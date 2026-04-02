import { lazy } from "react";

const manifest = {
  plugin: "care_issue_management",
  extends: [],
  components: {
    CareIssueManagementWidget: lazy(
      () => import("./providers"),
    ),
  },
  navItems: [],
};

export default manifest;
