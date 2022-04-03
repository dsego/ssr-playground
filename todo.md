for inspiration https://tailwindui.com/#components

https://iconoir.com

add custom css red border for invalid fields (html validation as well)

checkmark animation

https://eu.wandrd.com/products/original-prvke?variant=16220601352226

/* Animation for checkmark on add to cart button */ button.add_to_cart {
position: relative; } button.add_to_cart .text { display: block; width: 100%;
-webkit-animation-duration: 0.5s; animation-duration: 0.5s; } button.add_to_cart
.fadeInDown.text { -webkit-animation-duration: 0.8s; animation-duration: 0.8s; }

button .checkmark { position: absolute; top: 0; left: 0; bottom: 0; right: 0;
margin: auto; } button .checkmark path { stroke-dasharray: 19.79 19.79;
stroke-dashoffset: 19.79; stroke: #ffffff; opacity: 0; } button
.checkmark.checkmark-active path { -webkit-animation: drawCheckmark 0.5s linear
alternate forwards; animation: drawCheckmark 0.5s linear alternate forwards; }

@keyframes drawCheckmark { from { stroke-dashoffset: 19.79; opacity: 1; }

to { stroke-dashoffset: 0; opacity: 1; } }

@-webkit-keyframes drawCheckmark { from { stroke-dashoffset: 19.79; opacity: 1;
}

to { stroke-dashoffset: 0; opacity: 1; } }

background color on card based on job type or email hash or just id / n of
colors ?

the url should change?

utils first css?

make the card/table view SSR -> ProfileTableRow (enables different layouts)
