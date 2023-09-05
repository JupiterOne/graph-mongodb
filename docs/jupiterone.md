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

| Resources    | Entity `_type`         | Entity `_class`     |
| ------------ | ---------------------- | ------------------- |
| API KEY      | `mongodb_api_key`      | `AccessKey`         |
| Cluster      | `mongodb_cluster`      | `Cluster`           |
| Organization | `mongodb_organization` | `Organization`      |
| Project      | `mongodb_project`      | `Project`           |
| Role         | `mongodb_role`         | `AccessRole`        |
| Team         | `mongodb_team`         | `UserGroup`, `Team` |
| User         | `mongodb_user`         | `User`              |

### Relationships

The following relationships are created:

| Source Entity `_type`  | Relationship `_class` | Target Entity `_type` |
| ---------------------- | --------------------- | --------------------- |
| `mongodb_api_key`      | **HAS**               | `mongodb_role`        |
| `mongodb_organization` | **HAS**               | `mongodb_api_key`     |
| `mongodb_organization` | **HAS**               | `mongodb_project`     |
| `mongodb_organization` | **HAS**               | `mongodb_team`        |
| `mongodb_organization` | **HAS**               | `mongodb_user`        |
| `mongodb_project`      | **HAS**               | `mongodb_api_key`     |
| `mongodb_project`      | **HAS**               | `mongodb_cluster`     |
| `mongodb_project`      | **HAS**               | `mongodb_team`        |
| `mongodb_project`      | **HAS**               | `mongodb_user`        |
| `mongodb_project`      | **OWNS**              | `mongodb_role`        |
| `mongodb_team`         | **HAS**               | `mongodb_role`        |
| `mongodb_team`         | **HAS**               | `mongodb_user`        |
| `mongodb_user`         | **ASSIGNED**          | `mongodb_role`        |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
