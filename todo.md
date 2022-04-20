for inspiration https://tailwindui.com/#components

style loading indicator

utils first css?

run linter

custom tag naming

more generic tag names profile-list --> item-list ?

CSS theming vs essential?

- try to come up with css that styles the most basic layout (via HTML tags)
- optional theme styles for bling

theme.css layout.css css/components/

global (tag styles button, input, etc) components.css (custom tags) mixins.css
(helpers)

https://www.regisphilibert.com/note/utility-class-css-components-reconciled/

<link rel="stylesheet"> is permitted in the body
each references stylesheet loaded once and applies to whole html page?

jsx module => produce link stylesheet for module?

use css modules for basic layout css?

- theme/skin css (classes or selectors?)

# to use css modules

two ideas:

1. import function/directive, eg import('css file') -> gather all css imports
   and inject into html as style tag
2. by convention, read all directories and search for 'foo.module.css' files and
   inject as style tag

how to use mangled classes in partial/component ?

1. pass map to ssr_jsx to replace original class names with mangled ones?
2. no mangled names, scope by custom tag or module name?
3. transform names to `module__selector` ?

https://riot.js.org/documentation/#scoped-css ???

https://stylelint.io

https://cssnano.co

import postcss from "https://deno.land/x/postcss/mod.js"; import {default as
postcssmodules} https://esm.sh/postcss-modules

ssr jsx needs to support css object in options eg

```
css = {
    article: _article_xkpkl_10,
}
```

importStyle("./.module.css")

await Deno.readTextFile(`${Deno.cwd()}/assets/module.css`); const result = await
postcss([postcssmodules]).process(css);
