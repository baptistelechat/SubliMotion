# US 1.2 - Prévisualisation 3D (Orbit)

**ID:** STORY-002
**Epic:** 1 - Import & Visualisation (Core)
**Status:** Active
**Priority:** High
**Story Points:** 3

## User Story
As a user
I want to rotate the 3D mug freely
So that I can verify the design placement from all angles

## Acceptance Criteria
- [ ] User can orbit around the mug 360 degrees horizontally.
- [ ] User can orbit vertically within reasonable limits (e.g., prevent looking from under the table).
- [ ] Zoom in/out is possible but clamped (min/max distance).
- [ ] Rotation is smooth and damping is enabled.

## Technical Notes
- **Library:** `@react-three/drei` -> `OrbitControls`.
- **Configuration:**
  - `enableDamping={true}`
  - `minDistance={2}`
  - `maxDistance={10}`
  - `maxPolarAngle={Math.PI / 1.5}` (to restrict looking from below)
- **Context:** Ensure controls don't conflict with drag & drop if overlays are used.

## Dependencies
- `@react-three/drei`
- `@react-three/fiber`

## Definition of Done
- [ ] OrbitControls configured and responsive.
- [ ] Zoom limits tested.
- [ ] Vertical angle constraints applied.
