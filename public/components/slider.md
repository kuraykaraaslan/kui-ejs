# Slider

- **id:** `slider`
- **layer:** ui
- **category:** Organism
- **filePath:** `modules/ui/Slider.ejs`
- **status:** stable
- **since:** 2026-05

Accessible carousel. Includes role="region" + aria-roledescription="carousel" and per-slide aria labels. Supports autoplay, arrow keys, and dot navigation.

## Variants

### Default

```ejs
<%- include('modules/ui/Slider', {
  slides: [
    "<div class='h-40 flex items-center justify-center bg-primary text-white'>Slide 1</div>",
    "<div class='h-40 flex items-center justify-center bg-secondary text-white'>Slide 2</div>",
    "<div class='h-40 flex items-center justify-center bg-info text-white'>Slide 3</div>",
  ],
}) %>
```

### Auto-play

```ejs
<%- include('modules/ui/Slider', {
  slides:           [ /* ... */ ],
  autoPlay:         true,
  autoPlayInterval: 2000,
}) %>
```

### No arrows / no loop

```ejs
<%- include('modules/ui/Slider', {
  slides:     [ /* ... */ ],
  showArrows: false,
  loop:       false,
}) %>
```

## Full EJS source

```ejs
<%- include('./Slider/Slider', locals) %>

```
