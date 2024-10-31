# Custom Colors in Tailwind CSS

This document explains how to use the custom colors defined in your `tailwind.config.js` file. The custom colors include:

- **newPrimary**: `#0056D2`
- **newSecondary**: `#FF7A29`
- **tertiary**: `#00FF66`

## 1. Adding Custom Colors

In the Tailwind configuration should have the following color settings in the `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        newPrimary: "#0056D2",
        newSecondary: "#FF7A29",
        tertiary: "#00FF66",
      },
    },
  },
};

```

# Usage Examples
## 1. Using Custom Colors in Text

You can apply custom colors to text using the class name pattern text-{color-name}. For

<p class="text-newPrimary">This text is using the newPrimary color.</p>
<p class="text-newSecondary">This text is using the newSecondary color.</p>
<p class="text-tertiary">This text is using the tertiary color.</p>


## 2. Using Custom Colors in Backgrounds

You can apply custom colors to backgrounds using the class name pattern bg-{color-name}. For example:

<div class="bg-newPrimary p-4 text-white">
  This background uses the newPrimary color.
</div>
<div class="bg-newSecondary p-4 text-white">
  This background uses the newSecondary color.
</div>
<div class="bg-tertiary p-4 text-black">
  This background uses the tertiary color.
</div>


## 3.  Using Custom Colors in Borders   

You can apply custom colors to borders using the class name pattern border-{color-name}. For example:

<div class="border-2 border-newPrimary p-4">
  This border uses the newPrimary color.
</div>
<div class="border-2 border-newSecondary p-4">
  This border uses the newSecondary color.
</div>
<div class="border-2 border-tertiary p-4">
  This border uses the tertiary color.
</div>


# Responsive Usage 

You can also use these colors with Tailwind's responsive utilities. For example:

<p class="text-newPrimary md:text-newSecondary lg:text-tertiary">
  This text changes color based on screen size.
</p>
<div class="bg-newPrimary md:bg-newSecondary lg:bg-tertiary p-4">
  This background changes color based on screen size.
</div>


# Hover, Focus, and Other States

Tailwind's state variants work seamlessly with custom colors:

<button class="bg-newPrimary hover:bg-newSecondary text-white py-2 px-4 rounded">
  Hover me to see the color change
</button>
