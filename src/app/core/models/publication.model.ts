export enum PublicationType {
  THESIS = 0,
  TESINA = 1,
  ARTICLE = 2,
  JOURNAL = 3,
  PROCEEDINGS = 4,
  BOOK = 5,
  OTHER = 6,
}

export const PUBLICATION_TYPE_LABELS: Record<PublicationType, string> = {
  [PublicationType.THESIS]: 'Tesis Doctoral',
  [PublicationType.TESINA]: 'Tesina',
  [PublicationType.ARTICLE]: 'Artículo',
  [PublicationType.JOURNAL]: 'Revista',
  [PublicationType.PROCEEDINGS]: 'Actas',
  [PublicationType.BOOK]: 'Libro',
  [PublicationType.OTHER]: 'Otro',
};

export interface Publication {
  id: bigint;
  title: string;
  authorNames: readonly string[];
  authorAddresses: readonly `0x${string}`[];
  pubType: number;
  registrationDate: bigint;
  contentHash: `0x${string}`;
  institution: string;
  doi: string;
  ipfsHash: string;
  registrant: `0x${string}`;
  isActive: boolean;
}
