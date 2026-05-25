@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700&family=Montserrat:wght@400;700&family=Press+Start+2P&display=swap');

* { margin: 0; padding: 0; box-sizing: border-box; user-select: none; }
body { background: #000; color: #fff; font-family: 'Montserrat', sans-serif; overflow: hidden; }

#game-container { position: relative; width: 100vw; height: 100vh; background: #000; }
canvas { display: block; width: 100%; height: 100%; }

/* Filtros Atmosféricos e Cinematográficos */
#vignette { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.85) 100%); pointer-events: none; z-index: 5; transition: 2s; }
.ambient-fx { position: absolute; inset: 0; pointer-events: none; z-index: 6; opacity: 0; transition: opacity 3s ease; mix-blend-mode: overlay; }
#light-rays { background: repeating-linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.03) 10%, transparent 20%); animation: shiftRays 20s linear infinite; }
#toxic-smog { background: radial-gradient(circle at bottom, rgba(139,69,19,0.3) 0%, rgba(50,50,50,0.5) 100%); mix-blend-mode: multiply; }
@keyframes shiftRays { 0% { background-position: 0 0; } 100% { background-position: 100vw 100vh; } }

#damage-overlay { position: absolute; inset: 0; background: radial-gradient(circle, transparent 40%, rgba(150, 0, 0, 0.4) 100%); pointer-events: none; z-index: 7; animation: pulseDamage 1s infinite alternate; }
@keyframes pulseDamage { from { opacity: 0.3; } to { opacity: 1; } }

/* Menus Cinematográficos */
.screen { position: absolute; inset: 0; z-index: 300; background: radial-gradient(circle, #0f1c16 0%, #030504 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.8s ease; }
.title-container { text-align: center; margin-bottom: 50px; }
.title-container h1 { font-family: 'Cinzel Decorative', serif; font-size: 5vw; color: #2ecc71; text-shadow: 0 0 50px rgba(46,204,113,0.5), 0 10px 0 #145a32; margin-bottom: 15px; letter-spacing: 5px; }
.subtitle { font-size: 1.5vw; color: #a9dfbf; letter-spacing: 8px; text-transform: uppercase; font-weight: bold; }
.cinematic-title { font-family: 'Cinzel Decorative', serif; font-size: 3vw; color: #f1c40f; margin-bottom: 10px; }
.cinematic-subtitle { font-size: 1.2vw; color: #ccc; margin-bottom: 40px; }

/* Grids de Seleção */
.char-grid, .bot-grid { display: flex; gap: 30px; margin-bottom: 50px; }
.char-card { width: 140px; height: 180px; background: rgba(0,0,0,0.6); border: 2px solid rgba(255,255,255,0.1); border-radius: 15px; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
.char-card:hover { transform: translateY(-10px); border-color: rgba(255,255,255,0.5); }
.char-card.selected { border-color: #f1c40f; background: rgba(241, 196, 15, 0.15); transform: scale(1.15) translateY(-15px); box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 20px rgba(241,196,15,0.4); }
.char-card .avatar-preview { width: 60px; height: 70px; margin-bottom: 20px; border-radius: 8px; box-shadow: inset 0 -10px 20px rgba(0,0,0,0.5); }

.bot-card { padding: 25px; background: rgba(0,0,0,0.5); border: 2px solid #333; border-radius: 12px; cursor: pointer; opacity: 0.4; transition: 0.3s; font-weight: bold; }
.bot-card.active { opacity: 1; border-color: #e74c3c; background: rgba(231, 76, 60, 0.15); box-shadow: 0 0 15px rgba(231, 76, 60, 0.4); transform: scale(1.05); }

/* HUD In-Game */
#game-ui { position: absolute; inset: 0; pointer-events: none; z-index: 100; }
.ui-box { pointer-events: all; position: absolute; background: linear-gradient(145deg, rgba(15,20,25,0.95), rgba(5,5,10,0.98)); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 25px; box-shadow: 0 20px 50px rgba(0,0,0,0.8); backdrop-filter: blur(15px); }
#player-hud { bottom: 40px; left: 40px; width: 300px; }
#dice-panel { bottom: 40px; right: 40px; width: 300px; display: flex; flex-direction: column; align-items: center; }

#world-health-ui { position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 600px; text-align: center; }
#world-title { font-family: 'Cinzel Decorative', serif; font-size: 24px; letter-spacing: 4px; margin-bottom: 12px; text-shadow: 0 5px 15px #000; }
.health-track { width: 100%; height: 20px; background: rgba(0,0,0,0.8); border: 2px solid rgba(255,255,255,0.2); border-radius: 10px; overflow: hidden; box-shadow: inset 0 5px 10px rgba(0,0,0,0.9); }
#health-bar { height: 100%; width: 50%; background: linear-gradient(90deg, #8b0000, #e67e22, #2ecc71, #27ae60); transition: width 2s cubic-bezier(0.22, 1, 0.36, 1), background 2s; }
#world-status-text { margin-top: 10px; font-size: 14px; color: #aaa; font-style: italic; letter-spacing: 2px; }

/* Dado */
#physical-dice { width: 90px; height: 90px; background: #fff; color: #111; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-family: 'Press Start 2P'; font-size: 36px; box-shadow: 0 12px 0 #bdc3c7, 0 20px 30px rgba(0,0,0,0.5); }
.rolling { animation: diceRoll 0.12s infinite alternate ease-in-out; }
@keyframes diceRoll { 0% { transform: translateY(0) rotate(-10deg); } 100% { transform: translateY(-30px) rotate(20deg); } }

/* Botões */
.btn-action { width: 100%; padding: 20px; font-family: 'Press Start 2P', cursive; font-size: 12px; background: linear-gradient(to bottom, #2ecc71, #27ae60); color: white; border: 2px solid #fff; border-radius: 12px; cursor: pointer; box-shadow: 0 8px 0 #145a32; transition: all 0.15s; letter-spacing: 1px; }
.btn-action:hover { filter: brightness(1.1); transform: translateY(-2px); box-shadow: 0 10px 0 #145a32; }
.btn-action:active { transform: translateY(6px); box-shadow: 0 2px 0 #145a32; }
.btn-action:disabled { background: #444; border-color: #666; color: #888; box-shadow: 0 8px 0 #222; cursor: not-allowed; }
.btn-action.secondary { background: linear-gradient(to bottom, #34495e, #2c3e50); box-shadow: 0 8px 0 #1a252f; margin-top: 20px; }

/* Modal de Decisão (Foco Urbano) */
.decision-card { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 650px; background: rgba(10, 15, 20, 0.98); border: 1px solid #555; border-top: 5px solid #3498db; border-radius: 15px; padding: 40px; z-index: 400; pointer-events: all; box-shadow: 0 30px 60px rgba(0,0,0,0.9), 0 0 30px rgba(52, 152, 219, 0.2); }
.card-header { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 15px; }
#decision-icon { font-size: 40px; }
#decision-title { font-family: 'Cinzel Decorative', serif; font-size: 28px; color: #3498db; }
#decision-visual-context { width: 100%; height: 120px; background: #111; border-radius: 10px; margin-bottom: 20px; border: 1px solid #333; overflow: hidden; position: relative; }
/* O visual context será desenhado via JS para simular o ambiente urbano da pergunta */
#decision-desc { font-size: 16px; line-height: 1.6; color: #e0e0e0; margin-bottom: 30px; font-weight: 500; }
.options-vertical { display: flex; flex-direction: column; gap: 12px; }
.btn-choice { padding: 18px 25px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-left: 4px solid #7f8c8d; border-radius: 8px; color: #fff; font-family: 'Montserrat'; font-size: 15px; font-weight: bold; text-align: left; cursor: pointer; transition: 0.2s; }
.btn-choice:hover { background: rgba(255,255,255,0.1); border-left-color: #f1c40f; transform: translateX(10px); }

/* Toasts e Cutscenes */
#bot-educational-feed { position: absolute; top: 120px; right: 40px; width: 400px; display: flex; flex-direction: column; gap: 15px; z-index: 200; pointer-events: none; }
.bot-toast { background: rgba(15,20,25,0.95); border-left: 6px solid #fff; padding: 20px; border-radius: 10px; box-shadow: 0 15px 30px rgba(0,0,0,0.6); animation: toastSlide 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
.bot-toast h4 { font-family: 'Press Start 2P'; font-size: 11px; margin-bottom: 10px; }
.bot-toast p { font-size: 14px; line-height: 1.5; color: #ddd; }
.bot-toast .exp { font-style: italic; color: #a5c378; margin-top: 8px; font-size: 13px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; }
@keyframes toastSlide { from { transform: translateX(120%); } to { transform: translateX(0); } }

#cinematic-message { position: absolute; top: 35%; left: 0; width: 100%; text-align: center; background: linear-gradient(90deg, transparent, rgba(0,0,0,0.9) 20%, rgba(0,0,0,0.9) 80%, transparent); padding: 50px 0; border-top: 2px solid #fff; border-bottom: 2px solid #fff; z-index: 99999; backdrop-filter: blur(5px); display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 1s ease-out; }
#cine-title { font-family: 'Cinzel Decorative'; font-size: 50px; letter-spacing: 8px; margin-bottom: 15px; }
#cine-desc { font-size: 20px; color: #ddd; letter-spacing: 2px; }
#persistent-end-ui { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 90%; max-width: 960px; display: flex; flex-direction: column; align-items: center; padding-bottom: 40px; z-index: 999999; pointer-events: all; }
#final-ranking { margin-top: 30px; width: 100%; background: rgba(0,0,0,0.85); border-radius: 20px; padding: 25px; backdrop-filter: blur(10px); box-shadow: 0 0 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; z-index: 999999; }
.ranking-row { display: flex; align-items: center; justify-content: space-between; gap: 15px; margin-bottom: 14px; padding: 14px; border-radius: 14px; background: rgba(255,255,255,0.05); font-family: 'Press Start 2P'; }
.ranking-pos { font-size: 18px; color: #fff; }
.ranking-color { width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; }
.ranking-name { flex: 1; color: white; font-size: 12px; }
.ranking-stats { color: #2ecc71; font-size: 10px; text-align: right; }
#btn-restart-game { margin-top: 25px; padding: 18px 40px; border: none; border-radius: 14px; background: linear-gradient(45deg, #2ecc71, #27ae60); color: white; font-size: 18px; font-family: 'Press Start 2P'; cursor: pointer; box-shadow: 0 0 25px rgba(46,204,113,0.6); transition: 0.3s; pointer-events: all; position: relative; z-index: 999999; }
#btn-restart-game:hover { transform: scale(1.08); }
.combo-toast { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: linear-gradient(135deg, #2ecc71, #27ae60); border: 3px solid #fff; border-radius: 20px; padding: 30px 40px; font-family: 'Press Start 2P'; font-size: 16px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); z-index: 450; pointer-events: none; box-shadow: 0 0 50px rgba(46,204,113,0.8), 0 20px 60px rgba(0,0,0,0.7); animation: comboPopUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
@keyframes comboPopUp { from { transform: translate(-50%, -50%) scale(0); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
.hidden { display: none !important; opacity: 0; pointer-events: none; }
