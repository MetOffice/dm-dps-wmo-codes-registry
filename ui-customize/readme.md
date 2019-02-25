# Registry styling

This area provides support for generating custom registry styling using sass.

The styling provided here is intended to echo, but not infringe, gov.uk styling as used for the UK Environment and Location registry.

## Assets provided

* `sass/_reg-palette.scss`
  Common brand elements as re-usable SASS variables, including colour palette.

* `sass/_page-top-bar.scss`
  Styling for a common page top bar, including proposition title and menu

* `sass/_page-footer.scss`
  Styling for a common page footer, including support links

* `sass/_service-phase.scss`
  Syling for the alpha- or beta- phase banner

## Generating the stylesheet

To generate a css style sheet from these elements you need install a sass processor (e.g. `sudo su -c "gem install sass"`) and bower (e.g. `npm install -g bower`).

Then use:

    bower install

to install a local copy of boostrap-sass.

Finally to generate a css sheet from the scss sources use:

    sass -I bower_components sass/reg-style.scss > ../ldregistry/ui/assets/css/reg-style.css

*Note*: the resulting css file includes all of the customized bootstrap styling so there is no need to separately include bootstrap.css in your pages.

