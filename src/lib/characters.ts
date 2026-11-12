/** Characters that appear in Typpi. Avatars live in /public/avatars. */
export type Character = {
  name: string;
  shortName: string;
  role: string;
  /** Missing for characters whose image isn't exported yet → initials */
  avatar?: string;
  avatarSquare?: string;
};

export const characters = {
  hana: { name: "Hana", shortName: "Hana", role: "Your guide", avatar: "/avatars/hana.png" },
  yuki: {
    name: "Yuki Tanaka",
    shortName: "Yuki",
    role: "Your manager",
    avatar: "/avatars/yuki.png",
    avatarSquare: "/avatars/yuki-square.png",
  },
  keiko: { name: "Keiko Sato", shortName: "Keiko", role: "Your landlord", avatar: "/avatars/keiko.png" },
  drMori: { name: "Dr. Mori", shortName: "Dr. Mori", role: "Your doctor", avatar: "/avatars/dr-mori.png" },
  ren: { name: "Ren Suzuki", shortName: "Ren", role: "Your colleague", avatar: "/avatars/ren.png" },
  ito: { name: "Mr. Ito", shortName: "Mr. Ito", role: "City hall clerk", avatar: "/avatars/ito.png" },
} satisfies Record<string, Character>;

export type CharacterId = keyof typeof characters;
