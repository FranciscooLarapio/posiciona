

---

## 0. REGRAS INVIOLÁVEIS

1. **Não partir SEO:** títulos `<title>`, meta descriptions, schemas JSON-LD, headings H1/H2 e URLs mantêm-se, exceto na Fase 6 (canonicals) e onde o brief substituir copy explicitamente.
2. **Mobile-first.** As prints de referência são mobile; é aí que o site vive.
3. **Um commit por fase**, mensagem em português, deploy Vercel automático valida cada fase.
4. **Zero dependências novas de build.** O site é HTML/CSS/JS estático — mantém-no assim. Fontes via Google Fonts, SVG inline, JS vanilla.
5. **Acessibilidade é chão, não teto:** contraste AA, `:focus-visible` em tudo o que é interativo, `prefers-reduced-motion` respeitado em todas as animações.

---

## 1. CONCEITO: "O MAPA É O PRODUTO"

A Posiciona vende uma coisa: **posições no mapa e na pesquisa local**. O redesign torna isso a linguagem visual do site inteiro — cartografia, pins, rotas, coordenadas — em vez do atual look genérico "SaaS escuro". Nenhuma agência concorrente em Portugal tem uma identidade cartográfica; é apropriável, é literal ao serviço, e é impossível de confundir.

Três vozes tipográficas (a mudança mais transformadora do brief):

- **Display — "Bricolage Grotesque"** (Google Fonts, pesos 600/700/800): títulos H1/H2. Personalidade, largura generosa, ótima com diacríticos PT.
- **Corpo/UI — "Inter"** (mantém-se, pesos 400/500/600/700): parágrafos, botões, navegação.
- **Dados — "JetBrains Mono"** (pesos 400/600): eyebrows, coordenadas, números, métricas, etiquetas, datas. É a voz "instrumento de medição" — SEO é dados, e esta voz di-lo sem o dizer.

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
```

---

## 2. DESIGN TOKENS (substituir/consolidar no CSS global)

```css
:root {
  /* Cores — mantém a marca, acrescenta o "papel de mapa" */
  --navy: #0C1428;          /* âncora escura: hero, footer, secções de dados */
  --navy-soft: #16213E;
  --paper: #F2F5F9;         /* NOVO: fundo claro "carta topográfica" p/ secções de meio */
  --paper-line: #DDE4EE;    /* NOVO: linhas de contorno sobre claro */
  --contour: #1E2C4F;       /* NOVO: linhas de contorno sobre escuro */
  --blue: #1A6FFF;
  --teal: #00D4AA;          /* ação primária, posição ganha */
  --pin: #FF5A5F;           /* NOVO: exclusivo do glifo de pin e badges de posição — nunca em botões */
  --ink: #17203A;
  --muted: #5B6678;
  --muted-dark: #8FA0BD;    /* texto secundário sobre navy (verificar contraste AA) */

  /* Tipografia */
  --f-display: "Bricolage Grotesque", "Inter", sans-serif;
  --f-body: "Inter", sans-serif;
  --f-mono: "JetBrains Mono", monospace;

  /* Escala (mobile-first, clamp) */
  --t-h1: clamp(2.1rem, 7vw, 3.6rem);
  --t-h2: clamp(1.6rem, 5vw, 2.5rem);
  --t-body: 1rem;
  --t-mono: 0.78rem;

  /* Ritmo */
  --sec-pad: clamp(56px, 10vw, 110px);   /* padding vertical de secção — CONSISTENTE, mata os vazios atuais */
  --radius: 14px;
  --shadow-card: 0 10px 30px rgba(12, 20, 40, .10);
}
```

**Regra de alternância de fundos** (mata a monotonia escura E os vazios): hero navy → serviços paper → caso de estudo navy → processo paper → CTA navy → blog paper → contacto navy → footer near-black. Nunca duas secções escuras seguidas.

**Eyebrow novo (padrão global):** substitui os atuais ("Conheça a Posiciona", etc.) por etiqueta mono com coordenada ou índice de dados. Exemplos:
`38.68°N · 9.16°W — SEO LOCAL` · `RESULTADOS — DADOS REAIS` · `PROCESSO — 4 ETAPAS`.
Estilo: `--f-mono`, 0.72rem, uppercase, letter-spacing .14em, cor teal sobre escuro / blue sobre claro.

---

## 3. ELEMENTO-ASSINATURA: O LOCAL PACK VIVO (hero)

Substitui o mockup de dashboard do hero (que é genérico e pesado em mobile) pela cena que vende o serviço em 5 segundos sem ler uma palavra:

**Comportamento:**
1. Uma barra de pesquisa estilizada (lupa, cantos redondos, sombra) onde um efeito typewriter escreve, em loop, pares serviço+zona: `canalizador em Almada` → `eletricista no Seixal` → `remodelações no Barreiro` → `construção civil no Montijo` (45ms/carácter, pausa 1.2s, apagar rápido).
2. Por baixo, um Local Pack estilizado com 3 cartões-resultado: posições 1 e 2 são concorrentes anónimos (barras skeleton cinza no lugar do nome, estrelas apagadas); a posição 3 tem borda teal e o texto **"O teu negócio"** com pin `--pin`.
3. Ao completar cada pesquisa, o cartão teal **sobe animado de #3 para #1** (transform translateY com easing, 600ms), as estrelas acendem, e um contador pequeno em mono marca `#3 → #1`. Reset suave no ciclo seguinte.
4. `prefers-reduced-motion`: versão estática com o cartão "O teu negócio" fixo em #1.
5. Implementação: JS vanilla ~60 linhas, CSS transitions. Sem bibliotecas.

O H1 atual mantém-se por cima, mas em `--f-display` 800. A sticky bar "Auditoria Grátis" duplicada que hoje se sobrepõe ao conteúdo em mobile: manter apenas UMA instância, que só aparece após 600px de scroll e nunca sobrepõe o hero.

---

## 4. MOTIVOS RECORRENTES (usar com contenção)

1. **Curvas de nível (contour lines):** SVG inline de linhas topográficas orgânicas como textura de fundo. Sobre navy: stroke `--contour` a 100% (já é subtil); sobre paper: stroke `--paper-line`. Opacidade total ≤ 0.6, nunca por trás de texto corrido — só nas margens/cantos das secções. Gerar 2 variantes (canto superior direito, faixa inferior) e reutilizar.
2. **Pin:** o glifo de marcador de mapa, sempre em `--pin`, usado APENAS para posições/localizações (badges de ranking, etapas do processo, o cartão "O teu negócio").
3. **Rota pontilhada:** linha tracejada tipo "percurso no mapa" a ligar elementos sequenciais (ver processo, §5.4).
4. **Coordenadas mono:** eyebrows e rodapés de cartão (ex.: data + tempo de leitura no blog) sempre em `--f-mono`.

---

## 5. HOMEPAGE — SECÇÃO A SECÇÃO

### 5.1 Hero
Conforme §3. Fundo navy com curvas de nível no canto. CTA primário teal "Auditoria Grátis →", secundário ghost "Ver como funciona ↓".

### 5.2 Serviços ("SEO Local que Age")
Fundo `--paper`. Os 3 cartões atuais passam a cartões brancos com sombra `--shadow-card`, título em display 700, ícone substituído por **número de posição em pin** (#1, #2, #3 — aqui a numeração é decorativa, REMOVER números e usar pequenos glifos de mapa: pin, documento, ligação). Acrescentar 4.º e 5.º itens já listados no footer (Conteúdo Local, Gestão de Avaliações) num grid 2+3 ou carrossel horizontal em mobile.

### 5.3 Caso de estudo / prova
⚠️ Depende da decisão de conteúdo (§8.2). Layout novo independente da decisão: fundo navy, grelha de métricas em cartões compactos com números em `--f-mono` grandes e labels pequenos, e a peça central é uma **linha de posição** — gráfico simples SVG de #14 a #1 desenhado com stroke-dashoffset animado ao entrar no viewport (IntersectionObserver, uma vez). Os vazios enormes atuais desta zona: eliminar; a secção não deve exceder ~90vh em mobile.

### 5.4 Processo ("Da Pesquisa ao Topo")
A metáfora completa: os 4 passos tornam-se **4 pins numerados ligados por uma rota pontilhada** (vertical em mobile, horizontal em desktop). Aqui a numeração é legítima — é uma sequência real. A rota desenha-se com scroll (stroke-dashoffset). Fundo paper com curvas de nível. Título da secção mantém-se, mas **substituir o subtítulo "em Dias, Não Meses"** (ver §8.1).

### 5.5 CTA intermédio
**Substituir o copy "Apareça no Top 3 do Google Maps. Garantimos Resultados."** — ver §8.1. Visual: faixa navy compacta com o pin motif.

### 5.6 Secção "Dashboard / Visibilidade Total"
Redundante com o hero antigo e cheia de números fictícios. **Duas opções (escolher A por defeito):**
- **A) Cortar a secção** e substituir por uma faixa de ferramentas: dois cartões grandes — "Auditoria SEO Grátis" (link /auditoria-seo.html) e "Calculadora de ROI" (link /calculadora-roi-seo.html) — as ferramentas reais são prova de competência melhor do que um mockup.
- B) Manter uma versão honesta rotulada "exemplo de relatório mensal".

### 5.7 Blog
Fundo paper, cartões conforme §6 (mesmo sistema do blog.html).

### 5.8 Contacto
Manter estrutura. No dropdown "Tipo de negócio", **acrescentar os setores-alvo reais**: "Construção / Remodelações", "Canalizador", "Eletricista" (antes de "Outro").

### 5.9 Footer
Acrescentar coluna/links "Ferramentas Grátis": Auditoria SEO, Calculadora ROI. Corrigir "Lisboa, Portugal" → "Margem Sul · Lisboa, Portugal" (coerência com o posicionamento). Curva de nível como textura no fundo.

---

## 6. BLOG.HTML

1. **Cartões:** eliminar o arco-íris de gradientes. Sistema único: cartão branco sobre paper, faixa superior fina (4px) na cor da categoria (definir 4 cores de categoria fixas e sóbrias), **linha meta em mono** (`SEO LOCAL · JUL 2026 · 7 MIN`), título em display 700, excerto em Inter. Hover: elevação + pin da categoria dá um "bounce" de 4px.
2. **Destaque:** o cartão featured com mini-gráfico de rankings é bom — manter o conceito, refinar com a nova tipografia mono nos dados e a linha de posição do §5.3.
3. **Barra de stats:** "12 Artigos publicados / Semanal" podem ficar; **remover "4.200 leitores/mês"** (ver §8.3) ou substituir por métrica verificável.
4. Botão "Auditoria SEO Grátis →" no topo passa a apontar para /auditoria-seo.html (a ferramenta), não para o formulário.

---

## 7. MOTION (orquestrado, não espalhado)

- **1 momento hero:** o Local Pack vivo (§3).
- **2 revelações de scroll:** linha #14→#1 (§5.3) e rota do processo (§5.4). IntersectionObserver, threshold .4, animar UMA vez.
- **Micro:** hover de cartões (translateY(-3px) + sombra), pins com bounce subtil.
- Mais nada. `prefers-reduced-motion: reduce` desliga tudo (estados finais estáticos).

---

## 8. INTEGRIDADE DE CONTEÚDO (decisões do Francisco — o Claude Code implementa a opção escolhida)

> Estas alterações protegem a credibilidade e a conformidade legal. O posicionamento
> público da Posiciona (artigos, ferramentas, pitch) é "transparência radical, sem
> promessas milagrosas" — o site atual contradiz isso em 4 pontos.

### 8.1 Promessas de garantia — SUBSTITUIR SEMPRE
- "Apareça no Top 3 do Google Maps. **Garantimos Resultados.**" → "Apareça no Top 3 do Google Maps. **Garantimos trabalho visível e números claros.**"
- "Da Pesquisa ao Topo **em Dias, Não Meses**" → "Da Pesquisa ao Topo, **com Método**" (subtítulo: "Primeiros sinais em semanas, resultados consistentes em 3–6 meses — dizemos-te a verdade desde o início.")

### 8.2 Caso de estudo + testemunho "Clínica Saúde Viva"
Se o caso não for real e verificável, substituir por uma de duas opções honestas:
- **A) "Projeção com base no método"** — usar a rampa realista + a calculadora: "O que a matemática diz sobre um negócio como o teu" com CTA para a calculadora. Rotulado claramente como estimativa.
- B) "Primeiros resultados" com dados reais (ainda que modestos) dos projetos existentes, ex. Guerreiro & Silva, com autorização.
Remover o testemunho fictício até existir um real (com nome, empresa verificável e autorização escrita).

### 8.3 Números inventados
- Blog: "4.200 leitores / mês" → remover ou substituir por dado verificável do Search Console.
- Homepage/dashboard: qualquer métrica apresentada como real que não o seja → rotular "exemplo ilustrativo" ou remover (§5.6 opção A elimina o problema).

### 8.4 O paradoxo que joga a favor
A transparência é a arma de diferenciação: uma secção curta "Porque não garantimos o 1.º lugar" (3 frases + link ao artigo das expectativas) converte melhor com este público do que a garantia falsa — e nenhuma agência concorrente tem coragem de a escrever.

---

## 9. TAREFA TÉCNICA: MIGRAÇÃO DE DOMÍNIO NOS METADADOS

O domínio posiciona.pt está ativo, mas os ficheiros gerados antes da ligação apontam para o staging. Em **todos** os ficheiros do repositório (6 artigos em /blog/, calculadora-roi-seo.html, auditoria-seo.html e quaisquer outros):

1. Find-replace global: `https://posiciona-one.vercel.app` → `https://posiciona.pt` (canonicals, og:url, og:image quando aplicável, schemas JSON-LD, links internos, nav e footer).
2. Verificar que o Vercel redireciona posiciona-one.vercel.app → posiciona.pt (301). Se não estiver configurado, criar `vercel.json` com o redirect.
3. Atualizar `sitemap.xml`: todos os URLs no domínio final + entradas para calculadora e auditoria se em falta.
4. Confirmar que /auditoria-seo.html e /calculadora-roi-seo.html estão linkadas na navegação ou footer.

---

## 10. FASES DE EXECUÇÃO (um commit cada)

- **Fase 1 — Fundações:** tokens, fontes, alternância de fundos, eyebrows mono, correção da sticky bar, §9 completo. Commit: `redesign f1: tokens, tipografia e migração de domínio`
- **Fase 2 — Hero:** Local Pack vivo. Commit: `redesign f2: hero local pack vivo`
- **Fase 3 — Secções:** serviços, caso de estudo (layout), processo-rota, CTA, ferramentas, contacto, footer. Commit: `redesign f3: secções da homepage`
- **Fase 4 — Blog:** sistema de cartões + destaque. Commit: `redesign f4: blog`
- **Fase 5 — Motion + QA:** animações de scroll, reduced-motion, contraste, focus, Lighthouse local ≥ 90 em SEO e Boas Práticas. Commit: `redesign f5: motion e QA`
- **Fase 6 — Conteúdo:** implementar as decisões do §8 conforme indicação do Francisco. Commit: `conteúdo: integridade e provas honestas`

## 11. CHECKLIST FINAL DE QA
- [ ] Nenhuma secção com vazios verticais > 120px sem conteúdo (o problema atual)
- [ ] Contraste AA em todo o texto sobre navy e sobre paper
- [ ] `:focus-visible` visível em links, botões, inputs, tabs
- [ ] `prefers-reduced-motion` testado
- [ ] CLS ~0 no hero (reservar alturas do Local Pack)
- [ ] Zero referências a posiciona-one.vercel.app (`grep -r "posiciona-one"` devolve vazio)
- [ ] Testar a própria página em /auditoria-seo.html após deploy (dogfood)
