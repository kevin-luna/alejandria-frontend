const PUBLICATION_OUTPUT = {
  name: '',
  type: 'tuple',
  components: [
    { name: 'id', type: 'uint256' },
    { name: 'title', type: 'string' },
    { name: 'authorNames', type: 'string[]' },
    { name: 'authorAddresses', type: 'address[]' },
    { name: 'pubType', type: 'uint8' },
    { name: 'registrationDate', type: 'uint256' },
    { name: 'contentHash', type: 'bytes32' },
    { name: 'institution', type: 'string' },
    { name: 'doi', type: 'string' },
    { name: 'ipfsHash', type: 'string' },
    { name: 'registrant', type: 'address' },
    { name: 'isActive', type: 'bool' },
  ],
} as const;

export const ALEJANDRIA_ABI = [
  {
    name: 'getPublication',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'id', type: 'uint256' }],
    outputs: [PUBLICATION_OUTPUT],
  },
  {
    name: 'getByHash',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'contentHash', type: 'bytes32' }],
    outputs: [PUBLICATION_OUTPUT],
  },
  {
    name: 'getByDoi',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'doi', type: 'string' }],
    outputs: [PUBLICATION_OUTPUT],
  },
  {
    name: 'totalPublications',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'register',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      {
        name: 'p',
        type: 'tuple',
        components: [
          { name: 'title', type: 'string' },
          { name: 'authorNames', type: 'string[]' },
          { name: 'authorAddresses', type: 'address[]' },
          { name: 'pubType', type: 'uint8' },
          { name: 'contentHash', type: 'bytes32' },
          { name: 'institution', type: 'string' },
          { name: 'doi', type: 'string' },
          { name: 'ipfsHash', type: 'string' },
        ],
      },
    ],
    outputs: [{ name: 'id', type: 'uint256' }],
  },
  {
    name: 'PublicationRegistered',
    type: 'event',
    inputs: [
      { name: 'id', type: 'uint256', indexed: true },
      { name: 'registrant', type: 'address', indexed: true },
      { name: 'contentHash', type: 'bytes32', indexed: true },
      { name: 'pubType', type: 'uint8', indexed: false },
    ],
  },
] as const;
