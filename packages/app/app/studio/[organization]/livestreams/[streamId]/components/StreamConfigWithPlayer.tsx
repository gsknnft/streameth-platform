'use client';
import React, { useEffect, useState } from 'react';
import CopyText from '../../../../../../components/misc/CopyText';
import { IExtendedStage } from '@/lib/types';
import { fetchStage } from '@/lib/services/stageService';
import dynamic from 'next/dynamic';
import VideoCardSkeleton from '@/components/misc/VideoCard/VideoCardSkeleton';

const ClientSidePlayer = dynamic(() => import('./ClientSidePlayer'), {
  ssr: false,
});

const StreamConfigWithPlayer = ({
  stream,
  streamId,
  organization,
}: {
  stream: IExtendedStage;
  streamId: string;
  organization: string;
}) => {
  const [isLive, setIsLive] = useState(stream?.streamSettings?.isActive);

  const checkIsLive = async () => {
    try {
      const res = await fetchStage({ stage: stream._id as string });
      setIsLive(res?.streamSettings?.isActive);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (stream?.streamSettings?.isActive) {
      return;
    }

    const interval = setInterval(() => {
      checkIsLive();
    }, 5000);
  }, [stream?.streamSettings?.isActive]);

  return (
    <>
      <div className="aspect-video w-full ">
        {!isLive ? (
          <div className="flex h-full w-full flex-col items-center justify-center rounded-lg bg-black p-4 text-white">
            <h3 className="mb-2 text-center text-3xl font-semibold lg:text-4xl">
              Connect your Streaming providers
            </h3>
            <p className="mb-6 text-center text-lg lg:w-3/4">
              Copy and paste the stream key into your streaming software. Use
              either the RTMP or SRT ingest, depending on your use-case. The
              RTMP ingest is more common with OBS users
            </p>
            <div className="flex flex-col gap-3">
              <CopyText
                label="RTMP Ingest"
                text="rtmp://rtmp.livepeer.com/live"
              />
              <CopyText
                label="Stream key"
                text={stream?.streamSettings?.streamKey}
              />
            </div>
          </div>
        ) : (
          <div className="aspect-video w-full ">
            <ClientSidePlayer
              name={stream.name || 'Live Stream'}
              thumbnail=""
              src={[
                {
                  src: `https://livepeercdn.studio/hls/${stream?.streamSettings?.playbackId}/index.m3u8`,
                  width: 1920,
                  height: 1080,
                  mime: 'application/vnd.apple.mpegurl',
                  type: 'hls',
                },
              ]}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default StreamConfigWithPlayer;
