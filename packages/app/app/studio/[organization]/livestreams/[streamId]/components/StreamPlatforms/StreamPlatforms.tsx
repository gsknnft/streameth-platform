import React, { useState } from 'react';
import { SiX, SiYoutube } from 'react-icons/si';
import { Radio } from 'lucide-react';
import CreateCustomStream from './forms/CustomRtmpForm';
import NotFound from '@/app/not-found';
import CreateYoutubeStream from './CreateYoutubeStream';
import { IExtendedOrganization, IExtendedStage } from '@/lib/types';
import { TargetOutput } from 'streameth-new-server/src/interfaces/stage.interface';

interface StreamTargetItem {
  title: string;
  icon: JSX.Element;
  onClick?: () => JSX.Element;
}
const Block = ({
  index,
  item,
  handleClick,
}: {
  index: number;
  item: StreamTargetItem;
  handleClick: () => void;
}) => {
  return (
    <div
      key={index}
      className="flex flex-col items-center justify-between rounded bg-white py-4 shadow transition-colors hover:cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <span className="my-auto">{item.icon}</span>
      <span className="text-black">{item.title}</span>
    </div>
  );
};

const StreamPlatformGrid = ({
  streamId,
  organizationId,
  setIsOpen,
  organization,
  stageId,
  streamTargets,
}: {
  streamId?: string;
  organizationId?: string;
  setIsOpen: (open: boolean) => void;
  organization: IExtendedOrganization;
  stageId: string;
  streamTargets: TargetOutput[];
}) => {
  const [SelectedComponent, setSelectedComponent] =
    useState<JSX.Element | null>(null);

  if (!streamId || !organizationId) {
    return NotFound();
  }

  const StreamTarget: StreamTargetItem[] = [
    // {
    //   title: 'X (WIP)',
    //   icon: <SiX size={35} />,
    // },
    {
      title: 'YouTube',
      icon: <SiYoutube size={45} color="#ff0000" />,
      onClick: () => (
        <CreateYoutubeStream
          stageId={stageId}
          organization={organization}
          setIsOpen={setIsOpen}
          streamTargets={streamTargets}
        />
      ),
    },
    {
      title: 'Custom RTMP',
      icon: <Radio size={50} />,
      onClick: () => (
        <CreateCustomStream
          streamId={streamId}
          organizationId={organizationId}
          setIsOpen={setIsOpen}
        />
      ),
    },
  ];

  const handleBlockClick = (item: StreamTargetItem) => {
    if (item.onClick) {
      setSelectedComponent(item.onClick());
    }
  };

  return (
    <div>
      {SelectedComponent ? (
        SelectedComponent
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {StreamTarget.map((item, index) => (
            <Block
              key={index}
              index={index}
              item={item}
              handleClick={() => handleBlockClick(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StreamPlatformGrid;
