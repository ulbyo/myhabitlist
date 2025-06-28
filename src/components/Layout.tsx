import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <Navigation />
    </div>
  )
}