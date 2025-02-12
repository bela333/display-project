export const CODE_LENGTH = 8;
export const CODE_ALPHABET = "ABCDEFGHIKMNOPRS";
export const CODE_REGEX = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);
export const EXPIRE_SECONDS = 60 * 60 * 24; // 1 calendar day
