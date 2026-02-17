# US 1.3 - Vues Rapides

**ID:** STORY-003
**Epic:** 1 - Import & Visualisation (Core)
**Status:** Active
**Priority:** Medium
**Story Points:** 3

## User Story
As a user
I want quick access buttons to align the camera to key faces (Front, Back, Handle, Top)
So that I can quickly inspect specific areas of my design

## Acceptance Criteria
- [ ] UI buttons for: Front, Back, Left (Handle), Right, Top, Bottom.
- [ ] Clicking a button animates the camera to the corresponding position.
- [ ] Animation is smooth (approx. 0.5s - 1s).
- [ ] The mug remains centered.

## Technical Notes
- **Library:** `CameraControls` from `@react-three/drei` (preferred over OrbitControls for programmatic movement) OR custom GSAP animation on camera position.
- **Implementation:**
  - Store camera positions/quaternions for each view.
  - Use `controls.setLookAt(x, y, z, targetX, targetY, targetZ, true)` for smooth transition.
- **UI:** Shadcn UI buttons in a toolbar overlay.

## Dependencies
- `@react-three/drei` (CameraControls)
- `shadcn/ui` (Button component)

## Definition of Done
- [ ] Buttons implemented in UI.
- [ ] Camera animates correctly to all defined views.
- [ ] Transition is smooth and glitch-free.
