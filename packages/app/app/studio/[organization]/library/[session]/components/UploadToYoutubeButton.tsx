'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { uploadSessionToSocialsAction } from '@/lib/actions/sessions';
import { IExtendedOrganization } from '@/lib/types';
import Link from 'next/link';
import React, { useState } from 'react';
import { CiCirclePlus } from 'react-icons/ci';
import { SiYoutube } from 'react-icons/si';
import { toast } from 'sonner';

const UploadToYoutubeButton = ({
  organization,
  organizationSlug,
  sessionId,
}: {
  organization: IExtendedOrganization | null;
  organizationSlug: string;
  sessionId: string;
}) => {
  const [openModal, setOpenModal] = useState(false);
  const [socialId, setSocialId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Encode the redirect URL
  const state = encodeURIComponent(
    JSON.stringify({
      redirectUrl: `/studio/${organizationSlug}/library/${sessionId}`,
      organizationId: organization?._id,
    })
  );
  const authUrl = `/api/google/request?state=${state}`;
  // const handleYoutubeConnect = () => {
  // Calculate window size and position
  // const width = window.innerWidth * 0.7;
  // const height = window.innerHeight * 0.7;
  // const left = window.screen.width / 2 - width / 2;
  // const top = window.screen.height / 2 - height / 2;
  // Open the OAuth URL in a new window
  // window.open(
  //   authUrl,
  //   'YouTube OAuth',
  //   `width=${width},height=${height},top=${top},left=${left}`
  // );
  // };
  const hasSocials = organization?.socials?.length
    ? organization?.socials?.length > 0
    : false;

  const handleYoutubePublish = async () => {
    setIsLoading(true);
    try {
      const response = await uploadSessionToSocialsAction({
        type: 'youtube',
        sessionId,
        organizationId: organization?._id as string,
        socialId,
      });

      if (response.message) {
        toast.error('Error: ' + response.message);
      } else {
        toast.success('Publish request successful');
      }
    } catch (error) {
      toast.error('Error uploading video to YouTube');
    } finally {
      setIsLoading(false);
      setOpenModal(false);
    }
  };

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogTrigger>
        <Button className="min-w-[200px] bg-[#FF0000]">
          <SiYoutube className="mr-2" />
          Publish to Youtube
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[99999999999999999] px-8">
        <p className="font-medium">Select Youtube Destination</p>

        <div className="flex flex-wrap items-center gap-5 py-5">
          {organization?.socials
            ?.filter((s) => s.type == 'youtube')
            .map(({ name, thumbnail, _id }) => (
              <div
                onClick={() => setSocialId(_id!)}
                key={_id}
                className={`flex cursor-pointer flex-col items-center ${
                  socialId == _id ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className="h-14 w-14 cursor-pointer rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${thumbnail})`,
                  }}
                ></div>
                <p className="line-clamp-1 text-sm">{name}</p>
              </div>
            ))}
          <Link
            href={authUrl}
            className="flex cursor-pointer flex-col items-center"
          >
            <CiCirclePlus color="#000" size={56} />
            <p className="text-sm">Add New</p>
          </Link>
        </div>

        <Button
          loading={isLoading}
          onClick={handleYoutubePublish}
          variant="primary"
          disabled={!hasSocials || !socialId}
        >
          Publish
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadToYoutubeButton;
