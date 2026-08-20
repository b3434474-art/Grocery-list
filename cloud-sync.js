(() => {
  const sb = window.grocerySupabase;
  if (!sb) return;
  const LOCAL_KEY = 'grocery-assistant-v1';
  let user = null;
  let remoteListId = null;
  let syncing = false;
  let lastSnapshot = '';

  const $ = id => document.getElementById(id);
  const status = (text, ok = false) => {
    const el = $('cloudStatus');
    if (el) el.textContent = text;
    const btn = $('cloudAuthBtn');
    if (btn) btn.textContent = user ? 'Sign out' : 'Sign in';
    if (el) el.dataset.ok = ok ? 'true' : 'false';
  };

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); }
    catch { return { items: [] }; }
  }
  function writeLocal(next) {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    if (typeof window.render === 'function') window.render();
  }

  async function ensureList() {
    const { data: lists, error } = await sb.from('grocery_lists').select('id,name').order('created_at').limit(1);
    if (error) throw error;
    if (lists?.length) { remoteListId = lists[0].id; return remoteListId; }
    const { data: newId, error: rpcError } = await sb.rpc('create_default_grocery_list');
    if (rpcError) throw rpcError;
    remoteListId = newId;
    return remoteListId;
  }

  function toRemote(item) {
    return {
      id: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.id) ? item.id : undefined,
      list_id: remoteListId,
      name: item.name,
      quantity: Number(item.qty) || 1,
      unit: item.unit || null,
      category: item.category || 'Pantry',
      notes: item.notes || null,
      brand: item.brand || null,
      price: item.price === '' || item.price == null ? null : Number(item.price),
      favorite: !!item.favorite,
      bought: !!item.bought,
      position: Number(item.position) || 0,
      created_at: item.created ? new Date(item.created).toISOString() : undefined
    };
  }

  function fromRemote(row) {
    return {
      id: row.id,
      name: row.name,
      qty: Number(row.quantity) || 1,
      unit: row.unit || '',
      category: row.category || 'Pantry',
      price: row.price == null ? '' : String(row.price),
      brand: row.brand || '',
      notes: row.notes || '',
      favorite: !!row.favorite,
      bought: !!row.bought,
      created: new Date(row.created_at).getTime(),
      position: row.position || 0
    };
  }

  async function pullRemote() {
    if (!user || !remoteListId) return;
    const { data: rows, error } = await sb.from('grocery_items').select('*').eq('list_id', remoteListId).order('position').order('created_at');
    if (error) throw error;
    const local = readLocal();
    local.items = (rows || []).map(fromRemote);
    lastSnapshot = JSON.stringify(local.items);
    writeLocal(local);
  }

  async function pushLocal() {
    if (!user || !remoteListId || syncing) return;
    const local = readLocal();
    const items = Array.isArray(local.items) ? local.items : [];
    syncing = true;
    try {
      const rows = items.map(toRemote);
      const realRows = rows.map(r => { const copy = { ...r }; if (!copy.id) delete copy.id; if (!copy.created_at) delete copy.created_at; return copy; });
      const { data: upserted, error } = await sb.from('grocery_items').upsert(realRows, { onConflict: 'id' }).select('*');
      if (error) throw error;
      const remoteIds = new Set((upserted || []).map(r => r.id));
      const oldIds = items.map(i => i.id).filter(id => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id));
      const staleIds = oldIds.filter(id => !remoteIds.has(id));
      if (staleIds.length) await sb.from('grocery_items').delete().in('id', staleIds).eq('list_id', remoteListId);
      const normalized = (upserted || []).map(fromRemote);
      local.items = normalized;
      lastSnapshot = JSON.stringify(normalized);
      writeLocal(local);
      status('Synced just now ✓', true);
    } catch (err) {
      console.error('Cloud sync failed:', err);
      status('Sync error — keeping local data');
    } finally { syncing = false; }
  }

  async function start() {
    const { data: sessionData } = await sb.auth.getSession();
    user = sessionData?.session?.user || null;
    if (!user) { status('Local-only mode'); return; }
    status('Connecting…');
    try {
      await ensureList();
      const local = readLocal();
      const { count, error } = await sb.from('grocery_items').select('*', { count: 'exact', head: true }).eq('list_id', remoteListId);
      if (error) throw error;
      if ((count || 0) === 0 && (local.items || []).length) await pushLocal();
      else await pullRemote();
      sb.channel('grocery-items-sync')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'grocery_items', filter: `list_id=eq.${remoteListId}` }, async () => {
          if (!syncing) await pullRemote().catch(console.error);
        }).subscribe();
      status('Cloud sync on ✓', true);
    } catch (err) {
      console.error(err);
      status('Could not connect — local mode');
    }
  }

  async function signIn() {
    const email = $('cloudEmail')?.value.trim();
    if (!email) { status('Enter your email first'); $('cloudEmail')?.focus(); return; }
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await sb.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    if (error) { status(error.message); return; }
    status('Check your email for the sign-in link ✉️');
  }

  async function signOut() {
    await sb.auth.signOut();
    user = null; remoteListId = null;
    status('Signed out — local mode');
  }

  $('cloudAuthBtn')?.addEventListener('click', () => user ? signOut() : signIn());
  sb.auth.onAuthStateChange((_event, session) => {
    user = session?.user || null;
    if (user) start(); else status('Local-only mode');
  });

  setInterval(() => {
    if (!user || syncing) return;
    const local = readLocal();
    const snapshot = JSON.stringify(local.items || []);
    if (snapshot !== lastSnapshot) pushLocal();
  }, 1500);

  start();
})();
