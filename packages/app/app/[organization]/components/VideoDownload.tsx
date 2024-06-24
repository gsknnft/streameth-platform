import { Livepeer } from 'livepeer'
import { LuDownload } from 'react-icons/lu'
import { Button } from '@/components/ui/button'

const VideoDownload = async ({ assetId }: { assetId: string }) => {
  const livepeer = new Livepeer({
    apiKey: process.env.LIVEPEER_API_KEY,
  })

  if (!assetId) return null

  const asset = (await livepeer.asset.get(assetId)).asset

  if (!asset) return null

  return (
    <a
      href={asset.downloadUrl}
      download={asset.name}
      target="_blank"
      className="flex justify-center items-center">
      <Button className="bg-white" variant="outline">
        <LuDownload size={24} className="p-1 cursor-pointer" />
        LuDownload
      </Button>
    </a>
  )
}

export default VideoDownload
