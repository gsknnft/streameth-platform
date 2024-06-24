'use client'

import { SidebarUI, SidebarItem } from './Sidebar'
import {
  LuVideotape,
  LuRadio,
  LuScissorsLineDashed,
  LuHome,
  LuImage,
  LuSettings,
} from 'react-icons/lu'

const navigationItems = [
  {
    text: 'Home',
    navigationPath: '',
    icon: <LuHome size={20} />,
  },
  // {
  //   text: 'Events',
  //   navigationPath: '/events',
  //   icon: <CalendarDays size={20} />,
  // },
  {
    text: 'Library',
    navigationPath: '/library',
    icon: <LuVideotape size={20} />,
  },
  {
    text: 'Livestreams',
    navigationPath: '/livestreams',
    icon: <LuRadio size={20} />,
  },
  {
    text: 'Clips',
    navigationPath: '/clips',
    icon: <LuScissorsLineDashed size={20} />,
  },
  {
    text: 'Mint NFT',
    navigationPath: '/nfts',
    icon: <LuImage size={20} />,
  },
  {
    text: 'LuSettings',
    navigationPath: '/settings',
    icon: <LuSettings />,
  },
]

const SidebarMenu = ({
  organizationSlug,
}: {
  organizationSlug: string
}) => {
  return (
    <div className="relative w-[1/4]">
      <SidebarUI>
        {navigationItems.map((item, index) => (
          <SidebarItem
            key={index}
            navigationPath={`/studio/${organizationSlug}${item.navigationPath}`}
            text={item.text}
            icon={item.icon}
          />
        ))}
      </SidebarUI>
    </div>
  )
}

export default SidebarMenu
