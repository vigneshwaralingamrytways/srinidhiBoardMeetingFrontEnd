
export const themes = {
  dark: {
    bg:           "#0D1117",
    sidebar:      "#0A0E14",
    card:         "#111827",
    cardHover:    "#1a2235",
    border:       "#1E2D42",
    accent:       "#C9A84C",
    accentSoft:   "rgba(201,168,76,0.15)",
    text:         "#E8EAF0",
    textMuted:    "#6B7FA0",
    textDim:      "#4A5A75",
    input:        "#0D1B2A",
    inputBorder:  "#1E3050",
    headerBg:     "#0A0E14",
    calDayBg:     "#111827",
    calDayHover:  "#1a2235",
    tooltipBg:    "#1a2235",
    shadow:       "0 4px 24px rgba(0,0,0,0.4)",
    modalBg:      "#0D1B2A",
  },
  light: {
    bg:           "#F5F3EE",
    sidebar:      "#FFFDF8",
    card:         "#FFFFFF",
    cardHover:    "#FFF8EC",
    border:       "#E8E0CE",
    accent:       "#B8922A",
    accentSoft:   "rgba(184,146,42,0.12)",
    text:         "#1C1A14",
    textMuted:    "#7A6E56",
    textDim:      "#B0A890",
    input:        "#FAFAF5",
    inputBorder:  "#D4C9A8",
    headerBg:     "#FFFDF8",
    calDayBg:     "#FFFFFF",
    calDayHover:  "#FFF8EC",
    tooltipBg:    "#FFFFFF",
    shadow:       "0 4px 24px rgba(184,146,42,0.10)",
    modalBg:      "#FAFAF5",
  },
};

// -- Reusable Style Factories ----------------------------------

/** Primary action button */
export const btnPrimary = (t) => ({
  background:     t.accent,
  border:         "none",
  borderRadius:   8,
  color:          "#fff",
  fontWeight:     600,
  cursor:         "pointer",
  display:        "inline-flex",
  alignItems:     "center",
  justifyContent: "center",
  gap:            6,
  fontFamily:     "inherit",
});

/** Ghost / outline button */
export const btnGhost = (t) => ({
  background:   "transparent",
  border:       `1.5px solid ${t.border}`,
  borderRadius: 8,
  color:        t.textMuted,
  fontWeight:   500,
  cursor:       "pointer",
  fontFamily:   "inherit",
});

/** Standard text input */
export const inputBase = (t, hasError = false) => ({
  width:        "100%",
  padding:      "10px 14px",
  background:   t.input,
  border:       `1.5px solid ${hasError ? "#e74c3c" : t.inputBorder}`,
  borderRadius: 8,
  color:        t.text,
  fontSize:     14,
  boxSizing:    "border-box",
  outline:      "none",
  fontFamily:   "inherit",
});

/** Dropdown / select */
export const selectBase = (t) => ({
  ...inputBase(t),
  appearance: "none",
  cursor:     "pointer",
});

/** Section label above form fields */
export const fieldLabel = (t) => ({
  fontSize:      12,
  color:         t.textMuted,
  textTransform: "uppercase",
  letterSpacing: 1,
  marginBottom:  6,
  display:       "block",
});

/** Rounded card container */
export const card = (t, extraBorder) => ({
  background:   t.card,
  border:       `1px solid ${extraBorder || t.border}`,
  borderRadius: 16,
  boxShadow:    t.shadow,
});

/** Amenity / tag pill */
export const tagPill = (t) => ({
  fontSize:     11,
  color:        t.textMuted,
  background:   t.accentSoft,
  borderRadius: 4,
  padding:      "2px 8px",
});

/** Error message below input */
export const errorMsg = {
  color:     "#e74c3c",
  fontSize:  12,
  marginTop: 4,
};

/** Overlay backdrop */
export const modalOverlay = {
  position:       "fixed",
  inset:          0,
  background:     "rgba(0,0,0,0.65)",
  zIndex:         200,
  display:        "flex",
  alignItems:     "center",
  justifyContent: "center",
  padding:        "16px",
};
