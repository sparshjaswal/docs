import SidebarToggle from '@site/src/components/SidebarToggle';
import type { Props } from '@theme/DocSidebar/Desktop/CollapseButton';

export default function CollapseButton({ onClick }: Props) {
  return <SidebarToggle expanded onClick={onClick} />;
}
