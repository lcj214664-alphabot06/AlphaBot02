const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  PermissionFlagsBits,
  AttachmentBuilder
} = require('discord.js');

const fs = require('fs');

// ===============================
// 💰 FORMATAÇÃO DE DINHEIRO
// ===============================
function money(value) {
  return `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
}

// ===============================
// 📋 COMANDOS
// ===============================
const commands = [

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica o bot.'),

  new SlashCommandBuilder()
    .setName('ajuda')
    .setDescription('Mostra todos os comandos.'),

  new SlashCommandBuilder()
    .setName('painel')
    .setDescription('Abre o painel administrativo.'),

  new SlashCommandBuilder()
    .setName('configurar')
    .setDescription('Abre o menu de configuração.'),

  new SlashCommandBuilder()
    .setName('configurarcanal')
    .setDescription('Configura canal/categoria.')
    .addStringOption(o =>
      o.setName('tipo')
        .setDescription('O que configurar')
        .setRequired(true)
        .addChoices(
          { name: 'Logs', value: 'logs' },
          { name: 'Categoria de tickets', value: 'categoria' }
        )
    )
    .addChannelOption(o =>
      o.setName('canal')
        .setDescription('Canal ou categoria')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('configurarlogs')
    .setDescription('Configura o canal de logs.')
    .addChannelOption(o =>
      o.setName('canal')
        .setDescription('Canal')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('configurarstaff')
    .setDescription('Configura o cargo da staff.')
    .addRoleOption(o =>
      o.setName('cargo')
        .setDescription('Cargo')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('produtos')
    .setDescription('Mostra os produtos.'),

  new SlashCommandBuilder()
    .setName('estoque')
    .setDescription('Consulta o estoque.')
    .addStringOption(o =>
      o.setName('produto')
        .setDescription('Produto')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('configurarproduto')
    .setDescription('Cria/configura um produto.')
    .addStringOption(o =>
      o.setName('nome')
        .setDescription('Nome')
        .setRequired(true)
    )
    .addNumberOption(o =>
      o.setName('preco')
        .setDescription('Preço')
        .setMinValue(0)
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('descricao')
        .setDescription('Descrição')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('editarproduto')
    .setDescription('Edita um produto.')
    .addStringOption(o =>
      o.setName('produto')
        .setDescription('Produto')
        .setRequired(true)
    )
    .addNumberOption(o =>
      o.setName('preco')
        .setDescription('Novo preço')
        .setMinValue(0)
        .setRequired(false)
    )
    .addStringOption(o =>
      o.setName('descricao')
        .setDescription('Nova descrição')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('reestock')
    .setDescription('Adiciona unidades ao estoque.')
    .addStringOption(o =>
      o.setName('produto')
        .setDescription('Produto')
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('itens')
        .setDescription('Itens separados por |')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('removerestoque')
    .setDescription('Remove unidades do estoque.')
    .addStringOption(o =>
      o.setName('produto')
        .setDescription('Produto')
        .setRequired(true)
    )
    .addIntegerOption(o =>
      o.setName('quantidade')
        .setDescription('Quantidade')
        .setMinValue(1)
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('painel-ticket')
    .setDescription('Publica o painel de compra.'),

  new SlashCommandBuilder()
    .setName('ticket')
    .setDescription('Abre um ticket de suporte.'),

  new SlashCommandBuilder()
    .setName('fecharticket')
    .setDescription('Fecha o ticket atual.'),

  new SlashCommandBuilder()
    .setName('addticket')
    .setDescription('Adiciona alguém ao ticket.')
    .addUserOption(o =>
      o.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('removeticket')
    .setDescription('Remove alguém do ticket.')
    .addUserOption(o =>
      o.setName('usuario')
        .setDescription('Usuário')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('avaliar')
    .setDescription('Avalia uma compra.')
    .addIntegerOption(o =>
      o.setName('nota')
        .setDescription('1 a 5')
        .setMinValue(1)
        .setMaxValue(5)
        .setRequired(true)
    )
    .addStringOption(o =>
      o.setName('comentario')
        .setDescription('Comentário')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('avaliacoes')
    .setDescription('Mostra avaliações.'),

  new SlashCommandBuilder()
    .setName('feedback')
    .setDescription('Configura/exibe o sistema de feedback.'),

  new SlashCommandBuilder()
    .setName('configurarpix')
    .setDescription('Configura PIX/PicPay.')
    .addStringOption(o =>
      o.setName('dados')
        .setDescription('Chave e instruções')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('pix')
    .setDescription('Mostra o PIX configurado.'),

  new SlashCommandBuilder()
    .setName('pagamentos')
    .setDescription('Mostra estatísticas de pagamentos.'),

  new SlashCommandBuilder()
    .setName('confirmarpagamento')
    .setDescription('Confirma pagamento do ticket.')
    .addStringOption(o =>
      o.setName('observacao')
        .setDescription('Observação opcional')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('configurarentrega')
    .setDescription('Configura a entrega.')
    .addStringOption(o =>
      o.setName('modo')
        .setDescription('Modo')
        .setRequired(true)
        .addChoices(
          { name: 'No ticket', value: 'ticket' },
          { name: 'DM automática', value: 'dm' },
          { name: 'Manual', value: 'manual' }
        )
    ),

  new SlashCommandBuilder()
    .setName('entrega')
    .setDescription('Entrega o produto do ticket.')
    .addStringOption(o =>
      o.setName('produto')
        .setDescription('Produto')
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('reestockauto')
    .setDescription('Configura alerta de estoque baixo.')
    .addIntegerOption(o =>
      o.setName('limite')
        .setDescription('Limite de alerta')
        .setMinValue(0)
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName('backup')
    .setDescription('Gera backup dos dados.'),

  new SlashCommandBuilder()
    .setName('manutencao')
    .setDescription('Liga/desliga manutenção.')
    .addBooleanOption(o =>
      o.setName('ativar')
        .setDescription('Ativar')
        .setRequired(true)
    )
];

// ===============================
// 🎨 EMBED
// ===============================
const embed = (title, description) =>
  new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();

// ===============================
// 🔐 PERMISSÕES
// ===============================
const isAdmin = i =>
  i.memberPermissions?.has(PermissionFlagsBits.Administrator);

// ===============================
// 📝 LOG
// ===============================
async function log(guild, g, text) {

  if (!g.settings.logsChannelId) return;

  const ch = guild.channels.cache.get(
    g.settings.logsChannelId
  );

  if (ch?.isTextBased()) {
    await ch.send({
      content: text
    }).catch(() => {});
  }
}

// ===============================
// 🔄 ATUALIZAR PAINÉIS
// ===============================
async function refreshPanels(guild, g) {

  const rows = Object
    .values(g.products)
    .filter(p => p.active !== false)
    .slice(0, 25);

  const menu = rows.length
    ? new StringSelectMenuBuilder()
        .setCustomId('alpha_buy_select')
        .setPlaceholder('🛒 Selecione um produto')
        .addOptions(
          rows.map(p => ({
            label: p.name.slice(0, 100),
            description:
              `${money(p.price)} • ${p.stock.length} unidade(s)`
                .slice(0, 100),
            value: p.id
          }))
        )
    : null;

  const components = menu
    ? [
        new ActionRowBuilder()
          .addComponents(menu)
      ]
    : [];

  const e = embed(
    '⚡ ALPHA BOT • CENTRAL DE COMPRAS',
    rows.length
      ? 'Selecione um produto abaixo para abrir seu pedido privado.\n\n' +
        '📦 Estoque em tempo real\n' +
        '💳 Pagamento configurado\n' +
        '🎫 Ticket privado\n' +
        '📩 Entrega após confirmação'
      : '📦 Nenhum produto disponível no momento.'
  );

  for (const pm of (g.settings.panelMessages || [])) {

    const ch =
      guild.channels.cache.get(pm.channelId);

    if (!ch) continue;

    const m =
      await ch.messages.fetch(pm.messageId)
        .catch(() => null);

    if (m) {

      await m.edit({
        embeds: [e],
        components
      }).catch(() => {});

    }
  }
}

// ===============================
// 🎫 CRIAR TICKET
// ===============================
async function createTicket(
  i,
  g,
  product,
  support = false
) {

  const existing =
    Object.values(g.tickets).find(
      t =>
        t.userId === i.user.id &&
        t.status !== 'closed'
    );

  if (existing) {

    const ch =
      i.guild.channels.cache.get(
        existing.channelId
      );

    if (ch) return ch;
  }

  const ch =
    await i.guild.channels.create({

      name:
        `ticket-${i.user.username}`
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .slice(0, 90),

      type: ChannelType.GuildText,

      parent:
        g.settings.ticketCategoryId ||
        undefined,

      permissionOverwrites: [

        {
          id: i.guild.roles.everyone.id,

          deny: [
            PermissionFlagsBits.ViewChannel
          ]
        },

        {
          id: i.user.id,

          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },

        ...(g.settings.staffRoleId
          ? [
              {
                id: g.settings.staffRoleId,

                allow: [
                  PermissionFlagsBits.ViewChannel,
                  PermissionFlagsBits.SendMessages,
                  PermissionFlagsBits.ReadMessageHistory
                ]
              }
            ]
          : [])
      ]
    });

  const order =
    ++g.counters.order;

  const orderId =
    `ALPHA-${String(order).padStart(5, '0')}`;

  g.orders[orderId] = {

    id: orderId,

    userId: i.user.id,

    productId:
      product?.id || null,

    price:
      product?.price || 0,

    status:
      product
        ? 'awaiting_payment'
        : 'support',

    ticketChannelId:
      ch.id,

    createdAt:
      new Date().toISOString()
  };

  g.tickets[ch.id] = {

    channelId: ch.id,

    userId: i.user.id,

    productId:
      product?.id || null,

    orderId,

    status: 'open',

    createdAt:
      new Date().toISOString()
  };

  const e =
    embed(
      `🎫 PEDIDO ${orderId}`,

      product

        ? `📦 **Produto:** ${product.name}\n` +
          `💰 **Valor:** ${money(product.price)}\n` +
          `📊 **Estoque:** ${product.stock.length} unidade(s)\n\n` +
          `💳 Clique em **Pagamento** para ver o PIX/PicPay configurado.\n` +
          `📸 Após pagar, envie o comprovante neste ticket.\n\n` +
          `🔐 Seu pedido está vinculado a este ticket.`

        : '👋 Explique aqui como podemos ajudar.'
    );

  const buttons =
    new ActionRowBuilder()
      .addComponents(

        new ButtonBuilder()
          .setCustomId('alpha_pay')
          .setLabel('💳 Pagamento')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('alpha_close')
          .setLabel('🔒 Fechar')
          .setStyle(ButtonStyle.Danger)

      );

  await ch.send({

    content:
      `<@${i.user.id}>`,

    embeds: [e],

    components: [
      buttons
    ]

  });

  await log(
    i.guild,
    g,
    `🎫 Ticket criado • ${orderId} • <@${i.user.id}>` +
    `${product ? ` • ${product.name}` : ''}`
  );

  return ch;
}

// ===============================
// ⚙️ COMANDOS
// ===============================
async function handleCommand(i, ctx) {

  const g =
    ctx.gid(i.guildId);

  const c =
    i.commandName;

  // =============================
  // PING
  // =============================
  if (c === 'ping') {

    return i.reply(
      '🏓 **Pong!** Alpha Bot V5 está online.'
    );

  }

  // =============================
  // AJUDA
  // =============================
  if (c === 'ajuda') {

    return i.reply({

      ephemeral: true,

      embeds: [

        embed(
          '⚡ ALPHA BOT V5 • COMANDOS',

          '**🛒 LOJA**\n' +
          '`/produtos` `/estoque` `/configurarproduto` `/editarproduto`\n' +
          '`/reestock` `/removerestoque`\n\n' +

          '**🎫 TICKETS**\n' +
          '`/painel-ticket` `/ticket` `/fecharticket`\n' +
          '`/addticket` `/removeticket`\n\n' +

          '**💳 PAGAMENTOS**\n' +
          '`/configurarpix` `/pix` `/pagamentos`\n' +
          '`/confirmarpagamento`\n\n' +

          '**📦 ENTREGA**\n' +
          '`/configurarentrega` `/entrega` `/reestockauto`\n\n' +

          '**⚙️ ADMINISTRAÇÃO**\n' +
          '`/painel` `/configurar` `/configurarcanal`\n' +
          '`/configurarlogs` `/configurarstaff`\n' +
          '`/backup` `/manutencao`'
        )

      ]

    });

  }

  // =============================
  // PAINEL
  // =============================
  if (c === 'painel') {

    return i.reply({

      ephemeral: true,

      embeds: [

        embed(
          '⚡ ALPHA BOT • PAINEL',

          `🛒 Produtos: **${Object.keys(g.products).length}**\n` +
          `🎫 Tickets: **${Object.keys(g.tickets).length}**\n` +
          `💰 Vendas: **${g.sales.length}**\n` +
          `⭐ Avaliações: **${g.reviews.length}**\n\n` +
          `🔧 Manutenção: **${g.settings.maintenance ? 'ATIVA' : 'DESATIVADA'}**`
        )

      ]

    });

  }

  // =============================
  // CONFIGURAR
  // =============================
  if (c === 'configurar') {

    return i.reply({

      ephemeral: true,

      embeds: [

        embed(
          '⚙️ ALPHA BOT • CONFIGURAÇÃO',

          `📋 **Logs:** ${
            g.settings.logsChannelId
              ? `<#${g.settings.logsChannelId}>`
              : 'Não configurado'
          }\n` +

          `🎫 **Categoria:** ${
            g.settings.ticketCategoryId
              ? `<#${g.settings.ticketCategoryId}>`
              : 'Não configurada'
          }\n` +

          `👮 **Staff:** ${
            g.settings.staffRoleId
              ? `<@&${g.settings.staffRoleId}>`
              : 'Não configurada'
          }\n` +

          `💳 **PIX:** ${
            g.settings.pix
              ? 'Configurado'
              : 'Não configurado'
          }\n` +

          `📦 **Entrega:** ${
            g.settings.deliveryMode
          }`
        )

      ]

    });

  }

  // =============================
  // CONFIGURAR CANAL
  // =============================
  if (c === 'configurarcanal') {

    const tipo =
      i.options.getString('tipo');

    const canal =
      i.options.getChannel('canal');

    if (tipo === 'logs') {

      g.settings.logsChannelId =
        canal.id;

      ctx.saveDB();

      return i.reply({
        content:
          `✅ Canal de logs configurado: ${canal}`,
        ephemeral: true
      });

    }

    if (tipo === 'categoria') {

      g.settings.ticketCategoryId =
        canal.id;

      ctx.saveDB();

      return i.reply({
        content:
          `✅ Categoria de tickets configurada: ${canal}`,
        ephemeral: true
      });

    }

  }

  // =============================
  // CONFIGURAR LOGS
  // =============================
  if (c === 'configurarlogs') {

    const canal =
      i.options.getChannel('canal');

    g.settings.logsChannelId =
      canal.id;

    ctx.saveDB();

    return i.reply({
      content:
        `✅ Logs configurados em ${canal}.`,
      ephemeral: true
    });

  }

  // =============================
  // CONFIGURAR STAFF
  // =============================
  if (c === 'configurarstaff') {

    const cargo =
      i.options.getRole('cargo');

    g.settings.staffRoleId =
      cargo.id;

    ctx.saveDB();

    return i.reply({
      content:
        `✅ Cargo da staff configurado: ${cargo}.`,
      ephemeral: true
    });

  }

  // =============================
  // PRODUTOS
  // =============================
  if (c === 'produtos') {

    const products =
      Object.values(g.products)
        .filter(p => p.active !== false);

    if (!products.length) {

     
