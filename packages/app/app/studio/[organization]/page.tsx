'use server';

import { Loading } from './livestreams/page';
import { IExtendedStage, LivestreamPageParams, eSort } from '@/lib/types';
import CreateLivestreamModal from './livestreams/components/CreateLivestreamModal';
import { Suspense } from 'react';
import { fetchOrganization } from '@/lib/services/organizationService';
import LivestreamTable from './livestreams/components/LivestreamTable';
import { notFound } from 'next/navigation';
import { sortArray } from '@/lib/utils/utils';
import { fetchOrganizationStages } from '@/lib/services/stageService';
import UploadVideoDialog from './library/components/UploadVideoDialog';
import ImportSchedule from './livestreams/components/ImportSchedule';
import { Button } from '@/components/ui/button';
import { FaFileImport, FaHandScissors } from 'react-icons/fa';
import { ScissorsLineDashed } from 'lucide-react';
import Link from 'next/link';
const OrganizationPage = async ({
  params,
  searchParams,
}: LivestreamPageParams) => {
  const organization = await fetchOrganization({
    organizationSlug: params.organization,
  });

  if (!organization) return notFound();

  const stages = await fetchOrganizationStages({
    organizationId: organization._id,
  });

  const sortedStages = sortArray(
    stages,
    searchParams.sort
  ) as unknown as IExtendedStage[];

  return (
    <div className="flex h-full w-full flex-col p-4">
      <div className="flex max-h-[200px] w-full flex-col">
        <h2 className="text-lg font-bold">Create</h2>
        <div className="md flex max-w-5xl items-center gap-4 py-4">
          <CreateLivestreamModal
            show={searchParams?.show}
            organization={organization}
          />
          <UploadVideoDialog organizationId={organization._id.toString()} />
          {/* Clip Content Button*/}
          <Link href={`/studio/${organization.slug}/clips`}>
            <Button
              variant={'outline'}
              className="flex h-auto w-fit flex-row items-center justify-start space-x-4 rounded-xl border bg-white p-2 pr-4"
            >
              <div className="rounded-xl border bg-primary p-4 text-white">
                <ScissorsLineDashed size={25} />
              </div>
              <span className="text-sm">Clip Content</span>
            </Button>
          </Link>
          {/* End Clip Content Button */}
        </div>
      </div>
      <div className="flex h-[80%] flex-col">
        <p className="py-4 text-lg font-bold">Livestreams</p>
        <Suspense key={searchParams.toString()} fallback={<Loading />}>
          <LivestreamTable
            organizationSlug={params?.organization}
            streams={sortedStages}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default OrganizationPage;
