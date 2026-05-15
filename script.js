const dadosBiomas = [
    { id: 'cidade', dicas: ['Use transporte público.', 'Separe o lixo.', 'Não jogue bitucas.', 'Economize energia.', 'Crie jardins verticais.'], progresso: 0 },
    { id: 'pantanal', dicas: ['Proteja as águas.', 'Não polua rios.', 'Denuncie pesca ilegal.', 'Respeite as cheias.', 'Preserve as aves.'], progresso: 0 },
    { id: 'cerrado', dicas: ['Cuidado com fogo.', 'Preserve o solo antigo.', 'Valorize o Pequi.', 'Proteja nascentes.', 'Não mude a flora.'], progresso: 0 },
    { id: 'floresta', dicas: ['Diga não ao desmatamento.', 'Consumo consciente.', 'Respeite indígenas.', 'Proteja a biodiversidade.', 'Combata o tráfico.'], progresso: 0 }
];

let sementes = 0;
let pontuacaoTotal = 0;
let biomaAtualParaDica = null;
let dicasDeTodosUsuarios = [];

async function inicializar() {
    await carregarDicasDoBanco();
    desenharArvore(0, 'cidade');
}

async function carregarDicasDoBanco() {
    try {
        const response = await fetch('api.php');
        dicasDeTodosUsuarios = await response.json(); 
    } catch (e) {
        console.error("Erro ao carregar do banco:", e);
    }
}

function desenharArvore(index, idHTML) {
    const container = document.getElementById(`biome-${idHTML}`).querySelector('.tree-wrapper');
    container.innerHTML = `
        <div class="css-tree">
            <div class="trunk"></div>
            <div class="canopy">
                <div class="blob b1"></div><div class="blob b2"></div>
                <div class="blob b3"></div><div class="blob b4"></div>
                <div class="blob b5"></div><div class="blob b6"></div>
                <div class="blob b7"></div><div class="blob b8"></div>
            </div>
        </div>
    `;

    const arvore = container.querySelector('.css-tree');
    const posFolhasSistema = [
        {t:'50px', l:'180px'}, {t:'120px', l:'90px'}, {t:'120px', l:'280px'},
        {t:'220px', l:'50px'}, {t:'220px', l:'320px'}
    ];

    dadosBiomas[index].dicas.forEach((dica, i) => {
        const leafWrap = document.createElement('div');
        leafWrap.className = 'leaf-wrapper';
        leafWrap.style.top = posFolhasSistema[i].t;
        leafWrap.style.left = posFolhasSistema[i].l;
        leafWrap.innerHTML = `<div class="real-leaf"></div>`;
        
        leafWrap.onclick = () => {
            mostrarDica("Dica do Jogo", dica);
            leafWrap.style.opacity = '0.3';
            leafWrap.style.pointerEvents = 'none';
            dadosBiomas[index].progresso++;
            pontuacaoTotal += 20;
            document.getElementById('total-score').innerText = pontuacaoTotal;

            if (dadosBiomas[index].progresso === 5) {
                abrirJanelaIdeia(index, idHTML);
            }
        };
        arvore.appendChild(leafWrap);
    });

    const dicasDesteBioma = dicasDeTodosUsuarios.filter(d => d.bioma_id === idHTML);
    dicasDesteBioma.forEach(dicaObj => {
        adicionarFolhaDourada(arvore, dicaObj);
    });
}

function abrirJanelaIdeia(index, idHTML) {
    biomaAtualParaDica = { index, idHTML };
    document.getElementById('modal-ideia').classList.remove('hidden');
}

document.getElementById('submit-idea-btn').onclick = async () => {
    const nome = document.getElementById('user-name-input').value;
    const texto = document.getElementById('user-idea-input').value;
    
    if (!nome.trim() || !texto.trim()) return alert("Por favor, preencha seu nome e sua dica!");

    const novaDica = { bioma_id: biomaAtualParaDica.idHTML, nome: nome, texto: texto };

    try {
        await fetch('api.php', {
            method: 'POST',
            body: JSON.stringify(novaDica)
        });
    } catch (e) {
        console.error("Erro ao salvar no banco:", e);
    }

    dicasDeTodosUsuarios.push(novaDica);
    adicionarFolhaDourada(document.querySelector(`#biome-${biomaAtualParaDica.idHTML} .css-tree`), novaDica);

    sementes++;
    document.getElementById('seeds-count').innerText = sementes;
    
    const prox = biomaAtualParaDica.index + 1;
    if (prox < dadosBiomas.length) {
        document.querySelector(`#biome-${dadosBiomas[prox].id} .btn-plantar`).classList.remove('hidden');
    }

    document.getElementById('modal-ideia').classList.add('hidden');
    document.getElementById('user-name-input').value = "";
    document.getElementById('user-idea-input').value = "";
};

function abrirModalIdeia(index, idHTML) {
    if (sementes > 0) {
        sementes--;
        document.getElementById('seeds-count').innerText = sementes;
        const biome = document.getElementById(`biome-${idHTML}`);
        biome.classList.remove('locked');
        biome.querySelector('.btn-plantar').classList.add('hidden');
        desenharArvore(index, idHTML);
        biome.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}

function adicionarFolhaDourada(arvore, dicaObj) {
    if(!arvore) return;
    const leafWrap = document.createElement('div');
    leafWrap.className = 'leaf-wrapper user-leaf';
    
    const randomTop = Math.floor(Math.random() * 150) + 40; 
    const randomLeft = Math.floor(Math.random() * 260) + 70; 
    
    leafWrap.style.top = `${randomTop}px`;
    leafWrap.style.left = `${randomLeft}px`;
    
    leafWrap.innerHTML = `
        <div class="real-leaf"></div>
        <div class="glitter g1"></div>
        <div class="glitter g2"></div>
        <div class="glitter g3"></div>
    `;
    
    leafWrap.onclick = () => mostrarDica(`Dica de: ${dicaObj.nome}`, dicaObj.texto);
    arvore.appendChild(leafWrap);
}

function mostrarDica(titulo, texto) {
    document.getElementById('modal-title').innerText = titulo;
    document.getElementById('modal-text').innerText = texto;
    document.getElementById('modal').classList.remove('hidden');
}

document.getElementById('close-modal').onclick = () => {
    document.getElementById('modal').classList.add('hidden');
};

inicializar();