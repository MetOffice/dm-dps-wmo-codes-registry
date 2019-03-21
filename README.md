# codes-wmo-deploy

Provides configuration, UI templates and bootstraping for the WMO codes registry installation.

N.B. Requires registry-core 1.2.0 or higher

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
`ui/assets` | Style sheets and associated javascript and images, the ones here are based on bootstrap3
`boot` | Initial register contents
`config` | Configuration files for the registry instance see [Configuration](https://github.com/UKGovLD/registry-core/wiki/Configuration)

## Change notes - July 2016

A substantial restructuring of the UI templates has been completed. The key changes are:

   * Moved UI assets to subdirectory `ui/assets`. This makes it easier to configure the front end web server to serve the static assets directly, with only the ui templates being served from tomcat.

   * Updated default look and feel to be more consistent with, but not infringe, gov.uk styling. This is created using sass to customize bootstrap 3.3.6. The new subdirectory `ui-customize` contains the sass scripts and instructions for regenerating the styling.

   * Restructure the UI templates to split into smaller, more maintainable parts with more consistent naming convention. In particular all top level pages are in the root directory, the elements that application to all pages are in `templates/structure`, all templates that are intended to be included within a parent template ("partials" in Rails terminology) start with "_".

   * Simplified the default UI:
      * splitting the "admin" tab into separate "actions" and "administrators"
      * flattening the "registration" action
      * move some actions to "advanced" menu
      * improved "create register" dialog to include metadata annotation
    These are aimed a supporting common operations where a register might be manually created but most content is upload from CSV (or maybe jsonld or ttl files) with "patch" mode being a good universal default. 

The templates are structured as follows:

Template | Role
---|---
`templates/` | All top level page templates
`templates/main.vm` | All normal page renders go through this, if it is the landing page it displays the category based view (`templates/main/_page-category.vm`), otherwise it normally displays a register or item (`templates/main/_item-render.vm`)
`templates/structure` | Elements used on every page to provide the header (`_header.vm`), optional status bar (`_service-bar.vm`) and footer (`_footer.vm`). A standard page normally starts with a sequence of header, navbar and status bar via `_preamble.vm`.
`templates/nav` | Partials used to render the navigation bar
`templates/main` | Partials used for the main pages, in particular all the pieces that make up the default register/item view
`templates/action` | Templates used for the various actions (whether on the navbar menus or in the admin tab). The convention is that `_{action}.vm` renders the link which can be used to invoke `{action}` then `_{action}-dialog.vm` or `_{action}-page.vm` render the UI for carrying out the action either as an inline modal (`dialog`) or as a separately page (`page`). The macros `#startActionSection`, `#action` and `#endActionSection` are used to render the actions tab and keep track of which actions are available so which dialogs need to be included. The macro `#renderDialogs` then includes the required dialog partials.

