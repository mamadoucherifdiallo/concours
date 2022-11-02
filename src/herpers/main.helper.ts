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

/* export enum EDocumentTypes {
  EXTRAIT = "EXTRAIT",
  CNI = "CNI",
} */

export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const phoneNumberRegex =
  /^[+]*[0-9]{1,3}[37][305-9][0-9]{3}[0-9]{2}[0-9]{2}$/; // Numéro de téléphone pour le Sénégal

export enum ESocialMedia {
  FACEBOOK = "FACEBOOK",
  WHATSAPP = "WHATSAPP",
  LINKEDIN = "LINKEDIN",
}

export class SocialMedia {
  value: string;
  type: ESocialMedia;
}

export enum EDataToRetrive {
  ACCEPTED = "ACCEPTED",
  CANCELED = "CANCELED",
  REJECTED = "REJECTED",
  PENDING = "PENDING",
  ADMITTED = "ADMITTED",
}

export const getPropToRetrieve = (
  // Utilisé pour ces différentes entités Center, Option, Competition, Institution
  dataToRetrieve: string
) => {
  let arrayToReturn = "";
  switch (dataToRetrieve) {
    case EDataToRetrive.ACCEPTED:
      arrayToReturn = "acceptedApplications";
      break;
    case EDataToRetrive.CANCELED:
      arrayToReturn = "cancelledApplications";
      break;
    case EDataToRetrive.REJECTED:
      arrayToReturn = "rejectedApplications";
      break;
    case EDataToRetrive.PENDING:
      arrayToReturn = "pendingApplicatons";
      break;
    case EDataToRetrive.ADMITTED:
      arrayToReturn = "admittedCandidates";
      break;
    default:
      break;
  }
  return arrayToReturn;
};
