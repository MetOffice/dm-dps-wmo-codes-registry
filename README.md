# codes-wmo-deploy

Provides configuration, UI templates and bootstraping for the WMO codes registry installation.

N.B. Requires registry-core 0.1.1 or higher

## Layout

Directory | Role
---|---
`ldregistry` | A starting set of configuration files and templates which should be install in `/opt/ldregistry` on the target system. For details of the role of these files see [Configuration](https://github.com/UKGovLD/registry-core/wiki/Configuration)
`install` | Files used to configure the front end nginx proxy
`scripts` | Example installation scripts

## Customizing the configuration

Files in `ldregistry` which make require customization are:

File | Role
---|---
`templates` | Velocity templates which implement the registry UI, particular targets for customization are ...
`templates/about.vm` | Provides descriptive information on the registry instance
`templates/header.vm` | Customize included style sheets and default page title
`templates/main.vm` | Customize landing page including main title
`ui` | Style sheets and associated javascript and images, the ones here are based on bootstrap3
`boot` | Initial register contents
`config` | Configuration files for the registry instance see [Configuration](https://github.com/UKGovLD/registry-core/wiki/Configuration)

