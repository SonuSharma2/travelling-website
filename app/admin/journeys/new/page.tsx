import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import JourneyForm from '@/components/admin/JourneyForm';

export default async function NewJourneyPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div>
      <JourneyForm />
    </div>
  );
}
