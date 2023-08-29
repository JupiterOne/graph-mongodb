# MongoDB

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources    | Entity `_type`    | Entity `_class`     |
| ------------ | ----------------- | ------------------- |
| Cluster      | `mongodb_cluster` | `Cluster`           |
| Organization | `mongodb_tenant`  | `Organization`      |
| Project      | `mongodb_project` | `Project`           |
| Role         | `mongodb_role`    | `AccessRole`        |
| Team         | `mongodb_team`    | `UserGroup`, `Team` |
| User         | `mongodb_user`    | `User`              |

### Relationships

The following relationships are created:

| Source Entity `_type` | Relationship `_class` | Target Entity `_type` |
| --------------------- | --------------------- | --------------------- |
| `mongodb_project`     | **HAS**               | `mongodb_cluster`     |
| `mongodb_project`     | **HAS**               | `mongodb_role`        |
| `mongodb_team`        | **HAS**               | `mongodb_user`        |
| `mongodb_tenant`      | **HAS**               | `mongodb_project`     |
| `mongodb_tenant`      | **HAS**               | `mongodb_team`        |
| `mongodb_tenant`      | **HAS**               | `mongodb_user`        |
| `mongodb_role`        | **LIMITS**            | `mongodb_user`        |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
