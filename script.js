/**
 * THE LAST SEED - URBAN ECO EDITION ENGINE
 * Arquitetura Cinematográfica, Transições Lerp Complexas, Partículas Avançadas.
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d', { alpha: false });
let cw = window.innerWidth, ch = window.innerHeight;
canvas.width = cw; canvas.height = ch;

window.addEventListener('resize', () => {
    cw = window.innerWidth; ch = window.innerHeight;
    canvas.width = cw; canvas.height = ch;
});
const imgFolha = document.getElementById('img-folha');

// ==========================================
// 1. BANCO DE DADOS URBANO (Focado em Cidades)
// ==========================================
const UrbanEcoDatabase = {
    agua: [
        {
            title: "DESPERDÍCIO NA PRAÇA", icon: "🚰",
            desc: "Você está caminhando pelo centro e vê uma torneira pública jorrando água potável na calçada, formando uma poça enorme. O que fazer?",
            opts: [
                { text: "Procurar o registro ou ligar para manutenção.", type: "good", exp: "Ações rápidas previnem a perda de milhares de litros de um recurso essencial." },
                { text: "Desviar da poça e continuar andando.", type: "neutral", exp: "A omissão permite que o problema escale. A água continua acabando." },
                { text: "Jogar lixo na poça para brincar.", type: "bad", exp: "Além de ignorar o desperdício, você está contaminando a água." }
            ]
        }
    ],
    transporte: [
        {
            title: "O TRÂNSITO CAÓTICO", icon: "🚗",
            desc: "Você precisa ir à padaria que fica a 10 quarteirões. A rua principal está congestionada, barulhenta e cheia de fumaça preta. Como você vai?",
            opts: [
                { text: "Pego minha bicicleta ou vou a pé.", type: "good", exp: "Zero emissão de CO2, melhora a saúde física e alivia o trânsito da cidade." },
                { text: "Vou de ônibus municipal.", type: "good", exp: "Transporte público transporta dezenas de pessoas emitindo muito menos por passageiro." },
                { text: "Vou sozinho no meu carro.", type: "bad", exp: "Carros com 1 ocupante são os maiores responsáveis pela poluição e engarrafamentos urbanos." }
            ]
        }
    ],
    lixo: [
        {
            title: "AMEAÇA DE ENCHENTE", icon: "🗑️",
            desc: "O céu escurece e uma chuva forte se aproxima. Na calçada, há sacos de lixo rasgados e garrafas plásticas espalhadas bem perto do bueiro da rua.",
            opts: [
                { text: "Recolho rapidamente os recicláveis e afasto o lixo do bueiro.", type: "good", exp: "Prevenir o entupimento dos bueiros é a ação #1 contra enchentes urbanas." },
                { text: "Acelero o passo para não me molhar.", type: "neutral", exp: "O lixo será levado pela chuva, entupirá o sistema e a rua vai alagar." },
                { text: "Chuto as garrafas direto para o bueiro para limpar a calçada.", type: "bad", exp: "Isso garante o bloqueio total da drenagem. A água subirá rapidamente." }
            ]
        }
    ],
    energia: [
        {
            title: "PRÉDIO DESPERDIÇANDO", icon: "🏢",
            desc: "Você é o último a sair do escritório no 15º andar. O ar-condicionado está no máximo e todas as luzes e computadores continuam ligados.",
            opts: [
                { text: "Gasto 5 minutos desligando ar, luzes e telas.", type: "good", exp: "Reduzir o consumo diminui a carga nas hidrelétricas e a necessidade de termoelétricas poluentes." },
                { text: "Vou embora. A empresa que pague a conta.", type: "bad", exp: "O impacto ambiental do desperdício de energia afeta todo o planeta, não apenas o bolso de quem paga." }
            ]
        }
    ],
    plantio: [
        {
            title: "A ILHA DE CALOR", icon: "🌡️",
            desc: "Sua vizinhança é só concreto e asfalto. O calor no verão é insuportável e o ar é seco. Há um canteiro vazio na sua rua.",
            opts: [
                { text: "Planto uma muda de árvore nativa e rego diariamente.", type: "good", exp: "Árvores reduzem a temperatura em até 5ºC, fornecem sombra e purificam o ar urbano." },
                { text: "Cimento o canteiro para colocar minha moto.", type: "bad", exp: "Mais asfalto e concreto aumentam a impermeabilização do solo e a temperatura da cidade." }
            ]
        }
    ],
    getSituation(cat) {
        let list = this[cat];
        if(!list) list = this.lixo;
        return list[Math.floor(Math.random() * list.length)];
    }
};

// ==========================================
// 2. MATEMÁTICA E UTILITÁRIOS LERP
// ==========================================
const MathUtils = {
    lerp: (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t)),
    lerpColor: (a, b, t) => {
        let ah = parseInt(a.replace('#',''), 16), bh = parseInt(b.replace('#',''), 16);
        let ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff;
        let br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff;
        let rr = ar + t * (br - ar), rg = ag + t * (bg - ag), rb = ab + t * (bb - ab);
        return `#${(1 << 24 | rr << 16 | rg << 8 | rb).toString(16).slice(1)}`;
    }
};

// ==========================================
// 3. ESTADO GLOBAL DO MUNDO
// ==========================================
const World = {
    health: 60, targetHealth: 60,
    time: 0,
    state: 'thriving',
    crisisMode: false,
    colors: {
        skyTop: '#0b1d28', skyBot: '#1a3644',
        mountains: '#17202A', city: '#111',
        groundBase: '#1b3823', groundLight: '#2ecc71',
        lake: '#2980b9', lakeGlow: '#a9cce3',
        treeWood: '#4e342e', treeLeaves: '#27ae60'
    },
    targets: {
        thriving: {
            skyTop: '#1E8449', skyBot: '#85C1E9',
            mountains: '#229954', city: 'transparent',
            groundBase: '#1d8348', groundLight: '#2ecc71',
            lake: '#3498db', lakeGlow: '#d6eaf8',
            treeWood: '#5D4037', treeLeaves: '#2ecc71'
        },
        collapse: {
            skyTop: '#4A2311', skyBot: '#1a1a1a',
            mountains: '#111', city: '#000',
            groundBase: '#3E2723', groundLight: '#21130d',
            lake: '#1a2520', lakeGlow: '#000',
            treeWood: '#1a100d', treeLeaves: '#2a1a15'
        }
    },
    update() {
        this.time += 0.02;
        this.health = MathUtils.lerp(this.health, this.targetHealth, 0.03);
        let factor = 1 - (this.health / 100);
        factor = Math.max(0, Math.min(1, factor));

        if(this.health <= 20 && !this.crisisMode) {
            this.crisisMode = true;
            Game.triggerCrisisMode();
        }
        if(this.health > 30) {
            this.crisisMode = false;
        }

        if(this.health > 70) this.state = 'thriving';
        else if(this.health > 30) this.state = 'decaying';
        else this.state = 'collapse';

        for (let key in this.colors) {
            this.colors[key] = MathUtils.lerpColor(this.targets.thriving[key], this.targets.collapse[key], factor);
        }

        document.getElementById('health-bar').style.width = this.health + '%';
        let barColor = '#2ecc71', statusTxt = "Florescendo";
        if(this.state === 'decaying') { barColor = '#e67e22'; statusTxt = "Em Declínio"; }
        if(this.state === 'collapse') { barColor = '#8b0000'; statusTxt = "COLAPSO CRÍTICO"; }
        
        document.getElementById('health-bar').style.background = barColor;
        document.getElementById('world-status-text').innerText = statusTxt;
        document.getElementById('toxic-smog').style.opacity = factor > 0.4 ? (factor - 0.4) * 1.5 : 0;
        document.getElementById('light-rays').style.opacity = factor < 0.4 ? (0.4 - factor) * 2 : 0;
        if (factor > 0.7) document.getElementById('damage-overlay').classList.remove('hidden');
        else document.getElementById('damage-overlay').classList.add('hidden');
    }
};

// ==========================================
// 4. MOTOR DE RENDERIZAÇÃO E AMBIENTE
// ==========================================
const Camera = {
    x: 0, y: -100, targetX: 0, targetY: -100, zoom: 1, shakeInt: 0,
    update() {
        this.x = MathUtils.lerp(this.x, this.targetX, 0.05);
        this.y = MathUtils.lerp(this.y, this.targetY, 0.05);
        if(this.shakeInt > 0.1) {
            this.x += (Math.random()-0.5) * this.shakeInt;
            this.y += (Math.random()-0.5) * this.shakeInt;
            this.shakeInt *= 0.9;
        }
    },
    shake(val) { this.shakeInt = val; },
    apply(ctx) { ctx.save(); ctx.translate(cw/2, ch/2); ctx.scale(this.zoom, this.zoom); ctx.translate(-this.x, -this.y); },
    restore(ctx) { ctx.restore(); }
};

const Environment = {
    drawBackground(ctx) {
        let factor = 1 - (World.health / 100);
        let grad = ctx.createLinearGradient(0, 0, 0, ch);
        grad.addColorStop(0, World.colors.skyTop);
        grad.addColorStop(1, World.colors.skyBot);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, cw, ch);

        ctx.save();
        ctx.translate(cw/2 - Camera.x*0.05, ch*0.25 - Camera.y*0.05);
        if (factor < 0.5) {
            ctx.fillStyle = `rgba(255, 255, 200, ${0.1 * (1-factor*2)})`;
            ctx.beginPath(); ctx.arc(0, 0, 200, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#fff9c4';
            ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI*2); ctx.fill();
        } else {
            ctx.fillStyle = `rgba(139, 0, 0, ${(factor-0.5)*2})`;
            ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI*2); ctx.fill();
        }
        ctx.restore();

        if (factor < 0.8) {
            ctx.fillStyle = World.colors.mountains;
            let mx = (cw/2) - (Camera.x * 0.1);
            for(let i=-5; i<5; i++) {
                ctx.beginPath();
                ctx.moveTo(mx + i*300 - 200, ch);
                ctx.lineTo(mx + i*300, ch - 300 - Math.abs(Math.sin(i))*100);
                ctx.lineTo(mx + i*300 + 200, ch);
                ctx.fill();
            }
        }

        if (factor > 0.2) {
            let opacity = (factor - 0.2) * 1.25;
            ctx.fillStyle = `rgba(15, 15, 20, ${opacity})`;
            let cx = (cw/2) - (Camera.x * 0.2);
            for(let i=-8; i<8; i++) {
                let w = 60 + Math.abs(Math.sin(i*3))*40;
                let h = 100 + Math.abs(Math.cos(i*2))*250 * factor;
                ctx.fillRect(cx + i*120, ch - h, w, h);
                ctx.fillRect(cx + i*120 + w/2 - 2, ch - h - 40, 4, 40);
                if (Math.random() < 0.1 * factor) FX.spawn(cx + i*120 + w/2 - Camera.x, ch - h - 40 - Camera.y, 'smog', 1);
            }
        }
    },
    drawGround(ctx) {
        ctx.fillStyle = World.colors.groundBase;
        ctx.beginPath(); ctx.ellipse(0, 80, 1400, 700, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = World.colors.groundLight;
        ctx.beginPath(); ctx.ellipse(0, 60, 1200, 600, 0, 0, Math.PI*2); ctx.fill();

        let lakeW = 500, lakeH = 200;
        ctx.fillStyle = World.colors.lake;
        ctx.beginPath(); ctx.ellipse(0, 40, lakeW, lakeH, 0, 0, Math.PI*2); ctx.fill();
        let factor = 1 - (World.health / 100);
        ctx.lineWidth = 3;
        for(let i=0; i<5; i++) {
            ctx.strokeStyle = factor > 0.5 ? 'rgba(0,0,0,0.3)' : `rgba(255,255,255,${0.2 - i*0.03})`;
            let waveOff = Math.sin(World.time * 2 + i) * 30;
            ctx.beginPath();
            ctx.moveTo(-200 + waveOff, 40 + i*30 - 60);
            ctx.lineTo(200 + waveOff, 40 + i*30 - 60);
            ctx.stroke();
            if (factor > 0.6 && Math.random() < 0.05) {
                ctx.fillStyle = '#7f8c8d';
                ctx.fillRect(-100 + waveOff + i*50, 40 + i*30 - 60, 10, 5);
            }
        }
    }
};

const Tree = {
    draw(ctx) {
        const factor = 1 - (World.health / 100), tx = 0, ty = -80;
        ctx.strokeStyle = World.colors.treeWood;
        ctx.lineWidth = 40; ctx.lineCap = 'round';
        for(let i=0; i<6; i++) {
            let rAng = (i/6) * Math.PI + Math.PI;
            ctx.beginPath(); ctx.moveTo(tx, ty);
            ctx.quadraticCurveTo(tx + Math.cos(rAng)*200, ty + 100, tx + Math.cos(rAng)*350, ty + 150 + Math.sin(rAng)*50);
            ctx.stroke();
        }
        ctx.fillStyle = World.colors.treeWood;
        ctx.beginPath(); ctx.moveTo(tx - 80, ty + 50);
        ctx.bezierCurveTo(tx - 100, ty - 250, tx - 50, ty - 500, tx, ty - 550);
        ctx.bezierCurveTo(tx + 50, ty - 500, tx + 100, ty - 250, tx + 80, ty + 50);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(tx - 40, ty); ctx.bezierCurveTo(tx - 30, ty - 200, tx - 20, ty - 400, tx - 10, ty - 500);
        ctx.stroke();

        if (World.health > 10) {
            let leafScale = Math.max(0, (World.health - 10) / 90);
            this.drawFoliageCluster(ctx, tx, ty - 580, 280 * leafScale, World.colors.treeLeaves, 0.8);
            this.drawFoliageCluster(ctx, tx - 120, ty - 450, 200 * leafScale, World.colors.treeLeaves, 0.6);
            this.drawFoliageCluster(ctx, tx + 120, ty - 480, 220 * leafScale, World.colors.treeLeaves, 0.7);
        }

        if (factor > 0.5) {
            ctx.strokeStyle = World.colors.treeWood; ctx.lineWidth = 15;
            ctx.beginPath(); ctx.moveTo(tx, ty - 400); ctx.lineTo(tx - 150, ty - 500); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(tx, ty - 450); ctx.lineTo(tx + 180, ty - 550); ctx.stroke();
            if(factor > 0.8) {
                if(Math.random() < 0.4) FX.spawn(tx + (Math.random()-0.5)*150, ty - 300 - Math.random()*200, 'fire', 2);
                if(Math.random() < 0.3) FX.spawn(tx + (Math.random()-0.5)*100, ty - 200, 'smog', 1);
            }
        }
    },
    drawFoliageCluster(ctx, cx, cy, radius, color, swayMult) {
        if(radius <= 0) return;
        ctx.fillStyle = color;
        let wind = Math.sin(World.time * swayMult) * 20;
        for(let i=0; i<15; i++) {
            let ang = (i/15) * Math.PI * 2 + (World.time * 0.1);
            let offX = Math.cos(ang) * (radius * 0.7) + wind;
            let offY = Math.sin(ang) * (radius * 0.5);
            ctx.beginPath(); ctx.arc(cx + offX, cy + offY, radius * 0.6, 0, Math.PI*2); ctx.fill();
        }
    }
};

// ==========================================
// 5. MOTOR DE PARTÍCULAS (LIMITADO)
// ==========================================
const FX = {
    particles: [],
    maxParticles: 250, // Limite para evitar lentidão
    spawn(x, y, type, count, options = {}) {
        if (this.particles.length > this.maxParticles) return;
        for(let i=0; i<count; i++) {
            let p = {
                x, y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
                size: Math.random()*10 + 5, life: 1, decay: 0.02,
                type, angle: Math.random()*Math.PI*2, rotV: (Math.random()-0.5)*0.2
            };
            if(type === 'leaf_png') { p.decay = 0.01; p.size = Math.random()*20 + 15; p.vy = Math.random()*2+1; }
            if(type === 'smog') { p.vy = -Math.random()*3 - 1; p.size = Math.random()*20+15; p.decay = 0.008; p.color = '#333'; }
            if(type === 'fire') { p.vy = -Math.random()*6 - 2; p.vx *= 0.5; p.size = Math.random()*15+5; p.decay = 0.03; p.color = Math.random()>0.5?'#e74c3c':'#f39c12'; }
            if(type === 'magic') { p.color = options.color || '#fff'; p.vy = -Math.random()*5-2; p.decay = 0.01; }
            this.particles.push(p);
        }
    },
    updateAndDraw(ctx) {
        for(let i=this.particles.length-1; i>=0; i--) {
            let p = this.particles[i];
            p.x += p.vx; p.y += p.vy; p.life -= p.decay; p.angle += p.rotV;
            if(p.type === 'smog') { p.size += 0.2; p.vx += (Math.random()-0.5)*0.5; }
            if(p.type === 'leaf_png') { p.vx += Math.sin(World.time*2 + p.y)*0.1; }
            if(p.life <= 0) { this.particles.splice(i, 1); continue; }
            ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle); ctx.globalAlpha = Math.max(0, p.life);
            if(p.type === 'leaf_png') { ctx.drawImage(imgFolha, -p.size/2, -p.size/2, p.size, p.size); }
            else if(p.type === 'smog' || p.type === 'fire') { ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(0,0, p.size, 0, Math.PI*2); ctx.fill(); }
            else if(p.type === 'magic') { ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size); }
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    }
};

// ==========================================
// 6. TABULEIRO E JOGADORES
// ==========================================
const Board = {
    tiles: [], cats: ['agua', 'lixo', 'transporte', 'energia', 'plantio'],
    init() {
        let numTiles = 32;
        for(let i=0; i<numTiles; i++) {
            let ang = (i/numTiles) * Math.PI * 2;
            this.tiles.push({
                id: i, x: Math.cos(ang) * 900, y: Math.sin(ang) * 450,
                cat: i === 0 ? 'start' : i % 7 === 0 ? 'special' : this.cats[i % this.cats.length], animY: Math.random() * Math.PI * 2
            });
        }
    },
    draw(ctx) {
        this.tiles.forEach(t => {
            t.animY += 0.05; let floatY = Math.sin(t.animY) * 8;
            ctx.save(); ctx.translate(t.x, t.y + floatY);
            ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 40 - floatY, 50, 20, 0, 0, Math.PI*2); ctx.fill();
            let topC = '#bdc3c7', sideC = '#7f8c8d', icon = '🏙️';
            if(t.cat !== 'start') {
                if(t.cat === 'agua') { topC = '#3498db'; sideC = '#2980b9'; icon = '🚰'; }
                if(t.cat === 'lixo') { topC = '#95a5a6'; sideC = '#7f8c8d'; icon = '🗑️'; }
                if(t.cat === 'transporte') { topC = '#e67e22'; sideC = '#d35400'; icon = '🚌'; }
                if(t.cat === 'energia') { topC = '#f1c40f'; sideC = '#f39c12'; icon = '⚡'; }
                if(t.cat === 'plantio') { topC = '#2ecc71'; sideC = '#27ae60'; icon = '🌱'; }
                if(t.cat === 'special') { topC = '#9b59b6'; sideC = '#6c3483'; icon = '✨'; }
            } else icon = '🏠';
            if (World.crisisMode && t.cat !== 'start') { topC = '#2b2b2b'; sideC = '#111'; icon = '🔥'; }
            ctx.fillStyle = sideC; ctx.beginPath(); ctx.moveTo(-45, 0); ctx.lineTo(0, 25); ctx.lineTo(45, 0); ctx.lineTo(0, 40); ctx.fill();
            ctx.fillStyle = topC; ctx.beginPath(); ctx.moveTo(-45, 0); ctx.lineTo(0, -25); ctx.lineTo(45, 0); ctx.lineTo(0, 25); ctx.fill();
            ctx.fillStyle = '#fff'; ctx.font = '26px Montserrat'; ctx.textAlign = 'center'; ctx.fillText(icon, 0, -35);
            ctx.restore();
        });
    }
};

class Player {
    constructor(name, color, isHuman) {
        this.name = name; this.color = color; this.isHuman = isHuman;
        this.lives = 3; this.state = 'active'; this.tileIdx = 0;
        this.x = Board.tiles[0].x; this.y = Board.tiles[0].y;
        this.targetX = this.x; this.targetY = this.y; this.moveQueue = [];
        this.bounce = 0; this.animTime = 0; this.isMoving = false;
        this.goodActions = 0;
        this.extraTurn = false;
        this.shield = false;
        this.tilesWalked = 0;
        this.badActions = 0;
        this.revives = 0;
        this.totalGood = 0;
    }
    walk(steps) {
        this.tilesWalked += steps;
        if (this.isMoving) return; this.isMoving = true;
        for(let i=1; i<=steps; i++) {
            let next = (this.tileIdx + i) % Board.tiles.length;
            this.moveQueue.push(Board.tiles[next]);
        }
        this.tileIdx = (this.tileIdx + steps) % Board.tiles.length;
        this.processQueue();
    }
    processQueue() {
        if(this.moveQueue.length > 0) {
            let t = this.moveQueue.shift();
            this.targetX = t.x; this.targetY = t.y;
        } else {
            this.isMoving = false;
            setTimeout(() => Game.handleTileArrival(this), 600);
        }
    }
    update() {
        if(this.state === 'dead') return;
        let dx = this.targetX - this.x, dy = this.targetY - this.y;
        let dist = Math.sqrt(dx*dx + dy*dy); this.animTime += 0.1;
        if (dist > 3) {
            this.x += dx * 0.15; this.y += dy * 0.15;
            this.bounce = Math.abs(Math.sin(this.animTime * 2)) * 30;
            Camera.targetX = this.x; Camera.targetY = this.y;
        } else if (dist <= 3 && this.isMoving) {
            this.x = this.targetX; this.y = this.targetY; this.bounce = 0;
            this.processQueue(); FX.spawn(this.x, this.y, 'magic', 5, {color: this.color});
        } else { this.bounce = Math.sin(this.animTime * 0.5) * 5; }
    }
    draw(ctx) {
        if (this.state === 'dead') return;
        ctx.save();
        ctx.translate(this.x, this.y - this.bounce);

        ctx.fillStyle = 'rgba(0,0,0,0.30)';
        ctx.beginPath();
        ctx.ellipse(0, 42, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        let grad = ctx.createLinearGradient(0,-40,0,40);
        grad.addColorStop(0, this.color);
        grad.addColorStop(1, '#111');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(-22, 30);
        ctx.quadraticCurveTo(-28, 10, -16, -5);
        ctx.lineTo(-10, -30);
        ctx.quadraticCurveTo(0, -50, 10, -30);
        ctx.lineTo(16, -5);
        ctx.quadraticCurveTo(28, 10, 22, 30);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.beginPath();
        ctx.ellipse(-6, -18, 6, 14, -0.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(0, -42, 15, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.beginPath();
        ctx.arc(-5, -48, 5, 0, Math.PI * 2);
        ctx.fill();

        if (this.state === 'dead') {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#555';
            ctx.fillRect(-18, -8, 36, 8);
        }

        ctx.restore();
    }
}

// ==========================================
// 8. O MOTOR PRINCIPAL DE JOGO (GAME)
// ==========================================
const Game = {
    players: [], currIdx: 0, isRollingDice: false,
    turnLocked: false,
    botTimeout: null,
    gameEnded: false,
    chars: [
        {name: 'AGENTE VERDE', hex: '#2ecc71'}, {name: 'AGENTE AZUL', hex: '#3498db'},
        {name: 'AGENTE VERMELHO', hex: '#e74c3c'}, {name: 'AGENTE AMARELO', hex: '#f1c40f'},
        {name: 'AGENTE ROXO', hex: '#9b59b6'}
    ],
    selectedChar: null, selectedBots: [],
    init() { Board.init(); this.setupMenus(); this.loop(); },
    checkWinner() {
        let alivePlayers = this.players.filter(p => p.state === 'active');
        if(alivePlayers.length === 1) {
            let winner = alivePlayers[0];
            this.triggerWinner(winner);
            return true;
        }
        if(alivePlayers.length <= 0) {
            this.triggerGameOver();
            return true;
        }
        return false;
    },
    triggerWinner(winner) {
        this.gameEnded = true;
        clearTimeout(this.botTimeout);
        document.getElementById('btn-roll-dice').disabled = true;
        this.players.forEach(p => { p.moveQueue = []; p.targetX = p.x; p.targetY = p.y; p.isMoving = false; });
        Camera.targetX = 0;
        Camera.targetY = -200;
        Camera.zoom = 0.75;
        World.targetHealth = 100;
        const msg = document.getElementById('cinematic-message');
        document.getElementById('cine-title').innerText = "CAMPEÃO AMBIENTAL";
        document.getElementById('cine-title').style.color = winner.color;
        document.getElementById('cine-desc').innerText = winner.name + " salvou a cidade e protegeu a árvore da vida!";
        msg.classList.remove('hidden');
        msg.style.opacity = '1';
        msg.style.display = 'flex';
        FX.spawn(0, -250, 'leaf_png', 80);
        FX.spawn(0, -250, 'magic', 60, { color: winner.color });
        this.showFinalRanking(winner);
        const persistentUI = document.getElementById('persistent-end-ui');
        persistentUI.classList.remove('hidden');
        persistentUI.style.display = 'flex';
        const restartBtn = document.getElementById('btn-restart-game');
        restartBtn.classList.remove('hidden');
        restartBtn.style.display = 'block';
        restartBtn.onclick = () => { window.location.reload(); };
        setTimeout(() => {
            msg.style.transition = 'opacity 1s ease-out';
            msg.style.opacity = '0';
            setTimeout(() => {
                msg.style.display = 'none';
            }, 1000);
        }, 5000);
    },
    triggerCrisisMode() {
        Camera.shake(40);
        FX.spawn(0, -250, 'fire', 80);
        FX.spawn(0, -250, 'smog', 100);
        let msg = document.getElementById('cinematic-message');
        document.getElementById('cine-title').innerText = "COLAPSO AMBIENTAL";
        document.getElementById('cine-title').style.color = "#ff4444";
        document.getElementById('cine-desc').innerText = "A árvore da vida está morrendo. A cidade entrou em crise.";
        msg.classList.remove('hidden');
    },
    showFinalRanking(winner) {
        const ranking = document.getElementById('final-ranking');
        ranking.innerHTML = '';
        let sorted = [...this.players].sort((a,b) => {
            if(a.state === 'active' && b.state !== 'active') return -1;
            if(b.state === 'active' && a.state !== 'active') return 1;
            if(b.lives !== a.lives) return b.lives - a.lives;
            if(b.totalGood !== a.totalGood) return b.totalGood - a.totalGood;
            return b.tilesWalked - a.tilesWalked;
        });
        sorted.forEach((p, index) => {
            let row = document.createElement('div');
            row.className = 'ranking-row';
            row.innerHTML = `<div class="ranking-pos">#${index + 1}</div><div class="ranking-color" style="background:${p.color}"></div><div class="ranking-name">${p.name}</div><div class="ranking-stats">🌱 ${p.totalGood} &nbsp;&nbsp; ☠️ ${p.badActions} &nbsp;&nbsp; 🏁 ${p.tilesWalked} &nbsp;&nbsp; ❤️ ${Math.max(0,p.lives)}</div>`;
            ranking.appendChild(row);
        });
        ranking.classList.remove('hidden');
        ranking.style.display = 'flex';
    },
    setupMenus() {
        const charGrid = document.getElementById('char-options');
        this.chars.forEach(c => {
            const card = document.createElement('div'); card.className = 'char-card';
            card.innerHTML = `<div class="avatar-preview" style="background:${c.hex}"></div><p style="font-family:'Press Start 2P'; font-size:9px;">${c.name}</p>`;
            card.onclick = () => {
                document.querySelectorAll('.char-card').forEach(x => x.classList.remove('selected'));
                card.classList.add('selected'); this.selectedChar = c;
                document.getElementById('btn-confirm-char').disabled = false;
            };
            charGrid.appendChild(card);
        });
        document.getElementById('btn-main-play').onclick = () => {
            document.getElementById('screen-start').classList.add('hidden');
            document.getElementById('screen-char-select').classList.remove('hidden');
        };
        document.getElementById('btn-confirm-char').onclick = () => {
            document.getElementById('screen-char-select').classList.add('hidden'); this.buildBotMenu();
        };
        document.getElementById('btn-roll-dice').onclick = () => this.rollDice();
    },
    buildBotMenu() {
        const botGrid = document.getElementById('bot-options'); botGrid.innerHTML = '';
        this.chars.filter(c => c !== this.selectedChar).forEach(c => {
            const card = document.createElement('div'); card.className = 'bot-card';
            card.style.borderColor = c.hex; card.innerHTML = `<p style="color:${c.hex}">${c.name}</p>`;
            card.onclick = () => {
                card.classList.toggle('active');
                if(card.classList.contains('active')) this.selectedBots.push(c);
                else this.selectedBots = this.selectedBots.filter(b => b !== c);
            };
            botGrid.appendChild(card);
        });
        document.getElementById('screen-bot-select').classList.remove('hidden');
        document.getElementById('btn-start-game').onclick = () => {
            if(this.selectedBots.length === 0) { alert("Escolha pelo menos 1 bot!"); return; }
            document.getElementById('screen-bot-select').classList.add('hidden'); this.startMatch();
        };
    },
    startMatch() {
        this.players.push(new Player(this.selectedChar.name, this.selectedChar.hex, true));
        this.selectedBots.forEach(b => this.players.push(new Player(`BOT ${b.name}`, b.hex, false)));
        document.getElementById('game-ui').classList.remove('hidden'); World.targetHealth = 60; this.beginTurn();
    },
    beginTurn() {
        if(this.gameEnded) return;
        let activePlayers = this.players.filter(p => p.state === 'active');
        if(activePlayers.length <= 1) {
            this.checkWinner();
            return;
        }
        if (this.turnLocked) return;
        this.turnLocked = true;
        let p = this.players[this.currIdx]; if(p.state === 'dead') { this.advanceTurn(); return; }
        Camera.targetX = p.x; Camera.targetY = p.y; Camera.zoom = 1.1; this.updateHUD(p);
        const btn = document.getElementById('btn-roll-dice'), header = document.getElementById('dice-owner-text');
        if (p.isHuman) { header.innerText = "SUA VEZ!"; header.style.color = p.color; btn.disabled = false; }
        else { header.innerText = `TURNO: ${p.name}`; header.style.color = p.color; btn.disabled = true; clearTimeout(this.botTimeout); this.botTimeout = setTimeout(() => { this.rollDice(); }, 1500); }
    },
    rollDice() {
        if(this.gameEnded) return;
        if (this.turnLocked === false) return;
        if (this.isRollingDice) return; this.isRollingDice = true;
        const btn = document.getElementById('btn-roll-dice'); btn.disabled = true;
        const diceEl = document.getElementById('physical-dice'), valEl = document.getElementById('physical-dice-val');
        diceEl.classList.remove('hidden'); diceEl.classList.add('rolling');
        let p = this.players[this.currIdx]; diceEl.style.color = p.color;
        let rolls = 0, interval = setInterval(() => {
            valEl.innerText = Math.floor(Math.random()*6)+1; rolls++;
            if(rolls > 15) {
                clearInterval(interval); let finalVal = Math.floor(Math.random()*4)+1;
                valEl.innerText = finalVal; diceEl.classList.remove('rolling'); Camera.shake(5);
                FX.spawn(p.x, p.y, 'magic', 20, {color: p.color});
                setTimeout(() => { diceEl.classList.add('hidden'); p.walk(finalVal); this.isRollingDice = false; }, 1000);
            }
        }, 80);
    },
    handleTileArrival(player) {
        if(this.gameEnded) return;
        let tile = Board.tiles[player.tileIdx];
        if(tile.cat === 'special') {
            Camera.shake(8);
            FX.spawn(player.x, player.y, 'leaf_png', 20);
            let reward = Math.floor(Math.random() * 3);
            if(reward === 0) {
                if(player.lives < 3) {
                    player.lives++;
                    this.updateHUD(player);
                    this.showSpecialMessage("🌱 VIDA EXTRA!", player.name + " inspirou a população!");
                }
            }
            if(reward === 1) {
                player.extraTurn = true;
                this.showSpecialMessage("🎲 JOGADA EXTRA!", player.name + " recebeu apoio da cidade!");
            }
            if(reward === 2) {
                player.shield = true;
                this.showSpecialMessage("🛡️ PROTEÇÃO AMBIENTAL!", "O próximo erro não tirará vida!");
            }
            setTimeout(() => { if(!this.gameEnded) this.advanceTurn(); }, 1800);
            return;
        }
        if(tile.cat === 'start') { this.advanceTurn(); return; }
        Camera.targetX = player.x; Camera.targetY = player.y - 100; Camera.zoom = 1.3;
        const sit = UrbanEcoDatabase.getSituation(tile.cat);
        setTimeout(() => { if(this.gameEnded) return; if(player.isHuman) this.showDecisionUI(sit, player); else this.botMakeDecision(sit, player); }, 800);
    },
    showDecisionUI(sit, player) {
        if(this.gameEnded) return;
        const modal = document.getElementById('decision-modal');
        document.getElementById('decision-title').innerText = sit.title;
        document.getElementById('decision-icon').innerText = sit.icon;
        document.getElementById('decision-desc').innerText = sit.desc;
        document.getElementById('decision-visual-context').style.background = `linear-gradient(45deg, #111, ${player.color})`;
        const optCont = document.getElementById('decision-options'); optCont.innerHTML = '';
        sit.opts.forEach(opt => {
            let b = document.createElement('button'); b.className = 'btn-choice'; b.innerText = opt.text;
            b.onclick = () => { modal.classList.add('hidden'); this.applyConsequence(player, opt); };
            optCont.appendChild(b);
        });
        modal.classList.remove('hidden');
    },
    botMakeDecision(sit, bot) {
        if(this.gameEnded) return;
        let goodOpts = sit.opts.filter(o => o.type === 'good'), badOpts = sit.opts.filter(o => o.type !== 'good');
        let choice = (Math.random() < 0.7 && goodOpts.length > 0) ? goodOpts[Math.floor(Math.random()*goodOpts.length)] : badOpts[Math.floor(Math.random()*badOpts.length)];
        const feed = document.getElementById('bot-educational-feed'), toast = document.createElement('div');
        toast.className = 'bot-toast'; toast.style.borderLeftColor = bot.color;
        toast.innerHTML = `<h4 style="color:${bot.color}">${bot.name}</h4><p>${sit.title}</p><p>"${choice.text}"</p><p class="exp" style="color:${choice.type==='good'?'#2ecc71':'#e74c3c'}">${choice.exp}</p>`;
        feed.appendChild(toast); setTimeout(() => toast.remove(), 7000);
        setTimeout(() => { if(!this.gameEnded) this.applyConsequence(bot, choice); }, 3000);
    },
    applyConsequence(player, choice) {
        if(this.gameEnded) return;
        Camera.targetX = 0; Camera.targetY = -150; Camera.zoom = 0.9;
        if (choice.type === 'good') {
            FX.spawn(player.x, player.y, 'leaf_png', 40); World.targetHealth += World.crisisMode ? 25 : 15; Camera.shake(5);
            player.totalGood++;
            player.goodActions++;
            if (player.goodActions >= 3) {
                player.goodActions = 0;
                player.extraTurn = true;
                FX.spawn(player.x, player.y, 'magic', 25, { color: '#2ecc71' });
                if(!this.gameEnded) {
                    let toast = document.createElement('div');
                    toast.className = 'combo-toast';
                    toast.innerText = player.name + " ganhou uma jogada extra por ajudar a cidade!";
                    document.body.appendChild(toast);
                    setTimeout(() => { toast.remove(); }, 3000);
                }
            }
        }
        else if (choice.type === 'bad') {
            if(player.shield) {
                player.shield = false;
                this.showSpecialMessage("🛡️ ESCUDO USADO!", "Você aprendeu com seu erro!");
            } else {
                FX.spawn(player.x, player.y, 'smog', 30); World.targetHealth -= World.crisisMode ? 30 : 20; player.lives--; Camera.shake(15);
                let flash = document.getElementById('flash-fx'); flash.style.background = 'rgba(255,0,0,0.5)';
                flash.classList.remove('hidden'); setTimeout(()=> flash.classList.add('hidden'), 200);
            }
            player.badActions++;
        } else { FX.spawn(player.x, player.y, 'smog', 10); World.targetHealth -= 5; }
        if(World.targetHealth > 100) World.targetHealth = 100; if(World.targetHealth < 0) World.targetHealth = 0;
        this.updateHUD(player);
        setTimeout(() => {
            if(this.gameEnded) return;
            if(player.lives <= 0) {
                player.state = 'dead';
                FX.spawn(player.x, player.y, 'smog', 50);
                Camera.shake(20);
                this.showSpecialMessage("☠️ ELIMINADO!", player.name + " destruiu o ambiente.");
            }
            if(this.checkWinner()) {
                return;
            }
            this.advanceTurn();
        }, 2500);
    },
    advanceTurn() {
        if(this.gameEnded) return;
        let alivePlayers = this.players.filter(p => p.state === 'active');
        if(alivePlayers.length <= 1) {
            this.checkWinner();
            return;
        }
        let currentPlayer = this.players[this.currIdx];
        if(currentPlayer.extraTurn) {
            currentPlayer.extraTurn = false;
            this.turnLocked = false;
            this.beginTurn();
            return;
        }
        this.turnLocked = false;
        this.currIdx = (this.currIdx + 1) % this.players.length; this.beginTurn();
    },
    showSpecialMessage(title, desc) {
        if(this.gameEnded) return;
        const msg = document.getElementById('cinematic-message');
        document.getElementById('cine-title').innerText = title;
        document.getElementById('cine-title').style.color = '#fff';
        document.getElementById('cine-desc').innerText = desc;
        msg.classList.remove('hidden');
        setTimeout(() => { if(!this.gameEnded) msg.classList.add('hidden'); }, 2000);
    },
    updateHUD(p) {
        document.getElementById('current-player-name').innerText = p.name;
        document.getElementById('current-player-name').style.color = p.color;
        document.getElementById('player-lives').innerHTML = "❤️".repeat(Math.max(0, p.lives));
        let status = "ESTÁVEL";
        if(p.lives === 2) status = "ATENÇÃO"; if(p.lives === 1) status = "PERIGO"; if(p.lives <= 0) status = "ELIMINADO";
        document.getElementById('player-status').innerText = status;
    },
    triggerGameOver() {
        this.gameEnded = true;
        clearTimeout(this.botTimeout);
        document.getElementById('btn-roll-dice').disabled = true;
        this.players.forEach(p => { p.moveQueue = []; p.targetX = p.x; p.targetY = p.y; p.isMoving = false; });
        Camera.targetX = 0; Camera.targetY = -200; Camera.zoom = 0.8; World.targetHealth = -10;
        const msg = document.getElementById('cinematic-message');
        msg.classList.remove('hidden');
        msg.style.opacity = '1';
        msg.style.display = 'flex';
        document.getElementById('cine-title').innerText = "COLAPSO URBANO";
        document.getElementById('cine-title').style.color = '#e74c3c';
        document.getElementById('cine-desc').innerText = "A cidade sucumbiu à poluição e ao descaso.";
        this.showFinalRanking();
        const persistentUI = document.getElementById('persistent-end-ui');
        persistentUI.classList.remove('hidden');
        persistentUI.style.display = 'flex';
        const restartBtn = document.getElementById('btn-restart-game');
        restartBtn.classList.remove('hidden');
        restartBtn.style.display = 'block';
        restartBtn.onclick = () => { window.location.reload(); };
        setTimeout(() => {
            msg.style.transition = 'opacity 1s ease-out';
            msg.style.opacity = '0';
            setTimeout(() => {
                msg.style.display = 'none';
            }, 1000);
        }, 5000);
    },
    loop() {
        ctx.clearRect(0, 0, cw, ch); World.update(); Camera.update();
        Environment.drawBackground(ctx); Camera.apply(ctx);
        Environment.drawGround(ctx); Board.draw(ctx); Tree.draw(ctx);
        if(!this.gameEnded && World.crisisMode) {
            if(Math.random() < 0.15) {
                FX.spawn((Math.random() - 0.5) * 2000, Math.random() * 1000, 'smog', 1);
            }
            if(Math.random() < 0.08) {
                FX.spawn((Math.random() - 0.5) * 1200, Math.random() * 800, 'fire', 1);
            }
        }
        let renderList = [...this.players].sort((a,b) => a.y - b.y);
        renderList.forEach(p => { p.update(); p.draw(ctx); }); FX.updateAndDraw(ctx);
        Camera.restore(ctx);
        requestAnimationFrame(() => this.loop());
    }
};

Game.init();
