import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()
  const { data: estimates } = await supabase.from('estimates').select()

  return <pre>{JSON.stringify(estimates, null, 2)}</pre>
}