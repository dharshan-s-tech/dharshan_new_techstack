'use server';

import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function deleteRecord(table: string, id: any, editBase: string) {
  try {
    const session = await auth();
    
    const res = await fetch(`http://127.0.0.1:8000/api/admin/crud?table=${table}&id=${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      const errData = await res.json();
      return { error: errData.error || 'Cannot delete this record.' };
    }

    revalidatePath(editBase);
    return { success: true };
  } catch (err: any) {
    console.error('Delete error:', err);
    return { error: 'Cannot delete this record because it is referenced by other data.' };
  }
}
