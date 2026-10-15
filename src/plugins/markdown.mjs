const callout = /^\[!(\w+)\][ \t]*([^\n]*)\n?/;
const youtube = /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/;

export const mdastExtras = {
  name: 'callout-and-youtube',

  blockquote(node, ctx) {
    const text = node.children[0]?.children?.[0];
    const match = text?.type === 'text' && callout.exec(text.value);
    if (!match) return;
    const label = match[2] || match[1][0].toUpperCase() + match[1].slice(1).toLowerCase();
    ctx.setProperty(text, 'value', text.value.slice(match[0].length));
    ctx.setProperty(node, 'data', { hName: 'div', hProperties: { className: ['note'] } });
    ctx.insertChildAt(node, 0, {
      type: 'paragraph',
      data: { hName: 'b' },
      children: [{ type: 'text', value: label }],
    });
  },

  paragraph(node, ctx) {
    const only = node.children.length === 1 && node.children[0];
    const url = only.type === 'link' ? only.url : only.type === 'text' ? only.value : '';
    const id = youtube.exec(url)?.[1];
    if (!id) return;
    ctx.replaceNode(node, {
      type: 'html',
      value: `<iframe class="video" src="https://www.youtube-nocookie.com/embed/${id}" title="YouTube video" loading="lazy" allowfullscreen></iframe>`,
    });
  },
};

export const hastWrap = {
  name: 'wrap-code-and-tables',

  element: [
    {
      filter: ['table'],
      visit(node, ctx) {
        ctx.replaceNode(node, [{ type: 'raw', value: '<div class="tbl">' }, node, { type: 'raw', value: '</div>' }]);
      },
    },
    {
      filter: ['pre'],
      visit(node, ctx) {
        const lang = node.properties['data-language'] ?? node.properties.dataLanguage ?? '';
        ctx.replaceNode(node, [
          {
            type: 'raw',
            value: `<div class="code"><div class="code-h"><span>${lang}</span><button class="copy" type="button">Copy</button></div>`,
          },
          node,
          { type: 'raw', value: '</div>' },
        ]);
      },
    },
  ],
};
