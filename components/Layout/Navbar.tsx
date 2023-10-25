'use client'
import { useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ModalContext } from '../context/ModalContext'
import { CameraIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { LoadingContext } from '../context/LoadingContext'
import { IEvent } from '@/server/model/event'
import StageModal from '@/app/[organization]/[event]/stage/[stage]/components/StageModal'
import { TopNavbarContext } from '../context/TopNavbarContext'
import { arch } from 'os'

export interface Page {
  name: string
  href: string
  icon: JSX.Element
}

const NavBarButton = ({
  isNavVisible,
  setIsNavVisible,
}: {
  isNavVisible: boolean
  setIsNavVisible: React.Dispatch<React.SetStateAction<boolean>>
}) => (
  <button onClick={() => setIsNavVisible(!isNavVisible)} className="lg:hidden md:p-4 absolute top-0 right-0 z-50 mr-16 py-3">
    {!isNavVisible ? (
      <div className="border-2 rounded border-accent text-white bg-accent">
        <Bars3Icon className="w-8 h-8" />
      </div>
    ) : (
      <div className="border-2 border-accent rounded text-white bg-accent">
        <XMarkIcon className="w-8 h-8" />
      </div>
    )}
  </button>
)

export default function Navbar({
  event,
  pages,
  stages,
  archiveMode,
}: {
  archiveMode?: boolean
  event: IEvent
  stages: Page[] | undefined
  pages: {
    name: string
    href: string
    icon: JSX.Element
  }[]
}) {
  const pathname = usePathname()
  const { openModal, closeModal } = useContext(ModalContext)
  const { setLogo, logo, setHomePath } = useContext(TopNavbarContext)
  const { setIsLoading } = useContext(LoadingContext)
  const [isNavVisible, setIsNavVisible] = useState(false) // New state
  const router = useRouter()

  useEffect(() => {
    if (isNavVisible) {
      setIsNavVisible(false)
    }
    setHomePath(`/${event.organizationId}/${event.id}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isNavVisible])

  const handleClick = (stageHref: string) => {
    setIsLoading(true)
    router.push(stageHref)
    closeModal()
  }
  useEffect(() => {
    setLogo('/events/' + event.logo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])

  if (archiveMode) {
    return <></>
  }

  return (
    <div>
      <NavBarButton isNavVisible={isNavVisible} setIsNavVisible={setIsNavVisible} />
      <header
        className={`shadow-sm z-40 bg-base border-r border-primary fixed top-16 lg:top-[70px] left-0 w-[5rem] h-screen ${
          isNavVisible ? 'block' : 'hidden'
        } lg:block`}>
        <div className="flex flex-col items-center justify-between ">
          <nav
            aria-label="Global"
            className={`text-main-text text-center w-full my-1 space-x-0 justify-between gap-3 text-md font-medium flex flex-col `}>
            {pages.map((item) => (
              <Link
                key={item.name}
                className={`py-1 h-full w-full cursor-pointer hover:text-gray-300 ${pathname === item.href && 'bg-accent rounded text-primary'}`}
                href={item.href}>
                <div className="w-6 h-6 lg:w-8 lg:h-8 m-auto p-1">{item.icon}</div>
                <p className="">{item.name}</p>
              </Link>
            ))}
            {stages && stages?.length === 1 ? (
              <div
                onClick={() => handleClick(stages[0].href)}
                className={`py-1 h-full w-full cursor-pointer hover:text-gray-300 ${
                  pathname.includes('/stage/') && 'bg-accent text-primary rounded'
                }`}>
                <div className="w-6 h-6 lg:w-8 lg:h-8 m-auto p-1">
                  <CameraIcon />
                </div>
                stages
              </div>
            ) : stages ? (
              <div
                onClick={() => openModal(<StageModal stages={stages} handleClick={handleClick} />)}
                className={`py-1 h-full w-full cursor-pointer hover:text-gray-300 ${
                  pathname.includes('/stage/') && 'bg-accent text-primary rounded'
                }`}>
                <div className="w-6 h-6 lg:w-8 lg:h-8 m-auto p-1">
                  <CameraIcon />
                </div>
                Streams
              </div>
            ) : null}
          </nav>
        </div>
      </header>
    </div>
  )
}
