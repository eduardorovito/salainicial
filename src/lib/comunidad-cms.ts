import { createClient } from '@supabase/supabase-js';
import { paises, tiposAporte } from './comunidad';

type Aporte = {
  id: string; kind: string; country: string | null; title: string; body: string;
  state: string; review_note: string | null; author: string; certified: boolean;
  average: number | null; votes: number;
};
type Usuario = {
  id: string; email: string; display_name: string | null;
  country: string | null; certified_at: string | null; confirmed_at: string | null;
};

const estados: Record<string, string> = {
  borrador: 'Borrador', revision: 'En revisión', publicado: 'Publicado', devuelto: 'Necesita cambios',
};
const client = () => createClient(import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY, { auth: { flowType: 'pkce' } });
const paisDe = (id: string | null) => paises.find((p) => p.id === id)?.nombre ?? 'General';
const tipoDe = (id: string) => tiposAporte.find((p) => p.id === id)?.nombre ?? 'Aporte';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', cls = '') {
  const element = document.createElement(tag);
  element.textContent = text;
  element.className = cls;
  return element;
}

function card(title: string, meta: string, body?: string) {
  const article = el('article', '', 'cms-card cms-stack');
  article.append(el('h3', title), el('p', meta, 'cms-meta'));
  if (body) {
    const text = el('p');
    const links = /https?:\/\/[^\s<>]+/g;
    let previous = 0;
    for (const match of body.matchAll(links)) {
      text.append(body.slice(previous, match.index));
      const link = el('a', match[0]);
      link.href = match[0];
      link.rel = 'ugc nofollow noopener noreferrer';
      text.append(link);
      previous = match.index + match[0].length;
    }
    text.append(body.slice(previous));
    article.append(text);
  }
  return article;
}

function action(label: string) {
  const button = el('button', label, 'button button--quiet');
  button.type = 'button';
  return button;
}

function handleSubmit(form: HTMLFormElement, handler: (data: FormData) => Promise<void>, status: HTMLElement) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector<HTMLButtonElement>('[type=submit]')!;
    if (button.disabled) return;
    button.disabled = true;
    try { await handler(new FormData(form)); }
    catch { status.textContent = 'No se pudo guardar el cambio. Intenta de nuevo.'; }
    finally { button.disabled = false; }
  });
}

const value = (data: FormData, key: string) => String(data.get(key) ?? '').trim();

export function iniciarCatalogo(root: HTMLElement) {
  const db = client();
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const list = root.querySelector<HTMLElement>('[data-results]')!;
  const country = root.querySelector<HTMLSelectElement>('[data-country]')!;
  const type = root.querySelector<HTMLSelectElement>('[data-kind]')!;
  const more = root.querySelector<HTMLButtonElement>('[data-more]')!;
  let offset = 0;
  let request = 0;

  async function load(reset = true) {
    const version = ++request;
    if (reset) offset = 0;
    const from = offset;
    status.textContent = 'Cargando aportes…';
    more.disabled = true;
    const { data, error } = await db.rpc('community_catalog', {
      p_country: country.value || null, p_kind: type.value || null, p_offset: from,
    });
    if (version !== request) return;
    if (error) {
      more.disabled = false;
      status.textContent = 'No pudimos cargar los aportes. Vuelve a intentarlo.';
      return;
    }
    if (reset) list.replaceChildren();
    const items = (data ?? []) as Aporte[];
    const { data: auth } = await db.auth.getSession();
    if (version !== request) return;
    const ratings = auth.session && items.length
      ? await db.from('community_ratings').select('contribution_id,score').in('contribution_id', items.map((a) => a.id))
      : null;
    if (version !== request) return;
    const myRatings = new Map((ratings?.data ?? []).map((r) => [r.contribution_id, r.score]));

    for (const item of items) {
      const article = card(item.title,
        [tipoDe(item.kind), paisDe(item.country), item.author, item.certified ? 'Perfil certificado' : ''].filter(Boolean).join(' · '),
        item.body);
      const ratingSummary = el('p', item.votes
        ? `${item.average} / 5 · ${item.votes} ${item.votes === 1 ? 'valoración' : 'valoraciones'}`
        : 'Aún no tiene valoraciones.', 'cms-meta');
      article.append(ratingSummary);
      if (auth.session) {
        const form = el('form', '', 'cms-row');
        form.method = 'post';
        const label = el('label', 'Tu valoración', 'cms-field');
        const select = el('select');
        select.name = 'score';
        select.required = true;
        const placeholder = el('option', 'Elige una puntuación');
        placeholder.value = '';
        select.add(placeholder);
        for (let score = 1; score <= 5; score++) {
          const option = el('option', `${score} de 5`);
          option.value = String(score);
          select.add(option);
        }
        select.value = String(myRatings.get(item.id) ?? '');
        const save = action('Guardar valoración');
        save.type = 'submit';
        label.append(select);
        form.append(label, save);
        article.append(form);
        handleSubmit(form, async (fields) => {
          const score = Number(value(fields, 'score'));
          const previous = myRatings.get(item.id);
          const insert = previous ? null : await db.from('community_ratings').insert({ contribution_id: item.id, score });
          const result = previous || insert?.error?.code === '23505'
            ? await db.from('community_ratings').update({ score }).eq('contribution_id', item.id).select('score').single()
            : insert;
          if (result?.error) {
            status.textContent = 'Solo puedes valorar aportes publicados de otras personas con una cuenta verificada.';
            return;
          }
          myRatings.set(item.id, score);
          const refreshed = await db.rpc('community_catalog', {
            p_country: country.value || null, p_kind: type.value || null, p_offset: from,
          });
          const updated = (refreshed.data as Aporte[] | null)?.find((entry) => entry.id === item.id);
          if (updated) ratingSummary.textContent =
            `${updated.average} / 5 · ${updated.votes} ${updated.votes === 1 ? 'valoración' : 'valoraciones'}`;
          status.textContent = 'Valoración guardada.';
        }, status);
      }
      list.append(article);
    }
    offset += items.length;
    more.disabled = false;
    more.hidden = items.length < 12;
    status.textContent = list.childElementCount ? '' : 'Todavía no hay aportes publicados con estos filtros.';
  }

  const filters = new URLSearchParams(location.search);
  const requested = filters.get('pais');
  if (paises.some((p) => p.id === requested)) country.value = requested!;
  const requestedType = filters.get('tipo');
  if (tiposAporte.some((entry) => entry.id === requestedType)) type.value = requestedType!;
  country.addEventListener('change', () => {
    const url = new URL(location.href);
    if (country.value) url.searchParams.set('pais', country.value);
    else url.searchParams.delete('pais');
    history.replaceState(null, '', url);
    void load();
  });
  type.addEventListener('change', () => {
    const url = new URL(location.href);
    if (type.value) url.searchParams.set('tipo', type.value);
    else url.searchParams.delete('tipo');
    history.replaceState(null, '', url);
    void load();
  });
  more.addEventListener('click', () => void load(false));
  void load();
}

export function iniciarPanel(root: HTMLElement) {
  const db = client();
  const q = <T extends HTMLElement>(name: string) => root.querySelector<T>(`[data-${name}]`)!;
  const status = q('status');
  const member = q('member');
  const admin = q('admin');
  const profile = q<HTMLFormElement>('profile');
  const editor = q('editor');
  const draft = q<HTMLFormElement>('draft');
  let userId = '';
  let hasProfile = false;
  let editing = '';
  let draftOffset = 0;
  let userOffset = 0;
  let queueOffset = 0;
  let reportsOffset = 0;

  function setValue(form: HTMLFormElement, key: string, text: string) {
    (form.elements.namedItem(key) as HTMLInputElement).value = text;
  }

  function resetEditor() {
    editing = '';
    draft.reset();
    q('new').hidden = true;
    draft.querySelector('[type=submit]')!.textContent = 'Guardar borrador';
  }

  function withAction(button: HTMLButtonElement, task: () => Promise<void>) {
    button.addEventListener('click', async () => {
      if (button.disabled) return;
      button.disabled = true;
      try { await task(); }
      catch { status.textContent = 'No se pudo completar la acción. Intenta de nuevo.'; }
      finally { button.disabled = false; }
    });
  }

  async function myDrafts(reset = true) {
    const list = q('drafts');
    if (reset) draftOffset = 0;
    const { data, error } = await db.from('community_contributions')
      .select('id,kind,country,title,body,state,review_note').order('created_at', { ascending: false })
      .order('id', { ascending: false }).range(draftOffset, draftOffset + 19);
    if (error) { status.textContent = 'No pudimos cargar tus aportes.'; return; }
    if (reset) list.replaceChildren();
    for (const a of (data ?? []) as Aporte[]) {
      const article = card(a.title, `${estados[a.state]} · ${tipoDe(a.kind)} · ${paisDe(a.country)}`);
      if (a.review_note) article.append(el('p', a.review_note));
      if (['borrador', 'devuelto'].includes(a.state)) {
        const edit = action('Editar');
        edit.addEventListener('click', () => {
          editing = a.id;
          for (const key of ['kind', 'country', 'title', 'body'] as const) setValue(draft, key, a[key] ?? '');
          draft.querySelector('[type=submit]')!.textContent = 'Guardar cambios';
          q('new').hidden = false;
          (draft.elements.namedItem('title') as HTMLInputElement).focus();
        });
        const submit = action('Enviar a revisión');
        withAction(submit, async () => {
          const { error } = await db.rpc('community_submit', { p_id: a.id });
          if (error) { status.textContent = 'Este aporte no se pudo enviar a revisión.'; return; }
          if (editing === a.id) resetEditor();
          await myDrafts();
          status.textContent = 'Enviaste el aporte a revisión.';
        });
        const row = el('div', '', 'cms-row');
        row.append(edit, submit);
        article.append(row);
      }
      list.append(article);
    }
    draftOffset += data?.length ?? 0;
    q('more-drafts').hidden = (data?.length ?? 0) < 20;
    if (!list.childElementCount) list.append(el('p', 'Todavía no tienes aportes.'));
  }

  async function loadUsers(reset = true) {
    const container = q('users');
    if (reset) userOffset = 0;
    const { data, error } = await db.rpc('community_admin_users', { p_offset: userOffset });
    if (error) { status.textContent = 'No pudimos cargar los usuarios.'; return; }
    if (reset) container.replaceChildren();
    for (const user of (data ?? []) as Usuario[]) {
      const article = card(user.display_name || 'Perfil por completar',
        `${user.email} · ${paisDe(user.country)} · ${user.confirmed_at ? 'Correo confirmado' : 'Correo pendiente'}`);
      if (user.display_name && user.confirmed_at) {
        const certification = action(user.certified_at ? 'Retirar certificación' : 'Certificar perfil');
        withAction(certification, async () => {
          const { error } = await db.rpc('community_admin_certify', { p_id: user.id, p_certified: !user.certified_at });
          if (error) { status.textContent = 'No se pudo actualizar la certificación.'; return; }
          await loadUsers();
          status.textContent = 'Certificación actualizada.';
        });
        article.append(certification);
      }
      container.append(article);
    }
    userOffset += data?.length ?? 0;
    q('more-users').hidden = (data?.length ?? 0) < 30;
    if (!container.childElementCount) container.append(el('p', 'Todavía no hay usuarios registrados.'));
  }

  async function loadQueue(reset = true) {
    const container = q('queue');
    if (reset) queueOffset = 0;
    const { data, error } = await db.rpc('community_admin_queue', { p_offset: queueOffset });
    if (error) { status.textContent = 'No pudimos cargar la revisión editorial.'; return; }
    if (reset) container.replaceChildren();
    for (const a of (data ?? []) as Aporte[]) {
      const article = card(a.title, `${a.author} · ${tipoDe(a.kind)} · ${paisDe(a.country)}`, a.body);
      const label = el('label', 'Motivo de devolución', 'cms-field');
      const note = el('textarea');
      note.maxLength = 500;
      note.rows = 2;
      label.append(note);
      const row = el('div', '', 'cms-row');
      for (const publish of [true, false]) {
        const button = action(publish ? 'Publicar' : 'Devolver');
        withAction(button, async () => {
          if (!publish && note.value.trim().length < 2) {
            note.focus();
            status.textContent = 'Escribe un motivo para devolver el aporte.';
            return;
          }
          const { error } = await db.rpc('community_admin_review', {
            p_id: a.id, p_publish: publish, p_note: publish ? null : note.value.trim(),
          });
          if (error) { status.textContent = 'El aporte no se pudo revisar o ya fue revisado.'; return; }
          await loadQueue();
          status.textContent = publish ? 'Aporte publicado.' : 'Aporte devuelto a la persona autora.';
        });
        row.append(button);
      }
      article.append(label, row);
      container.append(article);
    }
    queueOffset += data?.length ?? 0;
    q('more-review').hidden = (data?.length ?? 0) < 30;
    if (!container.childElementCount) container.append(el('p', 'No hay aportes pendientes de revisión.'));
  }

  async function loadReports(reset = true) {
    const container = q('reports');
    if (reset) reportsOffset = 0;
    const { data, error } = await db.rpc('community_admin_reports', { p_offset: reportsOffset });
    if (error) { status.textContent = 'No pudimos cargar los reportes del foro.'; return; }
    if (reset) container.replaceChildren();
    for (const report of (data ?? []) as Pick<Aporte, 'id' | 'title' | 'body' | 'author'>[]) {
      const article = card(report.title, report.author, report.body);
      const row = el('div', '', 'cms-row');
      for (const hide of [true, false]) {
        const button = action(hide ? 'Ocultar del foro' : 'Cerrar reporte');
        withAction(button, async () => {
          const { error } = await db.rpc('community_admin_resolve', { p_id: report.id, p_hide: hide });
          if (error) { status.textContent = 'El reporte no se pudo actualizar.'; return; }
          await loadReports();
          status.textContent = hide ? 'Contenido ocultado del foro.' : 'Reporte cerrado.';
        });
        row.append(button);
      }
      article.append(row);
      container.append(article);
    }
    reportsOffset += data?.length ?? 0;
    q('more-reports').hidden = (data?.length ?? 0) < 30;
    if (!container.childElementCount) container.append(el('p', 'No hay reportes pendientes.'));
  }

  handleSubmit(profile, async (fields) => {
    const payload = { display_name: value(fields, 'display_name'), country: value(fields, 'country') || null };
    const query = db.from('community_profiles');
    const { error } = hasProfile
      ? await query.update(payload).eq('user_id', userId).select('display_name').single()
      : await query.insert(payload);
    if (error) { status.textContent = 'No se pudo guardar el perfil. Verifica tu cuenta y vuelve a intentarlo.'; return; }
    hasProfile = true;
    editor.hidden = false;
    await myDrafts();
    status.textContent = 'Perfil guardado.';
  }, status);

  handleSubmit(draft, async (fields) => {
    const payload = {
      kind: value(fields, 'kind'), country: value(fields, 'country') || null,
      title: value(fields, 'title'), body: value(fields, 'body'),
    };
    const query = db.from('community_contributions');
    const { error } = editing
      ? await query.update(payload).eq('id', editing).select('id').single()
      : await query.insert(payload);
    if (error) { status.textContent = 'No se pudo guardar el aporte. Comprueba los campos y su estado.'; return; }
    resetEditor();
    await myDrafts();
    status.textContent = 'Aporte guardado.';
  }, status);

  q('new').addEventListener('click', resetEditor);
  withAction(q<HTMLButtonElement>('more-drafts'), () => myDrafts(false));
  withAction(q<HTMLButtonElement>('more-users'), () => loadUsers(false));
  withAction(q<HTMLButtonElement>('more-review'), () => loadQueue(false));
  withAction(q<HTMLButtonElement>('more-reports'), () => loadReports(false));
  withAction(q<HTMLButtonElement>('exit'), async () => {
    const { error } = await db.auth.signOut();
    if (error) { status.textContent = 'No pudimos cerrar la sesión.'; return; }
    location.assign('/comunidad/');
  });

  void (async () => {
    const { data, error } = await db.auth.getUser();
    if (error || !data.user) return;
    userId = data.user.id;
    q('access').hidden = true;
    member.hidden = false;
    const url = new URL(location.href);
    if (url.searchParams.get('acceso') === 'confirmado') {
      status.textContent = '¡Qué bueno tenerte en la Comunidad docente! Desde aquí puedes completar tu perfil, conversar en el foro y compartir aportes.';
      url.searchParams.delete('acceso');
      history.replaceState(null, '', url);
    }
    const [saved, grant] = await Promise.all([
      db.from('community_profiles').select('display_name,country,certified_at').maybeSingle(),
      db.rpc('community_is_admin'),
    ]);
    if (saved.error) status.textContent = 'No se pudo cargar tu perfil.';
    if (saved.data) {
      hasProfile = true;
      setValue(profile, 'display_name', saved.data.display_name);
      setValue(profile, 'country', saved.data.country ?? '');
      q('certification').hidden = !saved.data.certified_at;
      editor.hidden = false;
      await myDrafts();
    }
    if (grant.data === true) {
      admin.hidden = false;
      await Promise.all([loadUsers(), loadQueue(), loadReports()]);
    }
  })();
}
