import { createClient, type Provider } from '@supabase/supabase-js';
import { categorias } from './comunidad';

type Mensaje = { id: string; display_name: string; body: string; created_at: string };
type Tema = Mensaje & { title: string; category: string };
const camposMensaje = 'id,display_name,body,created_at';
const pageSize = 20;
const dateFormat = new Intl.DateTimeFormat('es', { dateStyle: 'medium' });

function elemento<K extends keyof HTMLElementTagNameMap>(tag: K, text?: string, className?: string) {
  const el = document.createElement(tag);
  if (text) el.textContent = text;
  if (className) el.className = className;
  return el;
}

function campo(datos: FormData, valor: string) {
  return String(datos.get(valor) ?? '').trim();
}

function mantenerFormulario(formulario: HTMLFormElement, tarea: (datos: FormData) => Promise<void>) {
  formulario.addEventListener('submit', async (event) => {
    event.preventDefault();
    const boton = formulario.querySelector<HTMLButtonElement>('button[type=submit]')!;
    if (boton.disabled) return;
    boton.disabled = true;
    try {
      await tarea(new FormData(formulario));
    } finally {
      boton.disabled = false;
    }
  });
}

export function iniciarComunidad(root: HTMLElement) {
  const supabase = createClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    { auth: { flowType: 'pkce' } },
  );
  const lista = root.querySelector<HTMLUListElement>('[data-threads]')!;
  const selector = root.querySelector<HTMLSelectElement>('[data-category]')!;
  const mas = root.querySelector<HTMLButtonElement>('[data-more]')!;
  const feed = root.querySelector<HTMLElement>('[data-feed-status]')!;
  const feedback = root.querySelector<HTMLElement>('[data-community-status]')!;
  const entrar = root.querySelector<HTMLElement>('[data-signin]')!;
  const miembro = root.querySelector<HTMLElement>('[data-signed-in]')!;
  const borrarSesion = root.querySelector<HTMLButtonElement>('[data-signout]')!;
  const nuevoTema = root.querySelector<HTMLFormElement>('[data-new-topic]')!;
  const formularioCorreo = root.querySelector<HTMLFormElement>('[data-email-form]');
  const regreso = new URL('/comunidad/', window.location.origin).href;
  let miembroActivo = false;
  let pedido = 0;
  let pagina = 0;

  function renderAuth(sesionActiva: boolean) {
    miembroActivo = sesionActiva;
    entrar.hidden = miembroActivo;
    miembro.hidden = !miembroActivo;
    root.querySelectorAll<HTMLElement>('[data-auth-only]').forEach((el) => { el.hidden = !miembroActivo; });
  }

  supabase.auth.onAuthStateChange((_event, session) => renderAuth(Boolean(session)));
  borrarSesion.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    feedback.textContent = error ? 'No pudimos cerrar la sesión. Intenta de nuevo.' : 'Cerraste la sesión.';
  });
  root.querySelectorAll<HTMLButtonElement>('button[data-provider]').forEach((button) => {
    button.addEventListener('click', async () => {
      button.disabled = true;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: button.dataset.provider as Provider,
        options: { redirectTo: regreso },
      });
      if (error) {
        feedback.textContent = 'No pudimos iniciar el acceso con este proveedor. Intenta de nuevo.';
        button.disabled = false;
      }
    });
  });

  if (formularioCorreo) mantenerFormulario(formularioCorreo, async (datos) => {
    const captchaToken = campo(datos, 'cf-turnstile-response');
    if (!captchaToken) {
      feedback.textContent = 'Completa la verificación de seguridad. Si no aparece, recarga la página.';
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: campo(datos, 'email'),
        options: { emailRedirectTo: regreso, captchaToken },
      });
      feedback.textContent = error
        ? 'No pudimos enviarte el enlace. Vuelve a intentarlo en unos minutos.'
        : '¡El enlace va en camino! Revisa tu correo para entrar a la Comunidad docente.';
    } catch {
      feedback.textContent = 'No pudimos conectarnos. Revisa tu conexión y vuelve a intentarlo.';
    } finally {
      const { turnstile } = window as Window & { turnstile?: { reset: () => void } };
      turnstile?.reset();
    }
  });

  mantenerFormulario(nuevoTema, async (datos) => {
    if (!miembroActivo) return;
    const { error } = await supabase.from('community_topics').insert({
      display_name: campo(datos, 'display_name'),
      category: campo(datos, 'category'),
      title: campo(datos, 'title'),
      body: campo(datos, 'body'),
    });
    if (error) {
      feedback.textContent = 'No pudimos publicar la conversación. Revisa los campos e intenta de nuevo.';
      return;
    }
    nuevoTema.reset();
    selector.value = '';
    feedback.textContent = 'Publicaste tu conversación.';
    await cargarTemas(true);
  });

  function botonReportar(id: string, campoId: 'topic_id' | 'reply_id') {
    const boton = elemento('button', 'Reportar', 'thread-action');
    boton.type = 'button';
    boton.dataset.authOnly = '';
    boton.hidden = !miembroActivo;
    boton.addEventListener('click', async () => {
      boton.disabled = true;
      const { error } = await supabase.from('community_reports').insert({ [campoId]: id });
      if (error && error.code !== '23505') {
        boton.disabled = false;
        feedback.textContent = 'No pudimos enviar el reporte. Intenta de nuevo.';
        return;
      }
      boton.textContent = 'Reportado';
      feedback.textContent = 'El reporte quedó registrado.';
    });
    return boton;
  }

  function textoMeta(mensaje: Mensaje) {
    return `${mensaje.display_name} · ${dateFormat.format(new Date(mensaje.created_at))}`;
  }

  function prepararRespuestas(tema: Tema) {
    const detalle = elemento('details', undefined, 'thread-replies');
    const resumen = elemento('summary', 'Ver respuestas');
    const estado = elemento('p');
    estado.role = 'status';
    const respuestas = elemento('ul', undefined, 'reply-list');
    const botonMas = elemento('button', 'Ver más respuestas', 'thread-action');
    botonMas.type = 'button';
    botonMas.hidden = true;
    const form = elemento('form');
    form.dataset.authOnly = '';
    form.hidden = !miembroActivo;

    const labelNombre = elemento('label', 'Nombre público', 'field');
    const nombre = elemento('input');
    Object.assign(nombre, { name: 'display_name', required: true, minLength: 2, maxLength: 48, autocomplete: 'nickname' });
    labelNombre.append(nombre);
    const labelTexto = elemento('label', 'Tu respuesta', 'field');
    const cuerpo = elemento('textarea');
    Object.assign(cuerpo, { name: 'body', required: true, minLength: 5, maxLength: 3000, rows: 3 });
    labelTexto.append(cuerpo);
    const enviar = elemento('button', 'Responder', 'button button--quiet');
    enviar.type = 'submit';
    form.append(labelNombre, labelTexto, enviar);
    detalle.append(resumen, estado, respuestas, botonMas, form);

    let paginaRespuestas = 0;
    let cargadas = false;
    let cargando = false;
    async function cargarRespuestas(reiniciar = false) {
      if (cargando) return;
      cargando = true;
      const inicio = reiniciar ? 0 : paginaRespuestas * pageSize;
      estado.textContent = 'Cargando respuestas…';
      const { data, error } = await supabase.from('community_replies')
        .select(camposMensaje).eq('topic_id', tema.id)
        .order('created_at').order('id').range(inicio, inicio + pageSize - 1);
      cargando = false;
      if (error) {
        estado.textContent = 'No pudimos cargar las respuestas. Cierra y abre el hilo para reintentar.';
        cargadas = false;
        return;
      }
      if (reiniciar) respuestas.replaceChildren();
      cargadas = true;
      if (data.length) {
        for (const reply of data) {
          const li = elemento('li');
          li.append(
            elemento('p', textoMeta(reply), 'reply-meta'),
            elemento('p', reply.body, 'reply-body'),
            botonReportar(reply.id, 'reply_id'),
          );
          respuestas.append(li);
        }
      }
      paginaRespuestas = Math.floor(inicio / pageSize) + 1;
      botonMas.hidden = data.length < pageSize;
      estado.textContent = respuestas.childElementCount === 0 ? 'Todavía no hay respuestas.' : '';
    }

    detalle.addEventListener('toggle', () => {
      if (detalle.open && !cargadas) void cargarRespuestas(true);
    });
    botonMas.addEventListener('click', () => void cargarRespuestas());
    mantenerFormulario(form, async (datos) => {
      if (!miembroActivo) return;
      const { error } = await supabase.from('community_replies').insert({
        topic_id: tema.id,
        display_name: campo(datos, 'display_name'),
        body: campo(datos, 'body'),
      });
      if (error) {
        estado.textContent = 'No pudimos publicar tu respuesta. Revisa los campos e intenta de nuevo.';
        return;
      }
      cuerpo.value = '';
      await cargarRespuestas(true);
    });
    return detalle;
  }

  function tarjeta(tema: Tema) {
    const li = elemento('li');
    const post = elemento('article', undefined, 'community-thread');
    const categoria = categorias.find((item) => item.id === tema.category)?.nombre ?? 'Comunidad';
    post.append(
      elemento('p', categoria, 'thread-meta'),
      elemento('h3', tema.title),
      elemento('p', textoMeta(tema), 'thread-meta'),
      elemento('p', tema.body, 'thread-body'),
      botonReportar(tema.id, 'topic_id'),
      prepararRespuestas(tema),
    );
    li.append(post);
    return li;
  }

  async function cargarTemas(reiniciar: boolean) {
    const actual = ++pedido;
    const inicio = reiniciar ? 0 : pagina * pageSize;

    if (reiniciar) {
      lista.replaceChildren();
      mas.hidden = true;
    }
    mas.disabled = true;
    feed.textContent = 'Cargando conversaciones…';
    let query = supabase.from('community_topics').select(`${camposMensaje},category,title`)
      .order('created_at', { ascending: false }).order('id', { ascending: false });
    if (selector.value) query = query.eq('category', selector.value);
    const { data, error } = await query.range(inicio, inicio + pageSize - 1);
    if (pedido !== actual) return;
    mas.disabled = false;
    if (error) {
      feed.textContent = 'No pudimos cargar las conversaciones. Recarga la página para reintentar.';
      return;
    }
    lista.append(...data.map(tarjeta));
    pagina = Math.floor(inicio / pageSize) + 1;
    mas.hidden = data.length < pageSize;
    feed.textContent = lista.childElementCount ? '' : 'Todavía no hay conversaciones en esta sección.';
  }

  selector.addEventListener('change', () => void cargarTemas(true));
  mas.addEventListener('click', () => void cargarTemas(false));
  void cargarTemas(true);
}
