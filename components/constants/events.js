export const EVENTS = {
  MOUSE: {
    LEFT: 0,
    MIDDLE: 1,
    RIGHT: 2,
  },
  KEYS: {
    ESCAPE: 'Escape',
    DELETE: 'Delete',
    BACKSPACE: 'Backspace',
    CTRL: 'Control',
    SHIFT: 'Shift',
    ALT: 'Alt',
    TAB: 'Tab',
    ENTER: 'Enter',
    SPACE: ' ',
  },
};

export const SHORTCUTS = {
  UNDO: { key: 'z', ctrl: true },
  REDO: { key: 'z', ctrl: true, shift: true },
  SAVE: { key: 's', ctrl: true },
  CLEAR: { key: 'c', ctrl: true, shift: true },
  RESET_VIEW: { key: 'r', ctrl: true },
  TOGGLE_GRID: { key: 'g', ctrl: true },
  TOGGLE_ERASER: { key: 'e' },
  TOGGLE_TOOLBAR: { key: 'Tab' },
}; 