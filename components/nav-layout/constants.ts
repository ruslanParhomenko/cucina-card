export type NAV_BY_PATCH_TYPE = Record<
  string,
  {
    tabs: { label: string; value: string }[];
    selectOptions: boolean;
    actionButton: string[];
  }
>;

export const HOME_NAV_ITEMS = [
  { label: "тех-карты", value: "cards" },
  { label: "материалы", value: "products" },
];

export const CARD_ACTION_BUTTON = [
  "edit",
  "print",
  "exit",
  "delete",
  "reset",
  "save",
];

export const PRODUCT_ACTION_BUTTON = [
  "edit",
  "print",
  "exit",
  "delete",
  "reset",
  "save",
];

export const HOME_ACTION_BUTTON = ["print", "add"];

export const NAV_BY_PATCH = {
  home: {
    tabs: HOME_NAV_ITEMS,
    selectOptions: true,
    actionButton: HOME_ACTION_BUTTON,
  },
  product: {
    tabs: [],
    selectOptions: false,
    actionButton: PRODUCT_ACTION_BUTTON,
  },
  card: { tabs: [], selectOptions: false, actionButton: CARD_ACTION_BUTTON },
} satisfies NAV_BY_PATCH_TYPE;
