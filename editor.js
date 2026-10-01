(() => {
  'use strict';
  const storageKey = 'link-page.links.v1';
  const nav = document.querySelector('.links');
  const templates = [...nav.children].map(node => node.cloneNode(true));
  const dialog = document.querySelector('#link-editor');
  const form = document.querySelector('#editor-form');
  const fields = document.querySelector('#editor-fields');
  const status = document.querySelector('#editor-status');
  const read = node => ({
    featured: node.classList.contains('featured'),
    title: node.querySelector('h2, strong').textContent,
    description: node.querySelector('.featured p, .link-copy > span').textContent,
    url: node.getAttribute('href'),
    label: node.querySelector('.feature-action, .link-type').textContent
  });
  const safeURL = value => {
    try { return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(value).protocol); }
    catch { return false; }
  };
  const valid = links => Array.isArray(links) && links.length > 0 && links.length <= 30 && links.every(link =>
    link && typeof link.featured === 'boolean' && ['title', 'description', 'url', 'label'].every(key => typeof link[key] === 'string' && link[key].length <= 2000) && link.title.trim() && safeURL(link.url));
  let saved = templates.map(read);
  let draft;
  let dirty = false;
  let storageWarning = '';
  function render(links) {
    nav.replaceChildren(...links.map(link => {
      const node = templates[link.featured ? 0 : 1].cloneNode(true);
      node.href = link.url;
      node.querySelector('h2, strong').textContent = link.title;
      node.querySelector('.featured p, .link-copy > span').textContent = link.description;
      node.querySelector('.feature-action, .link-type').textContent = link.label;
      if (!link.featured) node.querySelector('.link-icon').textContent = '•';
      return node;
    }));
  }
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (valid(parsed)) { saved = parsed; render(saved); }
      else storageWarning = 'An older draft could not be loaded. Your original links are shown.';
    }
  } catch { storageWarning = 'Browser storage is unavailable. You can still edit and download your page.'; }
  function markDirty() { dirty = true; status.textContent = 'Unsaved changes'; }
  function drawFields() {
    fields.replaceChildren();
    draft.forEach((link, index) => {
      const group = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = link.featured ? 'Featured link' : `Link ${index + 1}`;
      group.append(legend);
      for (const [key, title] of [['title', 'Title'], ['url', 'Destination'], ['description', 'Description'], ['label', 'Button label']]) {
        const label = document.createElement('label');
        label.textContent = title;
        const input = document.createElement('input');
        input.value = link[key]; input.name = `${key}-${index}`;
        input.maxLength = key === 'url' ? 2000 : 200;
        input.required = key === 'title' || key === 'url';
        if (key === 'url') { input.placeholder = 'https://your-website.com'; input.inputMode = 'url'; }
        input.addEventListener('input', () => { link[key] = input.value; input.setCustomValidity(''); markDirty(); });
        label.append(input); group.append(label);
      }
      const actions = document.createElement('div'); actions.className = 'row-actions';
      for (const [text, offset] of [['Move up', -1], ['Move down', 1], ['Remove', 0]]) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = text;
        button.disabled = offset ? index + offset < 0 || index + offset >= draft.length : draft.length === 1;
        button.addEventListener('click', () => {
          if (offset) [draft[index], draft[index + offset]] = [draft[index + offset], draft[index]];
          else draft.splice(index, 1);
          markDirty(); drawFields();
          fields.children[Math.min(offset ? index + offset : index, draft.length - 1)].querySelector('input').focus();
        });
        actions.append(button);
      }
      group.append(actions); fields.append(group);
    });
    document.querySelector('#add-link').disabled = draft.length >= 30;
  }
  document.querySelector('#edit-links').addEventListener('click', () => {
    draft = saved.map(link => ({...link})); dirty = false; drawFields();
    status.textContent = storageWarning; dialog.showModal();
  });
  function closeEditor() {
    if (!dirty || window.confirm('Discard your unsaved link changes?')) dialog.close();
  }
  document.querySelector('#close-editor').addEventListener('click', closeEditor);
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeEditor(); });
  window.addEventListener('beforeunload', event => { if (dirty) { event.preventDefault(); event.returnValue = ''; } });
  document.querySelector('#add-link').addEventListener('click', () => {
    if (draft.length >= 30) return;
    draft.push({featured: false, title: '', description: '', url: '', label: 'VISIT'});
    markDirty(); drawFields(); fields.lastElementChild.querySelector('input').focus();
  });
  function collect() {
    draft.forEach((link, index) => {
      const url = form.elements.namedItem(`url-${index}`);
      url.setCustomValidity(safeURL(link.url.trim()) ? '' : 'Use a full https://, http://, mailto:, or tel: address.');
      const title = form.elements.namedItem(`title-${index}`);
      title.setCustomValidity(link.title.trim() ? '' : 'Enter a title for this link.');
    });
    if (!form.reportValidity()) return null;
    return draft.map(link => Object.fromEntries(Object.entries(link).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value])));
  }
  form.addEventListener('submit', event => {
    event.preventDefault(); const links = collect(); if (!links) return;
    saved = links; draft = saved.map(link => ({...link})); render(saved);
    try { localStorage.setItem(storageKey, JSON.stringify(saved)); dirty = false; status.textContent = 'Saved on this device. Your public page has not changed.'; }
    catch { status.textContent = 'Updated for this visit, but browser storage is unavailable. Download your page to keep these changes.'; }
  });
  document.querySelector('#download-page').addEventListener('click', () => {
    const links = collect(); if (!links) return;
    const clone = document.documentElement.cloneNode(true);
    const originalNodes = [...nav.children].map(node => node.cloneNode(true));
    render(links); clone.querySelector('.links').replaceChildren(...[...nav.children].map(node => node.cloneNode(true))); nav.replaceChildren(...originalNodes);
    clone.querySelector('#link-editor').remove(); clone.querySelector('.editor-entry').remove(); clone.querySelector('script[src="editor.js"]').remove();
    const url = URL.createObjectURL(new Blob(['<!doctype html>\n' + clone.outerHTML], {type: 'text/html'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'index.html'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent = 'Downloaded index.html. Keep styles.css beside it, then upload both to publish.';
  });
})();
