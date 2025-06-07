import { Header } from '@/components/Header';
import { Outlet } from 'react-router-dom';
import { DisclaimerBanner } from './DisclaimerBanner';

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="bg-background">
      <DisclaimerBanner />

        <Outlet />
      </main>
    </div>
  );
}