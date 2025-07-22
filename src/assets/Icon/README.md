# Icons:

# Для начала устанавливаем плагин: vite-plagin-svgr

vite-plugin-svgr — это плагин для Vite, который позволяет импортировать SVG-файлы как React-компоненты. Без него SVG обычно подключается как путь к файлу (<img src="logo.svg" />), а с ним — как полноценный JSX-компонент (<Logo />), что открывает больше гибкости.

🔧 Зачем использовать vite-plugin-svgr?
SVG-иконки часто хочется:

- стилизовать через className или style;
- анимировать через CSS;
- менять fill, stroke, width, height и пр. прямо из JSX;
- инлайнить их без загрузки отдельных файлов (одним пакетом в бандле).

Вот это всё и даёт vite-plugin-svgr.

## Installation

### npm

npm install --save-dev vite-plugin-svgr

## Usage (Подключить в vite.config.ts):

```
// vite.config.js
import svgr from "vite-plugin-svgr";

export default {
    //...
    plugins: [svgr()]
}
```

## Настройка типов (vite-env.d.ts):

```
/// <reference types="vite-plugin-svgr/client" />
```

# Для добавления иконки:

<Icon.[Имя компонента] /> // Например: <Icon.PencilSimple />
