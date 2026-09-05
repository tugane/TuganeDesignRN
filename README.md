# TuganeDesign for React Native

The React Native half of [TuganeDesign](https://github.com/tugane/TuganeDesign) —
the shared design language behind [Auger](https://auger.tugane.com) and
[Vaultkit](https://github.com/tugane/Vaultkit). One palette, one set of
components, so every app looks and behaves like a sibling rather than a cousin,
whether it was written in Swift or TypeScript.

The Swift package stays the source of truth. This one tracks it.

## What is in it

- **`Palette`**. All 28 tokens — surface, label, separator, accent, status —
  resolved explicitly for dark and light rather than borrowed from system
  semantics, and delivered through React context. Includes the darkened `*Text`
  variants, because vivid status colours fall to roughly 2:1 contrast as caption
  text on a light card. Ported value for value from `Theme.swift`.
- **`PillButton` / `LinkButton`**: the action vocabulary.
- **`Card`**: the container surface.
- **`FieldLabel`, `SectionLabel`, `CheckBox`, `Chevron`, `Mascot`**: the small pieces.
- **`NoiseOverlay`**. The film grain that gives large flat surfaces some tooth.
- **`PageBackdrop`**. The big blurred drifting glyph behind a page.
- **`plural()`**. Because the language never ships "1 finding(s)".

## Use it

```bash
npm install @tugane/design-rn
```

`react` and `react-native` are peer dependencies, so any React Native app
already satisfies them. There is no build step and nothing to configure.

Resolve a palette once at the root and let everything below read it:

```tsx
import { TuganeDesignProvider, NoiseOverlay } from '@tugane/design-rn';
import { SymbolView } from 'expo-symbols';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  return (
    <TuganeDesignProvider
      theme={theme}
      icon={({ name, size, color }) => (
        <SymbolView name={name} size={size} tintColor={color} />
      )}
    >
      <RootNavigator />
      <NoiseOverlay />
    </TuganeDesignProvider>
  );
}
```

Then read colours from the palette rather than hardcoding them:

```tsx
import { usePalette, PillButton } from '@tugane/design-rn';

const p = usePalette();
<Text style={{ color: p.greenText }}>{status}</Text>   // text variant: legible on light cards
<PillButton title="Mount" role="accent" onPress={mount} />
```

### An app with its own accent

The Swift package ships one system-blue accent because its apps are desktop
tools. An app that lets the user pick an accent passes it through, and every
other token stays canonical:

```tsx
<TuganeDesignProvider theme={theme} accent="#3D4DE0">
```

## Conventions the components assume

- **Committed theming.** Apps carry their own light/dark toggle and pass the
  palette down. Nothing in this package calls `useColorScheme()`, so an in-app
  theme cannot disagree with what is drawn.
- **Explicit type.** Sizes are set in points, not semantic styles, so a card
  title is the same size in every app.
- **Pills never wrap.** A pill states an action and keeps its intrinsic width;
  the surrounding layout gives way.

## What changed on the way over, and why

The two packages are the same language, but a phone is not a Mac. Four
deliberate differences:

| Swift | React Native | Why |
| --- | --- | --- |
| Hover drives `*Hover` tokens | **Press** drives them | Touch has no hover. Same tokens, same two-state feel. |
| `hoverPointer`, `PointerButtonStyle`, `hoverCursor` | *dropped* | Cursor APIs with no touch equivalent. |
| SF Symbols named directly | An **`IconRenderer`** you wire up once | React Native ships no symbol set, and this package will not pick one for you. `Chevron` and `CheckBox` are drawn from plain views, so the core works with no icon library at all. |
| 36pt pill is a fine click target | 36pt pill, **44pt touch target** via `hitSlop` | iOS wants 44pt. The pill keeps its *look* and grows only its *touch* area — the language should not get chunkier just because it moved to a phone. |

There is deliberately **no spacing scale**: the Swift package has none either,
and sets padding per view. Adding one here would invent vocabulary the language
does not have.

## Requirements

React Native 0.76+ (`mixBlendMode` and `filter` are used by `NoiseOverlay` and
`PageBackdrop`), React 18+.

On Android, `filter: blur` goes through RenderEffect, so on API < 31 the
`PageBackdrop` glyph renders crisp rather than blurred. Everything else is
identical across platforms.

## Keeping the two in sync

`scripts/verify-palette.py` diffs `src/theme.ts` against the Swift
`Theme.swift` and fails on any drift. Run it after touching either side.

```bash
python3 scripts/verify-palette.py
```

## License

GPL-3.0-or-later, same as the Swift package. See [LICENSE](LICENSE) and
[COPYRIGHT](COPYRIGHT).
