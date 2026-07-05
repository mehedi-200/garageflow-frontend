import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'
import BottomNav from './BottomNav'

const SIDEBAR_KEY = 'garageflow-sidebar-collapsed'

/*
 * The single app shell (CLAUDE.md UI rules 2–3):
 * desktop → thin header + collapsible thin sidebar + thin footer;
 * mobile/tablet → native-app layout with bottom navigation.
 */
export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_KEY) === '1'
  )

  function toggleSidebar() {
    setCollapsed((c) => {
      localStorage.setItem(SIDEBAR_KEY, c ? '0' : '1')
      return !c
    })
  }

  return (
    <div className="flex h-full flex-col">
      <Header />
      <div className="flex min-h-0 flex-1">
        <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
        <main className="min-w-0 flex-1 overflow-y-auto pb-20 md:pb-0">
          <Outlet />
        </main>
      </div>
      <Footer />
      <BottomNav />
    </div>
  )
}
