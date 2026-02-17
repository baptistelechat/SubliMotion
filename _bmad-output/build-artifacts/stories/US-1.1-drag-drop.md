# US 1.1 - Drag & Drop Design

**ID:** STORY-001
**Epic:** 1 - Import & Visualisation (Core)
**Status:** Active
**Priority:** High
**Story Points:** 5

## User Story
As a user
I want to drag and drop an image (JPG/PNG) onto the workspace
So that I can instantly apply it to the 3D mug texture

## Acceptance Criteria
- [ ] User can drag an image file from their desktop onto the canvas area.
- [ ] Supported formats: JPG and PNG.
- [ ] The image applies correctly to the mug's texture mapping (UV).
- [ ] An error message appears if the format is unsupported.
- [ ] The texture updates immediately without page reload.

## Technical Notes
- **Library:** `react-dropzone` for handling file input and drag events.
- **3D:** Use `useTexture` hook from `@react-three/drei` or standard `TextureLoader`.
- **State:** Update Zustand store with the new texture URL (create object URL).
- **Validation:** Check file type and size before processing.
- **Optimization:** Resize large images using a hidden Canvas API if > 2048px to prevent WebGL context loss.

## Dependencies
- `react-dropzone`
- `zustand` (for global state)
- Base 3D Mug Model (`.glb` with correct UVs)

## Definition of Done
- [ ] Code complete and linted.
- [ ] Drag & drop works seamlessly.
- [ ] Error handling for invalid files implemented.
- [ ] Tested with various aspect ratios.
