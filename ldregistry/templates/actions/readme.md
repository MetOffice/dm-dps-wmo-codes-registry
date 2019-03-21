Templates (partials) used for the various admin controls - rendering forms and results

For actions that occur in the admin tab of the metadata box (or similar areas) then there is a standard pattern:

    _{action}.vm         - renders the button to invoke the action, notes any required dialog
    _{action}-dialog.vm  - renders any corresponding dialog box
    {action}-page.vm     - full page render for actions that pages instead of modal dialogs
