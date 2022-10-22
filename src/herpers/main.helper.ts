const CHARACTER =
  "AZERTYUIOPQSDFGHJKLMWXCVBNazertyuiopqsdfghjklmwxcvbn1234567890";
const NUMBERCHARACTER = "1234567890";

export const genCode = (length: number) => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARACTER.charAt(Math.floor(Math.random() * CHARACTER.length));
  }
  return code;
};

export const genPin = (length: number) => {
  let pin = "";
  for (let i = 0; i < length; i++) {
    pin += NUMBERCHARACTER.charAt(
      Math.floor(Math.random() * NUMBERCHARACTER.length)
    );
  }
  return pin;
};

export const generateCode = (prefix: string) =>
  `${prefix}-${Date.now().toString()}-${genCode(5)}`;

export const generateDefaultPassword = genCode(6);

export const generateToken = () => genCode(6);

export const generatePin = () => `${genCode(3)} ${genCode(3)}`;

export enum ErrorMessages {
  INTERNAL_SERVER_ERROR = "Une erreur serveur est survenue",
}

/* export const getDefaultUserInfos = (user: any) => ({
  code: user.code,
  firstName: user.firstName,
  lastName: user.lastName,
  photo: user.photo,
  history: user.history,
  role: user.role,
  university: user.university || "",
  school: user.school || "",
  birthDay: user.birthDay,
  email: user.email,
  phoneNumber: user.phoneNumber,
  createdAt: user.createdAt,
  lastUpdatedAt: user.lastUpdatedAt,
  academic_year: user.acedemic_year,
  isDeleted: user.isDeleted,
  isActiveAccount: user.isActiveAccount,
  documents: user.documents,
}); */

/* export enum EDocumentTypes {
  EXTRAIT = "EXTRAIT",
  CNI = "CNI",
} */
