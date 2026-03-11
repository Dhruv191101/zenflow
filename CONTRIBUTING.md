# Contributing to ZenFlow

Thank you for considering contributing to ZenFlow! This project welcomes contributions of all kinds.

## How to Contribute

1. **Fork** the repository and create your branch from `main`
2. **Install** dependencies: `cd zenflow-client && npm install`
3. **Make** your changes and test locally with `npm run dev`
4. **Build** to verify: `npm run build`
5. **Submit** a Pull Request with a clear description of what you changed

## Ideas Welcome
- New fidget toy components
- Additional breathwork protocols
- Accessibility improvements
- Performance optimizations
- Mobile-specific UX enhancements

## Code Style
- Functional React components only
- Inline styles preferred (consistent with existing codebase)
- Use `onMouseDown` + `onTouchStart` on canvas elements
- Use `onClick` for navigation (never `onPointerDown`)
- All sounds via Web Audio API (no audio files)

## License
By contributing, you agree that your contributions will be licensed under the MIT License.
