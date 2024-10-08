'use server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import {
  createNFTCollection,
  generateNFTCollectionMetadata,
  updateNFTCollection,
} from '../services/nftCollectionService';
import { IExtendedNftCollections } from '../types';
import { INftCollection } from 'streameth-new-server/src/interfaces/nft.collection.interface';

export const createNFTCollectionAction = async ({
  nftCollection,
}: {
  nftCollection: INftCollection;
}) => {
  const response = await createNFTCollection({
    nftCollection: nftCollection,
  });

  if (!response) {
    throw new Error('Error creating NFt Collection');
  }
  revalidatePath('/studio');

  return response;
};

export const updateNFTCollectionAction = async ({
  collection,
}: {
  collection: IExtendedNftCollections;
}) => {
  const response = await updateNFTCollection({
    collection: { ...collection },
  });
  if (!response) {
    throw new Error('Error updating collection');
  }
  revalidatePath('/studio');
  return response;
};

export const generateNFTCollectionMetadataAction = async ({
  nftCollection,
}: {
  nftCollection: INftCollection;
}) => {
  const response = await generateNFTCollectionMetadata({
    nftCollection: nftCollection,
  });

  if (!response) {
    throw new Error('Error creating NFt Collection');
  }
  revalidatePath('/studio');

  return response;
};
