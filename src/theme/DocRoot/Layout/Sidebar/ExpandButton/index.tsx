import SidebarToggle from '@site/src/components/SidebarToggle';
import type { Props } from '@theme/DocRoot/Layout/Sidebar/ExpandButton';

export default function ExpandButton({ toggleSidebar }: Props) {
  return <SidebarToggle expanded={false} onClick={toggleSidebar} />;
}
