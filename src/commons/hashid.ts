import Hashids from 'hashids';

const hashids = new Hashids('stokkers-segredo-super-secreto', 8); 

export const encodeId = (id: number): string => {
  return hashids.encode(id);
};

export const decodeId = (hash: string): number | undefined => {
  const decoded = hashids.decode(hash);
  return decoded.length > 0 ? Number(decoded[0]) : undefined;
};