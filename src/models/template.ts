export interface Template {
  templateName: string;
  key: string;
  receiverPhonesWithVars?: PhoneAndVars[];
  receiverPhones?: string[];
  wsIdentifier: string;
  hasVars: boolean;
  language: string;
  createAt: Date;
  updateAt: Date;
}

export interface PhoneAndVars {
  phone: string,
  vars: string[]
}
